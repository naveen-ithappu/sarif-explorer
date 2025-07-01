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
    <div className="mt-4">
      <div className="bg-gray-100 px-3 py-2 rounded-t-md border border-gray-200 flex justify-between items-center text-xs">
        <span className="language-badge">{language}</span>
        {highlightLine && (
          <span className="text-gray-600">
            Highlighted: Line {highlightLine}
          </span>
        )}
      </div>
      <div className="bg-gray-900 text-gray-100 rounded-b-md border border-gray-200 overflow-x-auto">
        <pre className="p-4 m-0 font-mono text-sm leading-relaxed">
          {lines.map((line, index) => {
            const lineNumber = startLine + index;
            const isHighlighted = lineNumber === highlightLine;
            
            return (
              <div 
                key={index} 
                className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
              >
                <span className="line-number">
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