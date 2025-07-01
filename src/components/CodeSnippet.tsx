'use client';

import React from 'react';

interface CodeSnippetProps {
  code: string;
  language: string;
  highlightLine?: number;
  startLine?: number;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ 
  code, 
  language, 
  highlightLine, 
  startLine = 1 
}) => {
  const lines = code.split('\n');
  const maxLineNumber = startLine + lines.length - 1;
  const lineNumberWidth = maxLineNumber.toString().length;

  return (
    <div className="mt-6">
      <div className="bg-gray-100 px-4 py-3 rounded-t-xl border border-gray-200 flex justify-between items-center text-sm">
        <span className="language-badge bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {language}
        </span>
        {highlightLine && (
          <span className="text-gray-600">
            Highlighted: Line {highlightLine}
          </span>
        )}
      </div>
      <div className="bg-white text-gray-900 rounded-b-xl border border-gray-200 overflow-hidden shadow-sm">
        <pre className="p-6 m-0 font-mono text-sm leading-relaxed">
          {lines.map((line, index) => {
            const lineNumber = startLine + index;
            const isHighlighted = lineNumber === highlightLine;
            
            return (
              <div 
                key={index} 
                className={`code-line ${isHighlighted ? 'highlighted' : ''} transition-all duration-200`}
              >
                <span className="line-number text-gray-400 select-none">
                  {lineNumber.toString().padStart(lineNumberWidth, ' ')}
                </span>
                <span className="line-content">{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}; 