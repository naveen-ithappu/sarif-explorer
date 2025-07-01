'use client';

import React, { useState, useMemo } from 'react';
import { FileViolations, Violation } from '../types/sarif';

interface FileTreeProps {
  files: string[];
  fileViolations: FileViolations;
  selectedFile: string | null;
  onFileSelect: (file: string) => void;
}

interface FileItemProps {
  file: string;
  violations: Violation[];
  isSelected: boolean;
  onClick: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, violations, isSelected, onClick }) => {
  const errorCount = violations.filter(v => v.level === 'error').length;
  const warningCount = violations.filter(v => v.level === 'warning').length;
  const infoCount = violations.filter(v => v.level === 'info').length;
  
  let countClass = 'error';
  let count = errorCount;
  if (errorCount === 0 && warningCount > 0) {
    countClass = 'warning';
    count = warningCount;
  } else if (errorCount === 0 && warningCount === 0 && infoCount > 0) {
    countClass = 'info';
    count = infoCount;
  }

  return (
    <div 
      className={`file-item ${isSelected ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="file-item-content">
        <div className="file-name">{file}</div>
        <div className="file-meta">
          <span>{violations.length} violations</span>
          <span className={`violation-count ${countClass}`}>{count}</span>
        </div>
      </div>
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({ 
  files, 
  fileViolations, 
  selectedFile, 
  onFileSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;
    return files.filter(file => 
      file.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [files, searchTerm]);

  if (files.length === 0) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>📁 Files with Violations</h3>
        </div>
        <div className="no-violations">
          <h2>🎉 No Files with Issues</h2>
          <p>All files are compliant!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>📁 Files with Violations</h3>
        <input
          type="text"
          className="search-input"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
        />
      </div>
      <div className="file-list">
        {filteredFiles.map(file => (
          <FileItem
            key={file}
            file={file}
            violations={fileViolations[file]}
            isSelected={selectedFile === file}
            onClick={() => onFileSelect(file)}
          />
        ))}
        {filteredFiles.length === 0 && searchTerm && (
          <div className="no-results">
            <p>No files match &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}; 