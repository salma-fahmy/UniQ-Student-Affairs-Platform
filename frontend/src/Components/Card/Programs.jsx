import React, { useEffect, useState, useCallback } from 'react';
import Card from './Card';
import { getAllPrograms, getProgramById } from '../../services/collegeService';

// Static image map: match by program name keywords (fallback to a default)
import aiImage   from '../../assets/Programs/ai.jpg';
import prog2     from '../../assets/Programs/Media.jpg';
import prog3     from '../../assets/Programs/Cybersecurity.jpg';
import prog4     from '../../assets/Programs/Business Analytics.jpg';
import prog5     from '../../assets/Programs/Healthcare.jpg';
import prog6     from '../../assets/Programs/Data Science.png';

const IMAGE_MAP = [
  { keywords: ['intelligent', 'system', 'ai'], image: aiImage  },
  { keywords: ['media'],           image: prog2    },
  { keywords: ['cyber', 'security'],            image: prog3    },
  { keywords: ['business'],                     image: prog4    },
  { keywords: ['healthcare', 'health', 'care'], image: prog5 },
  { keywords: ['data', 'science', 'computing'], image: prog6 },
];

const DEFAULT_IMAGE = aiImage;

/**
 * Pick the best static image for a given program name.
 * Falls back to DEFAULT_IMAGE when no keyword matches.
 */
const resolveImage = (programName = '') => {
  const lower = programName.toLowerCase();
  const match = IMAGE_MAP.find(({ keywords }) =>
    keywords.some((kw) => lower.includes(kw)),
  );
  return match?.image ?? DEFAULT_IMAGE;
};

// ── Program detail panel ────────────────────────────────────────────────────
const ProgramDetail = ({ programId, programName }) => {
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProgramById(programId);
        if (!cancelled) setDetail(data);
      } catch (err) {
        console.error(`Failed to load program ${programId}:`, err);
        if (!cancelled) setError('Could not load program details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDetail();
    return () => { cancelled = true; };
  }, [programId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3 p-8">
        <div className="h-8 w-48 bg-indigo-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-4/6 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>;
  }

  if (!detail) return null;

  /**
   * Helper — renders a labelled text block when the value exists.
   */
  const InfoBlock = ({ label, text }) =>
    text ? (
      <div>
        <p className="font-semibold text-indigo-800 mb-1">{label}</p>
        <p className="text-gray-700 leading-relaxed">{text}</p>
      </div>
    ) : null;

  return (
    <div className="p-8 space-y-6 text-gray-700">
      {/* Header row */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1 rounded-full">
          {detail.program_type}
        </span>
        <span className="text-sm text-gray-500">
          Tuition: <span className="font-semibold text-indigo-700">
            {Number(detail.tuition_fees).toLocaleString()} EGP / year
          </span>
        </span>
        <span className="text-sm text-gray-500">
          Credit-hour: <span className="font-semibold text-indigo-700">
            {Number(detail.credit_hour_price).toLocaleString()} EGP
          </span>
        </span>
      </div>

      <InfoBlock label="Description"    text={detail.program_description_en} />
      <InfoBlock label="Benefits"       text={detail.program_benefits_en}     />
      <InfoBlock label="Student Skills" text={detail.student_skills_en}       />
    </div>
  );
};

// ── Main Programs component ─────────────────────────────────────────────────
const Programs = () => {
  const [programs, setPrograms]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [expandedId, setExpandedId]   = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getAllPrograms();
        setPrograms(data);
      } catch (err) {
        console.error('Failed to load programs:', err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleViewProgram = useCallback((programId) => {
    setExpandedId((prev) => (prev === programId ? null : programId));

    // Smooth-scroll to the detail panel after a brief paint delay
    setTimeout(() => {
      const el = document.getElementById(`program-detail-${programId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-indigo-50 h-72" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute top-20 right-10 w-80 h-80 bg-indigo-100/40 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm tracking-widest font-semibold text-indigo-800 inline-block relative mb-4">
            ACADEMIC PROGRAMS
            <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-indigo-800" />
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-indigo-900 mb-6">
            Explore Our <br />Degree Offerings
          </h2>
          <p className="text-gray-600 font-['Open_Sans']">
            Choose from a wide range of undergraduate programs tailored to your aspirations.
          </p>
        </div>

        {/* Program cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card
              key={program.program_id}
              image={resolveImage(program.program_name_en)}
              title={program.program_name_en}
              description={`${program.program_type} · Tuition: ${Number(program.tuition_fees).toLocaleString()} EGP`}
              linkText={expandedId === program.program_id ? 'Hide Details' : 'View Program'}
              onLinkClick={() => handleViewProgram(program.program_id)}
            />
          ))}
        </div>

        {/* Detail panels — rendered below the grid */}
        <div className="mt-16 space-y-6">
          {programs.map((program) =>
            expandedId === program.program_id ? (
              <section
                key={program.program_id}
                id={`program-detail-${program.program_id}`}
                className="scroll-mt-24 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100"
              >
                <div className="flex items-center justify-between px-8 pt-8 pb-4">
                  <h3 className="font-playfair text-3xl font-semibold text-indigo-900">
                    {program.program_name_en}
                  </h3>
                  <button
                    onClick={() => setExpandedId(null)}
                    aria-label="Close"
                    className="text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ProgramDetail
                  programId={program.program_id}
                  programName={program.program_name_en}
                />
              </section>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
};

export default Programs;