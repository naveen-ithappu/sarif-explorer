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
      <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">{file}</h2>
            <div className="text-sm text-gray-600 font-mono mt-1">{file}</div>
          </div>
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Violations Found</h2>
              <p className="text-gray-600">This file is compliant with all rules!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">{file}</h2>
          <div className="text-sm text-gray-600 font-mono mt-1">{file}</div>
          <div className="flex gap-3 mt-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              {violations.length} violations
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {violations.map((violation, index) => (
            <div key={index} className="violation-item">
              <div 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
                onClick={() => toggleViolation(index)}
              >
                <div className={`violation-icon ${violation.level}`}>
                  {violation.level.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 mb-1 leading-relaxed">
                    {violation.message}
                  </div>
                                     <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                     <span className="rule-id">{violation.ruleId}</span>
                     <span className="location-info">
                       Line {violation.line}, Column {violation.column}
                     </span>
                   </div>
                </div>
                
                <div className="violation-toggle">
                  {expandedViolations.has(index) ? '−' : '+'}
                </div>
              </div>
              
                             {expandedViolations.has(index) && (
                 <div className="px-6 pb-4 bg-gray-50">
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