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
  index: number;
}

const FileItem: React.FC<FileItemProps> = ({ file, violations, isSelected, onClick, index }) => {
  const errorCount = violations.filter(v => v.level === 'error').length;
  const warningCount = violations.filter(v => v.level === 'warning').length;
  const infoCount = violations.filter(v => v.level === 'info').length;
  
  // Determine the primary violation type for color coding
  let primaryLevel = 'info';
  let primaryCount = infoCount;
  if (errorCount > 0) {
    primaryLevel = 'error';
    primaryCount = errorCount;
  } else if (warningCount > 0) {
    primaryLevel = 'warning';
    primaryCount = warningCount;
  }

  return (
    <div 
      id={`file-item-${index}`}
      className={`file-item group relative mb-3 ${isSelected ? 'active' : ''}`}
      onClick={onClick}
      data-filename={file}
    >
      <div className={`bg-white border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-gray-300 hover:shadow-sm ${
        isSelected 
          ? 'border-blue-300 shadow-lg bg-blue-50 ring-2 ring-blue-100' 
          : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="file-name font-medium text-gray-900 text-sm mb-3 leading-relaxed break-all">{file}</div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  primaryLevel === 'error' ? 'bg-red-500' :
                  primaryLevel === 'warning' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}></div>
                {violations.length} violations
              </span>
            </div>
          </div>          
        </div>
        
        {/* Progress bar for violation distribution */}
        <div className="flex h-1 rounded-full bg-gray-100 overflow-hidden">
          {errorCount > 0 && (
            <div 
              className="bg-red-400 h-full" 
              style={{ width: `${(errorCount / violations.length) * 100}%` }}
            ></div>
          )}
          {warningCount > 0 && (
            <div 
              className="bg-orange-400 h-full" 
              style={{ width: `${(warningCount / violations.length) * 100}%` }}
            ></div>
          )}
          {infoCount > 0 && (
            <div 
              className="bg-blue-400 h-full" 
              style={{ width: `${(infoCount / violations.length) * 100}%` }}
            ></div>
          )}
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
      <div id="file-tree" className="w-96 bg-white border-r border-gray-100 flex flex-col h-full">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <h3 className="text-xl font-light text-gray-900 mb-4">Files with Violations</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900 mb-3">No Files with Issues</h2>
            <p className="text-gray-500 text-lg">All files are compliant!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="file-tree" className="w-96 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <h3 className="text-xl font-light text-gray-900 mb-4">Files with Violations</h3>
        <div className="relative">
          <input
            id="file-search-input"
            type="text"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div id="file-list" className="flex-1 overflow-y-auto p-4 min-h-0">
        {filteredFiles.map((file, index) => (
          <FileItem
            key={file}
            file={file}
            violations={fileViolations[file]}
            isSelected={selectedFile === file}
            onClick={() => onFileSelect(file)}
            index={index}
          />
        ))}
        {filteredFiles.length === 0 && searchTerm && (
          <div id="no-results" className="text-center py-12">
            <p className="text-gray-500 text-lg">No files match "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}; 