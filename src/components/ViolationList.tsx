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

  if (violations.length === 0) {
    return (
      <div id="violation-list" className="flex-1 bg-gray-50 p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-2xl font-light text-gray-900 mb-2">{file}</h2>
            <div className="text-sm text-gray-500 font-mono">{file}</div>
          </div>
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-4">No Violations Found</h2>
              <p className="text-gray-500 text-xl">This file is compliant with all rules!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="violation-list" className="flex-1 bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-light text-gray-900 mb-2">{file}</h2>
          <div className="text-sm text-gray-500 font-mono mb-4">{file}</div>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {violations.length} violations
            </span>
          </div>
        </div>
        
        <div id="violations-container" className="divide-y divide-gray-100">
          {violations.map((violation, index) => (
            <div key={index} id={`violation-item-${index}`} className="violation-item group">
              <div 
                className="violation-header px-8 py-6 cursor-pointer hover:bg-gray-50 transition-all duration-300 flex items-start gap-6"
                onClick={() => toggleViolation(index)}
              >
                <div className="violation-icon warning shadow-sm">
                  {violation.level.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="violation-message font-medium text-gray-900 mb-3 leading-relaxed text-lg">
                    {violation.message}
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="rule-id px-3 py-1 rounded-full font-mono font-medium bg-gray-100">{violation.ruleId}</span>
                    <span className="location-info flex items-center gap-1">
                      Line {violation.line}, Column {violation.column}
                    </span>
                  </div>
                </div>
                
                <div className="violation-toggle flex-shrink-0">
                  {expandedViolations.has(index) ? '−' : '+'}
                </div>
              </div>
              
              {expandedViolations.has(index) && (
                <div id={`violation-content-${index}`} className="violation-content px-8 pb-6 bg-gray-50">
                  {violation.snippet && (
                    <CodeSnippet 
                      code={violation.snippet}
                      language="text"
                      highlightLine={violation.line}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 