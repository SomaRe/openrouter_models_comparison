"use client";

import React, { useState, useMemo, useEffect } from 'react';
import CopyToClipboard from './CopyToClipboard';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';

const saveComment = async (modelId, comment) => {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelId, comment }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving comment:', error);
  }
};

const getComment = async (modelId) => {
  try {
    const response = await fetch(`/api/comments/${modelId}`);
    if (response.ok) {
      const data = await response.json();
      return data.comments || '';
    }
    return '';
  } catch (error) {
    console.error('Error fetching comment:', error);
    return '';
  }
};

const formatNumberForMillions = (number) => {
    if (number === null || number === undefined) {
        return 'N/A';
    }
    const millions = number * 1000000;
    return millions.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const sortModels = (models, sortBy, sortOrder) => {
    if (!sortBy) return models;

    return [...models].sort((a, b) => {
        let aValue, bValue;

        if (sortBy === 'prompt' || sortBy === 'completion') {
            aValue = a.pricing[sortBy];
            bValue = b.pricing[sortBy];
        } else {
            aValue = a[sortBy];
            bValue = b[sortBy];
        }

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

    // Load comments for all models on mount
    useEffect(() => {
        const loadComments = async () => {
            const commentsMap = {};
            for (const model of models) {
                const comment = await getComment(model.id);
                commentsMap[model.id] = comment;
            }
            setComments(commentsMap);
        };
        loadComments();
    }, [models]);

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else if (sortOrder === 'desc') {
                setSortBy(null);
                setSortOrder(null);
            } else {
                setSortOrder('asc');
                setSortBy(columnName);
            }
        } else {
            setSortBy(columnName);
            setSortOrder('asc');
        }
    };

    const sortedModels = useMemo(() => sortModels(models, sortBy, sortOrder), [models, sortBy, sortOrder]);

    return (
        <div className="max-h-[70vh] overflow-auto">
            <table className="table table-zebra w-full table-pin-rows table-pin-cols">
                <thead>
                    <tr>
                        <th scope="col" className="py-2 px-4  text-left cursor-pointer" onClick={() => handleSort('id')}>
                            ID
                            {sortBy === 'id' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'id' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                        <th scope="col" className="py-2 px-4  text-left cursor-pointer" onClick={() => handleSort('name')}>
                            Name
                            {sortBy === 'name' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'name' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                        <th scope="col" className="py-2 px-4  text-left cursor-pointer" onClick={() => handleSort('prompt')}>
                            Input Cost ($/M)
                            {sortBy === 'prompt' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'prompt' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                        <th scope="col" className="py-2 px-4 text-left cursor-pointer" onClick={() => handleSort('completion')}>
                            Output Cost ($/M)
                            {sortBy === 'completion' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'completion' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                        <th scope="col" className="py-2 px-4 text-left">
                            Notes
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedModels.map((model) => (
                        <tr key={model.id}>
                            <td className="py-2 px-4  flex items-center">
                                <CopyToClipboard text={model.id}>
                                    <div className="flex items-center">
                                        <span className="mr-2">{model.id}</span>
                                        <Copy className="w-4 h-4" />
                                    </div>
                                </CopyToClipboard>
                            </td>
                            <td className="py-2 px-4 ">{model.name}</td>
                            <td className="py-2 px-4 ">{formatNumberForMillions(Number(model.pricing.prompt))}</td>
                            <td className="py-2 px-4 ">{formatNumberForMillions(Number(model.pricing.completion))}</td>
                            <td className="py-2 px-4 ">
                              <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Add notes..."
                                defaultValue={comments[model.id] || ''}
                                onBlur={(e) => saveComment(model.id, e.target.value)}
                              />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
