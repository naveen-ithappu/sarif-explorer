'use client';

import React, { useState } from 'react';
import { Violation } from '../types/sarif.js';
import { CodeSnippet } from './CodeSnippet.js';

interface ViolationListProps {
  file: string;
  violations: Violation[];
}

export const ViolationList: React.FC<ViolationListProps> = ({ file, violations }) => {
  const [expandedViolations, setExpandedViolations] = useState<Set<number>>(new Set());

  const toggleViolation = (index: number) => {
    const newExpanded = new Set(expandedViolations);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedViolations(newExpanded);
  };

  const getLevelTagColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      case 'note': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (violations.length === 0) {
    return (
      <div id="violation-list" className="flex-1">
        <div className="flex items-center justify-center p-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Violations Found</h2>
            <p className="text-gray-500">This file is compliant with all rules!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="violation-list" className="flex-1">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div id="violations-container">
          {violations.map((violation, index) => (
            <div 
              key={index} 
              id={`violation-item-${index}`} 
              className={`violation-item group ${index < violations.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div 
                className="violation-header px-8 py-6 cursor-pointer hover:bg-gray-50 transition-all duration-300 flex items-start gap-6"
                onClick={() => toggleViolation(index)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelTagColor(violation.level)}`}>
                      {violation.level.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500 font-mono">{violation.ruleId}</span>
                  </div>
                  <div className="violation-message font-medium text-gray-900 mb-3 leading-relaxed text-lg">
                    {violation.message}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="location-info flex items-center gap-1">
                      Line {violation.line}, Column {violation.column}
                    </span>
                  </div>
                </div>
                
                <div className="violation-toggle flex-shrink-0">
                  {expandedViolations.has(index) ? '−' : '+'}
                </div>
              </div>
              
              <div id={`violation-content-${index}`} className="violation-content px-8 pb-6 bg-gray-50" style={{ display: expandedViolations.has(index) ? 'block' : 'none' }}>
                {violation.snippet && (
                  <CodeSnippet 
                    code={violation.snippet}
                    language="text"
                    highlightLine={violation.line}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 