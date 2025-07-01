'use client';

import React from 'react';
import { SarifData } from '../types/sarif.js';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  data: SarifData;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'SARIF Explorer',
  subtitle = 'Interactive HTML visualization of static analysis reports',
  data
}) => {
  const { files, totalViolations, statistics } = data;
  
  const errorCount = statistics.errorCount || 0;
  const warningCount = statistics.warningCount || 0;
  const infoCount = statistics.infoCount || 0;
  const noteCount = statistics.noteCount || 0;

  return React.createElement('div', { id: 'header', className: 'bg-white border-b border-gray-200 shadow-sm flex-shrink-0' },
    // Main Header with Brand and Stats
    React.createElement('div', { className: 'px-6 py-4' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        // Brand and Title
        React.createElement('div', { className: 'flex items-center gap-4' },
          React.createElement('div', { className: 'w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center' },
            React.createElement('svg', { 
              className: 'w-5 h-5 text-white',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            },
              React.createElement('path', { 
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d: 'M4 6h16M4 10h16M4 14h16M4 18h16'
              }),
              React.createElement('path', { 
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d: 'M8 6v12M12 6v12M16 6v12'
              })
            )
          ),
          React.createElement('div', {},
            React.createElement('h1', { className: 'text-xl font-semibold text-gray-900' }, title),
            React.createElement('p', { className: 'text-sm text-gray-500' }, subtitle)
          )
        ),
        
        // Stats Bar
        React.createElement('div', { className: 'flex items-center gap-4 justify-center' },
          
          // Error Count
          errorCount > 0 && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'flex items-center flex-col gap-2 px-4 py-2 bg-rose-50 rounded-lg border border-rose-100 shadow-sm min-w-[80px]' },
              React.createElement('span', { className: 'text-lg font-semibold text-gray-900' }, errorCount),
              React.createElement('span', { className: 'text-xs text-rose-600 uppercase' }, 'errors')
            )
          ),
          
          // Warning Count
          warningCount > 0 && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'flex items-center flex-col gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-100 shadow-sm min-w-[80px]' },
              React.createElement('span', { className: 'text-lg font-semibold text-gray-900' }, warningCount),
              React.createElement('span', { className: 'text-xs text-amber-600 uppercase' }, 'warnings')
            )
          ),
          
          // Info Count
          infoCount > 0 && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'flex items-center flex-col gap-2 px-4 py-2 bg-sky-50 rounded-lg border border-sky-100 shadow-sm min-w-[80px]' },
              React.createElement('span', { className: 'text-lg font-semibold text-gray-900' }, infoCount),
              React.createElement('span', { className: 'text-xs text-sky-600 uppercase' }, 'info')
            )
          ),
          
          // Note Count
          noteCount > 0 && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'flex items-center flex-col gap-2 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 shadow-sm min-w-[80px]' },
              React.createElement('span', { className: 'text-lg font-semibold text-gray-900' }, noteCount),
              React.createElement('span', { className: 'text-xs text-emerald-600 uppercase' }, 'notes')
            )
          )
        )
      )
    )
  );
}; 