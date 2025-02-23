"use client";

import React, { useState, useMemo, useEffect } from 'react';
import CopyToClipboard from './CopyToClipboard';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';


const formatNumberForMillions = (number) => {
  if (number === null || number === undefined) return 'N/A';
  const millions = number * 1000000;
  return millions.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const sortModels = (models, sortBy, sortOrder) => {
  if (!sortBy) return models;

  return [...models].sort((a, b) => {
    let aValue = sortBy === 'prompt' || sortBy === 'completion' ? a.pricing[sortBy] : a[sortBy];
    let bValue = sortBy === 'prompt' || sortBy === 'completion' ? b.pricing[sortBy] : b[sortBy];

    if (aValue === undefined || aValue === null) return sortOrder === 'asc' ? -1 : 1;
    if (bValue === undefined || bValue === null) return sortOrder === 'asc' ? 1 : -1;

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export default function ModelsTable({ models }) {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const loadComments = async () => {
      const response = await fetch('/api/comments');
      if (response.ok) {
        const commentsMap = await response.json();
        setComments(commentsMap);
      }
    };
    loadComments();
  }, []);

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc');
      if (sortOrder === 'desc') setSortBy(null);
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const sortedModels = useMemo(() => sortModels(models, sortBy, sortOrder), [models, sortBy, sortOrder]);

  return (
    <div className="max-h-[70vh] overflow-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => handleSort('id')}>
              <div className="flex items-center">
                ID
                {sortBy === 'id' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('name')}>
              <div className="flex items-center">
                Name
                {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('prompt')}>
              <div className="flex items-center">
                Input Cost ($/M)
                {sortBy === 'prompt' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('completion')}>
              <div className="flex items-center">
                Output Cost ($/M)
                {sortBy === 'completion' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />)}
              </div>
            </th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {sortedModels.map((model) => (
            <tr key={model.id}>
              <td>
                <CopyToClipboard text={model.id}>
                  <div className="flex items-center hover:text-primary cursor-pointer">
                    <span className="mr-2">{model.id}</span>
                    <Copy className="w-4 h-4" />
                  </div>
                </CopyToClipboard>
              </td>
              <td>{model.name}</td>
              <td>{formatNumberForMillions(Number(model.pricing.prompt))}</td>
              <td>{formatNumberForMillions(Number(model.pricing.completion))}</td>
              <td>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Add notes..."
                  defaultValue={comments[model.id] || ''}
                  onBlur={(e) => {
                    const updatedComments = { ...comments, [model.id]: e.target.value };
                    setComments(updatedComments);
                    saveComments(updatedComments);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
