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
      <div className={`bg-white border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:border-gray-300 hover:shadow-sm ${
        isSelected 
          ? 'border-blue-300 shadow-lg bg-blue-50 ring-2 ring-blue-100' 
          : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="file-name font-medium text-gray-900 text-sm mb-2 leading-relaxed break-all">{file}</div>
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
      <div id="file-tree" className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Files with Issues</h2>
            <p className="text-gray-500">All files are compliant!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="file-tree" className="flex flex-col h-full">
      {/* Search Section */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="file-search-input"
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:bg-white transition-all duration-200"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* File List */}
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
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No files match "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}; 