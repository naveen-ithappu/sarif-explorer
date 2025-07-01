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

  return React.createElement('div', { className: 'min-h-screen bg-gray-50 font-sans' },
    // Header
    React.createElement('div', { className: 'bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-6 shadow-lg' },
      React.createElement('h1', { className: 'text-3xl font-light mb-2' }, 'SARIF Report Viewer'),
      React.createElement('p', { className: 'text-primary-100 text-lg' }, 'Interactive analysis of static analysis results')
    ),
    
    // Stats Bar
    React.createElement(StatsBar, { data }),
    
    // Main Container
    React.createElement('div', { className: 'flex h-[calc(100vh-200px)]' },
      // File Tree
      React.createElement(FileTree, {
        files,
        fileViolations,
        selectedFile,
        onFileSelect: setSelectedFile
      }),
      
      // Content Area
      React.createElement('div', { className: 'flex-1' },
        selectedFile ? 
          React.createElement(ViolationList, {
            file: selectedFile,
            violations: fileViolations[selectedFile]
          }) :
          React.createElement('div', { className: 'flex-1 bg-gray-50 flex items-center justify-center p-8' },
            React.createElement('div', { className: 'text-center' },
              React.createElement('div', { className: 'text-6xl mb-6' }, '📁'),
              React.createElement('h2', { className: 'text-2xl font-semibold text-gray-900 mb-3' }, 'Select a File'),
              React.createElement('p', { className: 'text-gray-600 text-lg' }, 'Choose a file from the sidebar to view its violations.')
            )
          )
      )
    )
  );
}; 