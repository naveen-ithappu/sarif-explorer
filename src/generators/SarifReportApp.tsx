import React from 'react';
import { SarifData } from '../types/sarif.js';
import { FileTree } from '../components/FileTree.js';
import { ViolationList } from '../components/ViolationList.js';
import { Header } from '../components/Header.js';

interface SarifReportAppProps {
  data: SarifData;
}

export const SarifReportApp: React.FC<SarifReportAppProps> = ({ data }) => {
  const { files, fileViolations } = data;
  const [selectedFile, setSelectedFile] = React.useState<string | null>(files.length > 0 ? files[0] : null);

  return React.createElement('div', { className: 'h-screen bg-gray-50 font-sans flex flex-col' },
    // Header Component (includes StatsBar)
    React.createElement(Header, { data }),
    
    // Main Container
    React.createElement('div', { id: 'main-container', className: 'flex flex-1 min-h-0' },
      // Left Side Panel with Header
      React.createElement('div', { id: 'side-panel', className: 'w-96 bg-white border-r border-gray-200 shadow-sm flex flex-col flex-shrink-0' },
        // Side Panel Header
        React.createElement('div', { className: 'px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('div', { className: 'w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center' },
              React.createElement('svg', { 
                className: 'w-4 h-4 text-blue-600',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              },
                React.createElement('path', { 
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 2,
                  d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                })
              )
            ),
            React.createElement('div', {},
              React.createElement('h3', { className: 'text-base font-semibold text-gray-900' }, 'Files'),
              React.createElement('p', { className: 'text-xs text-gray-500' }, `${files.length} files with violations`)
            )
          )
        ),
        // File Tree Component
        React.createElement('div', { className: 'flex-1 min-h-0' },
          React.createElement(FileTree, {
            files,
            fileViolations,
            selectedFile,
            onFileSelect: setSelectedFile
          })
        )
      ),
      
      // Right Content Area
      React.createElement('div', { id: 'content-area', className: 'flex-1 min-h-0 bg-gray-50 flex flex-col' },
        // Content Header
        React.createElement('div', { className: 'px-6 py-3 border-b border-gray-200 bg-white shadow-sm flex-shrink-0' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('div', { className: 'w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center' },
              React.createElement('svg', { 
                className: 'w-4 h-4 text-orange-600',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24'
              },
                React.createElement('path', { 
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 2,
                  d: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                })
              )
            ),
            React.createElement('div', {},
              React.createElement('h3', { className: 'text-base font-semibold text-gray-900' }, 'Violations'),
              React.createElement('p', { className: 'text-xs text-gray-500' }, 
                selectedFile ? selectedFile : 'Select a file to view violations'
              )
            )
          )
        ),
        // Violations Content
        React.createElement('div', { className: 'flex-1 min-h-0 overflow-y-auto p-6' },
          React.createElement('div', { id: 'violation-list-container' },
            // Render violation lists for all files
            files.map((file, index) => 
              React.createElement('div', { 
                key: file,
                id: `violation-list-${index}`,
                className: 'violation-list',
                'data-filename': file,
                style: { display: index === 0 ? 'block' : 'none' } // Show first file by default
              },
                React.createElement(ViolationList, {
                  file,
                  violations: fileViolations[file]
                })
              )
            )
          )
        )
      )
    )
  );
}; 