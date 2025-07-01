'use client';

import React from 'react';

interface CodeSnippetProps {
  code: string;
  highlightLine?: number;
  startLine?: number;
  language?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ 
  code, 
  highlightLine, 
  startLine = 1,
  language = 'text'
}) => {
  const lines = code.split('\n');
  
  return (
    <div className="code-snippet">
      <div className="code-header">
        <span className="language-badge">{language}</span>
        {highlightLine && (
          <span className="highlight-info">
            Highlighted: Line {highlightLine}
          </span>
        )}
      </div>
      <pre className="code-content">
        <code>
          {lines.map((line, index) => {
            const lineNumber = startLine + index;
            const isHighlighted = highlightLine === lineNumber;
            
            return (
              <div 
                key={index}
                className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
              >
                <span className="line-number">
                  {lineNumber.toString().padStart(4)}
                </span>
                <span className="line-content">
                  {line}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}; 