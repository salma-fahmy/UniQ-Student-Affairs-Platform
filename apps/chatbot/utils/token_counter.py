import tiktoken


class TokenCounter:
    """
    Utility class for token counting and safe trimming.
    Used to prevent LLM requests from exceeding token limits.
    """

    def __init__(self, model: str = "cl100k_base"):
        # Groq / LLaMA compatible encoding
        self.enc = tiktoken.get_encoding(model)

    def count(self, text: str) -> int:
        """Count tokens in a given text."""
        if not text:
            return 0
        return len(self.enc.encode(text))

    def trim(self, text: str, max_tokens: int) -> str:
        """Trim text to fit within max token limit."""
        if not text:
            return ""

        tokens = self.enc.encode(text)

        if len(tokens) > max_tokens:
            tokens = tokens[:max_tokens]

        return self.enc.decode(tokens)

    def safe_trim_context(self, context: str, max_tokens: int = 4000) -> str:
        """Specifically for RAG context."""
        return self.trim(context, max_tokens)

    def safe_trim_history(self, chat_history, max_turns: int = 3):
        """Keep only last N turns of history."""
        if not chat_history:
            return []
        return chat_history[-max_turns:]

    def is_over_limit(self, text: str, limit: int) -> bool:
        """Check if text exceeds token limit."""
        return self.count(text) > limit