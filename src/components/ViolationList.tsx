'use client';

import React, { useState } from 'react';
import { Violation } from '../types/sarif';
import { CodeSnippet } from './CodeSnippet.js';

interface ViolationListProps {
  file: string;
  violations: Violation[];
}

interface ViolationItemProps {
  violation: Violation;
}

const ViolationItem: React.FC<ViolationItemProps> = ({ violation }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const levelClass = violation.level === 'warning' ? 'warning' : 
                    violation.level === 'error' ? 'error' : 'info';

  return (
    <div className="violation-item">
      <div 
        className="violation-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`violation-icon ${levelClass}`}>
          {violation.level.charAt(0).toUpperCase()}
        </div>
        <div className="violation-info">
          <div className="violation-message">{violation.message}</div>
          <div className="violation-meta">
            <span className="rule-id">{violation.ruleId}</span>
            <span className="location-info">
              Line {violation.line}, Column {violation.column}
            </span>
          </div>
        </div>
        <div className="violation-toggle">
          {isExpanded ? '−' : '+'}
        </div>
      </div>
      {isExpanded && (
        <div className="violation-content">
          {violation.snippet && (
            <CodeSnippet 
              code={violation.snippet}
              highlightLine={violation.line}
              startLine={Math.max(1, violation.line - 3)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const ViolationList: React.FC<ViolationListProps> = ({ file, violations }) => {
  if (violations.length === 0) {
    return (
      <div className="file-details">
        <div className="file-details-header">
          <h2>{file}</h2>
          <div className="file-path">{file}</div>
        </div>
        <div className="no-violations">
          <h2>🎉 No Violations Found!</h2>
          <p>This file is compliant with all rules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-details">
      <div className="file-details-header">
        <h2>{file}</h2>
        <div className="file-path">{file}</div>
        <div className="file-stats">
          <span className="stat">
            {violations.length} violation{violations.length !== 1 ? 's' : ''}
          </span>
          <span className="stat">
            {violations.filter(v => v.level === 'error').length} error{violations.filter(v => v.level === 'error').length !== 1 ? 's' : ''}
          </span>
          <span className="stat">
            {violations.filter(v => v.level === 'warning').length} warning{violations.filter(v => v.level === 'warning').length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="violations-list">
        {violations.map((violation) => (
          <ViolationItem
            key={`${violation.ruleId}-${violation.line}-${violation.column}`}
            violation={violation}
          />
        ))}
      </div>
    </div>
  );
}; 