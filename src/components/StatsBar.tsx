'use client';

import React from 'react';
import { SarifData } from '../types/sarif.js';

interface StatsBarProps {
  data: SarifData;
  inline?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ data, inline = false }) => {
  const { totalViolations, statistics } = data;
  
  const errorCount = statistics.errorCount || 0;
  const warningCount = statistics.warningCount || 0;
  const infoCount = statistics.infoCount || 0;
  const noteCount = statistics.noteCount || 0;

  const statsContent = React.createElement('div', { className: 'flex flex-wrap items-center gap-6' },
    // Total Files
    React.createElement('div', { className: 'group' },
      React.createElement('div', { className: 'bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-300' },
        React.createElement('div', { className: 'text-2xl font-light text-gray-900 mb-1' }, data.files.length),
        React.createElement('div', { className: 'text-xs font-medium text-blue-600 uppercase tracking-wide' }, 'Files')
      )
    ),

    // Total Violations
    React.createElement('div', { className: 'group' },
      React.createElement('div', { className: 'bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-300' },
        React.createElement('div', { className: 'text-2xl font-light text-gray-900 mb-1' }, totalViolations),
        React.createElement('div', { className: 'text-xs font-medium text-red-600 uppercase tracking-wide' }, 'Issues')
      )
    ),

    // Error Count
    errorCount > 0 && React.createElement('div', { className: 'group' },
      React.createElement('div', { className: 'bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-300' },
        React.createElement('div', { className: 'text-2xl font-light text-gray-900 mb-1' }, errorCount),
        React.createElement('div', { className: 'text-xs font-medium text-red-600 uppercase tracking-wide' }, 'Errors')
      )
    ),

    // Warning Count
    warningCount > 0 && React.createElement('div', { className: 'group' },
      React.createElement('div', { className: 'bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-300' },
        React.createElement('div', { className: 'text-2xl font-light text-gray-900 mb-1' }, warningCount),
        React.createElement('div', { className: 'text-xs font-medium text-orange-600 uppercase tracking-wide' }, 'Warnings')
      )
    ),

    // Info Count
    infoCount > 0 && React.createElement('div', { className: 'group' },
      React.createElement('div', { className: 'bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-300' },
        React.createElement('div', { className: 'text-2xl font-light text-gray-900 mb-1' }, infoCount),
        React.createElement('div', { className: 'text-xs font-medium text-blue-600 uppercase tracking-wide' }, 'Info')
      )
    ),

    // Note Count
    noteCount > 0 && React.createElement('div', { className: 'group' },
      React.createElement('div', { className: 'bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-300' },
        React.createElement('div', { className: 'text-2xl font-light text-gray-900 mb-1' }, noteCount),
        React.createElement('div', { className: 'text-xs font-medium text-green-600 uppercase tracking-wide' }, 'Notes')
      )
    )
  );

  if (inline) {
    return statsContent;
  }

  return React.createElement('div', { className: 'bg-white border-b border-gray-100 px-8 py-6' }, statsContent);
}; 