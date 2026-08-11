import React, { useEffect, useState } from 'react';
import About from './About';
import aboutImage from '../../assets/About/about-collage.webp';
import { getCollegeInfo, getCollegeStats } from '../../services/collegeService';

const AboutCollage = () => {
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [stats, setStats]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [info, statsData] = await Promise.all([
          getCollegeInfo(),
          getCollegeStats(),
        ]);

        setCollegeInfo(info);

        // Map API stats shape → { value, label } pairs for the About component
        setStats([
          { value: statsData.studentNumber?.toLocaleString() ?? '—', label: 'Current Students' },
          { value: statsData.facultyNumber?.toLocaleString()  ?? '—', label: 'Academic Faculty'  },
          { value: statsData.facultyServices?.toLocaleString() ?? '—', label: 'Faculty Services'  },
        ]);
      } catch (err) {
        console.error('Failed to load college info:', err);
        setError('Failed to load college information.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative py-24 bg-gradient-to-br from-white via-indigo-50/30 to-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 items-center gap-12 animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-[480px] rounded-[10px] bg-indigo-100 order-2" />
            {/* Text skeleton */}
            <div className="order-1 space-y-4">
              <div className="h-4 w-32 bg-indigo-200 rounded" />
              <div className="h-10 w-3/4 bg-indigo-100 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full  bg-gray-200 rounded" />
                <div className="h-4 w-5/6  bg-gray-200 rounded" />
                <div className="h-4 w-4/6  bg-gray-200 rounded" />
              </div>
              <div className="flex gap-12 pt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-8 w-16 bg-indigo-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="relative py-24 bg-gradient-to-br from-white via-indigo-50/30 to-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="relative py-32 bg-gradient-to-br from-white via-indigo-50/30 to-white overflow-hidden">
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <About
          image={aboutImage}
          title={collegeInfo?.name ?? 'Faculty of Computers and Data Science'}
          description={collegeInfo?.description ?? ''}
          stats={stats}
          badgeText="ABOUT THE FACULTY"
          reverse={true}
        />
      </div>
    </section>
  );
};

export default AboutCollage;