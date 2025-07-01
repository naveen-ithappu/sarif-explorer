'use client';

import React from 'react';
import { SarifData } from '../types/sarif';

interface StatsBarProps {
  data: SarifData;
}

export const StatsBar: React.FC<StatsBarProps> = ({ data }) => {
  const { statistics } = data;
  
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-number">{statistics.totalFiles}</span>
        <span className="stat-label">Files with Issues</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{statistics.totalViolations}</span>
        <span className="stat-label">Total Violations</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{statistics.averageViolationsPerFile}</span>
        <span className="stat-label">Avg per File</span>
      </div>
      <div className="stat-item error">
        <span className="stat-number">{statistics.errorCount}</span>
        <span className="stat-label">Errors</span>
      </div>
      <div className="stat-item warning">
        <span className="stat-number">{statistics.warningCount}</span>
        <span className="stat-label">Warnings</span>
      </div>
      <div className="stat-item info">
        <span className="stat-number">{statistics.infoCount}</span>
        <span className="stat-label">Info</span>
      </div>
      {statistics.noteCount > 0 && (
        <div className="stat-item note">
          <span className="stat-number">{statistics.noteCount}</span>
          <span className="stat-label">Notes</span>
        </div>
      )}
    </div>
  );
}; 