'use client';

import React from 'react';
import { SarifData } from '../types/sarif.js';

interface StatsBarProps {
  data: SarifData;
}

export const StatsBar: React.FC<StatsBarProps> = ({ data }) => {
  const { totalViolations, statistics } = data;
  
  const errorCount = statistics.errorCount || 0;
  const warningCount = statistics.warningCount || 0;
  const infoCount = statistics.infoCount || 0;
  const noteCount = statistics.noteCount || 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Total Files */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">📁</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{data.files.length}</div>
            <div className="text-sm text-gray-600">Files</div>
          </div>
        </div>

        {/* Total Violations */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">🚨</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700">{totalViolations}</div>
            <div className="text-sm text-red-600">Total Issues</div>
          </div>
        </div>

        {/* Error Count */}
        {errorCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">E</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{errorCount}</div>
              <div className="text-sm text-red-600">Errors</div>
            </div>
          </div>
        )}

        {/* Warning Count */}
        {warningCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">W</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700">{warningCount}</div>
              <div className="text-sm text-orange-600">Warnings</div>
            </div>
          </div>
        )}

        {/* Info Count */}
        {infoCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">I</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{infoCount}</div>
              <div className="text-sm text-blue-600">Info</div>
            </div>
          </div>
        )}

        {/* Note Count */}
        {noteCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">N</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{noteCount}</div>
              <div className="text-sm text-green-600">Notes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 