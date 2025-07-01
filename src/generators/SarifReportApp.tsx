import React from 'react';
import { SarifData } from '../types/sarif.js';
import { FileTree } from '../components/FileTree.js';
import { ViolationList } from '../components/ViolationList.js';
import { StatsBar } from '../components/StatsBar.js';

interface SarifReportAppProps {
  data: SarifData;
}

export const SarifReportApp: React.FC<SarifReportAppProps> = ({ data }) => {
  const { files, fileViolations } = data;
  const [selectedFile, setSelectedFile] = React.useState<string | null>(files.length > 0 ? files[0] : null);

  return React.createElement('div', { className: 'h-screen bg-gray-50 font-sans flex flex-col' },
    // Combined Header and Stats Bar
    React.createElement('div', { id: 'header', className: 'bg-white border-b border-gray-100 flex-shrink-0' },
      // Large screen: single row layout
      React.createElement('div', { className: 'hidden lg:flex items-center justify-between px-8 py-6' },
        // Header content
        React.createElement('div', { className: 'flex-shrink-0' },
          React.createElement('h1', { className: 'text-3xl font-light mb-2' }, 'SARIF Report Viewer'),
          React.createElement('p', { className: 'text-gray-500 text-lg' }, 'Interactive analysis of static analysis results')
        ),
        // Stats content
        React.createElement('div', { className: 'flex-shrink-0' },
          React.createElement(StatsBar, { data, inline: true })
        )
      ),
      // Small screen: stacked layout
      React.createElement('div', { className: 'lg:hidden' },
        // Header content
        React.createElement('div', { className: 'px-8 py-6 border-b border-gray-100' },
          React.createElement('h1', { className: 'text-3xl font-light mb-2' }, 'SARIF Report Viewer'),
          React.createElement('p', { className: 'text-gray-500 text-lg' }, 'Interactive analysis of static analysis results')
        ),
        // Stats content
        React.createElement('div', { className: 'px-8 py-6' },
          React.createElement(StatsBar, { data, inline: true })
        )
      )
    ),
    
    // Main Container
    React.createElement('div', { id: 'main-container', className: 'flex flex-1 min-h-0' },
      // File Tree
      React.createElement('div', { id: 'file-tree-container', className: 'flex-shrink-0' },
        React.createElement(FileTree, {
          files,
          fileViolations,
          selectedFile,
          onFileSelect: setSelectedFile
        })
      ),
      
      // Content Area
      React.createElement('div', { id: 'content-area', className: 'flex-1 min-h-0 overflow-y-auto' },
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
  );
}; 