// src/pages/CollegeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCollegeInfo, getCollegeStats } from '../services/collegeService';

const CollegeContext = createContext(null);

export const CollegeProvider = ({ children }) => {
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [info, statsData] = await Promise.all([
          getCollegeInfo(),
          getCollegeStats(),
        ]);
        setCollegeInfo(info);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load college data:', err);
        setError('Failed to load college information.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <CollegeContext.Provider value={{ collegeInfo, stats, loading, error }}>
      {children}
    </CollegeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCollege = () => useContext(CollegeContext);