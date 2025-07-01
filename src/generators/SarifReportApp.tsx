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

  return React.createElement('div', { className: 'viewer-container' },
    // Header
    React.createElement('div', { className: 'header' },
      React.createElement('h1', null, 'SARIF Report Viewer'),
      React.createElement('p', null, 'Interactive analysis of static analysis results')
    ),
    
    // Stats Bar
    React.createElement(StatsBar, { data }),
    
    // Main Container
    React.createElement('div', { className: 'main-container' },
      // File Tree
      React.createElement(FileTree, {
        files,
        fileViolations,
        selectedFile,
        onFileSelect: setSelectedFile
      }),
      
      // Content Area
      React.createElement('div', { className: 'content-area' },
        selectedFile ? 
          React.createElement(ViolationList, {
            file: selectedFile,
            violations: fileViolations[selectedFile]
          }) :
          React.createElement('div', { className: 'no-file-selected' },
            React.createElement('h2', null, '📁 Select a File'),
            React.createElement('p', null, 'Choose a file from the sidebar to view its violations.')
          )
      )
    )
  );
}; 