'use client';

import React, { useState, useMemo } from 'react';
import { FileViolations, Violation } from '../types/sarif.js';

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
  
  let countClass = 'bg-red-500';
  let count = errorCount;
  if (errorCount === 0 && warningCount > 0) {
    countClass = 'bg-orange-500';
    count = warningCount;
  } else if (errorCount === 0 && warningCount === 0 && infoCount > 0) {
    countClass = 'bg-blue-500';
    count = infoCount;
  }

  return (
    <div 
      className={`file-item ${isSelected ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="px-4 py-3">
        <div className="font-medium text-gray-900 text-sm mb-1 break-all">{file}</div>
        <div className="flex justify-between items-center text-xs text-gray-500">
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
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📁 Files with Violations</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Files with Issues</h2>
            <p className="text-gray-600">All files are compliant!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📁 Files with Violations</h3>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
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
          <div className="p-4 text-center text-gray-500 italic">
            <p>No files match "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}; 