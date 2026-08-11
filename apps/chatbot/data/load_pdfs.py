import os
import re
import shutil

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_community.vectorstores.utils import filter_complex_metadata

from langchain_community.retrievers import BM25Retriever
from langchain_classic.retrievers import EnsembleRetriever


# =========================
# PROJECT ROOT & PATHS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = BASE_DIR

DEPARTMENT_DIR = os.path.join(DATA_DIR, "Department")

COURSES_PDF = os.path.join(DEPARTMENT_DIR, "courses.pdf")
BYLAWS_PDF = os.path.join(DEPARTMENT_DIR, "general_rules.pdf")

CHROMA_DIR = os.path.join(DATA_DIR, "chroma_laiha_v2")

# =========================
# TEXT CLEANING
# =========================
def clean_extracted_text(text: str) -> str:
    if not text:
        return ""

    replacements = {
        'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬀ': 'ff',
        '': '',
        'Ư': 'ff',
        '\u200c': '',
    }

    for bad, good in replacements.items():
        text = text.replace(bad, good)

    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)

    return text.strip()


# =========================
# VECTOR DB BUILDER
# =========================
def build_vectordb(force_rebuild: bool = False):
    all_chunks = []

    embeddings = HuggingFaceEmbeddings(
        model_name="intfloat/multilingual-e5-large",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )

    db_file = os.path.join(CHROMA_DIR, "chroma.sqlite3")

    # =========================
    # LOAD EXISTING DB WITH HYBRID RETRIEVER WORKING
    # =========================
    if (
        os.path.exists(CHROMA_DIR)
        and os.path.exists(db_file)
        and len(os.listdir(CHROMA_DIR)) > 0
        and not force_rebuild
    ):
        print("📦 Loading existing Chroma DB...")

        vectordb = Chroma(
            persist_directory=CHROMA_DIR,
            embedding_function=embeddings,
            collection_name="langchain"
        )

        print("⚙️ Recreating BM25 from existing database documents for Hybrid Search...")
    
        db_data = vectordb.get()
        
        meta_key = 'metadatas' if 'metadatas' in db_data else 'metas'
        
        recovered_chunks = [
            Document(page_content=text, metadata=meta)
            for text, meta in zip(db_data['documents'], db_data[meta_key])
        ]

        bm25_retriever = BM25Retriever.from_documents(recovered_chunks)
        bm25_retriever.k = 10

        vector_retriever = vectordb.as_retriever(search_kwargs={"k": 10})

        ensemble_retriever = EnsembleRetriever(
            retrievers=[bm25_retriever, vector_retriever],
            weights=[0.5, 0.5]
        )

        print("✅ Hybrid Ensemble Retriever loaded successfully from disk!")
        return vectordb, ensemble_retriever

    # =========================
    # CLEAN OLD DB
    # =========================
    if os.path.exists(CHROMA_DIR) and force_rebuild:
        shutil.rmtree(CHROMA_DIR)
        print("🧹 Old Chroma DB removed")

    os.makedirs(CHROMA_DIR, exist_ok=True)

    # =========================
    # PROCESS COURSES
    # =========================
    if os.path.exists(COURSES_PDF):
        print("📄 Processing courses.pdf ...")

        loader = PyMuPDFLoader(COURSES_PDF)
        pages = loader.load()

        full_text = "\n\n".join([p.page_content for p in pages])
        full_text = clean_extracted_text(full_text)

        courses_raw = re.split(r"={10,}", full_text)

        for content in courses_raw:
            content = content.strip()
            if not content or "COURSE_CODE" not in content:
                continue

            code_match = re.search(r"COURSE_CODE:\s*([\d-]+)", content)
            name_match = re.search(r"COURSE_NAME:\s*(.+?)(?=\n|$)", content)

            doc = Document(
                page_content=content,
                metadata={
                    "course_code": code_match.group(1) if code_match else "Unknown",
                    "course_name": name_match.group(1).strip() if name_match else "Unknown",
                    "section": "courses",
                    "source": "courses.pdf"
                }
            )

            all_chunks.append(doc)

    # =========================
    # PROCESS BYLAWS
    # =========================
    if os.path.exists(BYLAWS_PDF):
        print("📄 Processing bylaws ...")

        loader = PyMuPDFLoader(BYLAWS_PDF)
        pages = loader.load()

        full_text = "\n\n".join([p.page_content for p in pages])
        full_text = clean_extracted_text(full_text)

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1800,
            chunk_overlap=300,
            separators=["\n\nمادة ", "\nمادة ", "\n\nالباب ", "\n\n", "\n", " "]
        )

        chunks = splitter.split_text(full_text)

        for i, content in enumerate(chunks):
            content = content.strip()
            if len(content) < 50:
                continue

            title_match = re.search(r"(مادة\s*\d+[أ-ي]*|الباب\s+\S+)", content)
            title = title_match.group(1) if title_match else f"بند_{i+1}"

            doc = Document(
                page_content=content,
                metadata={
                    "course_code": "LAW",
                    "course_name": title,
                    "section": "bylaws",
                    "source": "general_rules.pdf"
                }
            )

            all_chunks.append(doc)

    print(f"📊 Total chunks: {len(all_chunks)}")

    if not all_chunks:
        raise ValueError("No documents found to build vector DB")

    # =========================
    # FILTER METADATA
    # =========================
    filtered_chunks = filter_complex_metadata(all_chunks)

    # =========================
    # BUILD VECTOR DB
    # =========================
    vectordb = Chroma.from_documents(
        documents=filtered_chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
        collection_name="langchain",
        collection_metadata={"hnsw:space": "cosine"}
    )

    print("🚀 Vector DB created successfully!")

    # =========================
    # BM25 + ENSEMBLE RETRIEVER
    # =========================
    print("⚙️ Building Ensemble Retriever (BM25 + Vector)...")

    bm25_retriever = BM25Retriever.from_documents(filtered_chunks)
    bm25_retriever.k = 10

    vector_retriever = vectordb.as_retriever(search_kwargs={"k": 10})

    ensemble_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.5, 0.5]
    )

    print("✅ Ensemble Retriever ready!")

    # =========================
    # RETURN BOTH
    # =========================
    return vectordb, ensemble_retriever