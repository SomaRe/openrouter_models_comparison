"use client";

import React, { useState, useMemo } from 'react';
import CopyToClipboard from '../app/CopyToClipboard';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';

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
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('id')}>
                            ID
                            {sortBy === 'id' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'id' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('name')}>
                            Name
                            {sortBy === 'name' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'name' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('prompt')}>
                            Input Cost ($/M)
                            {sortBy === 'prompt' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'prompt' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                        <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('completion')}>
                            Output Cost ($/M)
                            {sortBy === 'completion' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                            {sortBy === 'completion' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedModels.map((model) => (
                        <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="py-2 px-4 border-b dark:border-gray-600 flex items-center">
                                <CopyToClipboard text={model.id}>
                                    <div className="flex items-center">
                                        <span className="mr-2">{model.id}</span>
                                        <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" />
                                    </div>
                                </CopyToClipboard>
                                </td>
                            <td className="py-2 px-4 border-b dark:border-gray-600">{model.name}</td>
                            <td className="py-2 px-4 border-b dark:border-gray-600">${model.pricing.prompt}</td>
                            <td className="py-2 px-4 border-b dark:border-gray-600">${model.pricing.completion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

src\app\page.js
```javascript
<<<<<<< SEARCH
import React, { useState, useMemo } from 'react';
import CopyToClipboard from './CopyToClipboard';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';

async function getModels() {
    const res = await fetch(process.env.OPENROUTER_MODELS_URL || "");
    const data = await res.json();
    return data.data;
}

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

export default async function Home() {
    const initialModels = await getModels();
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

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

    const sortedModels = useMemo(() => sortModels(initialModels, sortBy, sortOrder), [initialModels, sortBy, sortOrder]);


    return (
        <div className="container mx-auto py-8 dark:bg-gray-900 dark:text-white">
            <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">OpenRouter Models</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('id')}>
                                ID
                                {sortBy === 'id' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                                {sortBy === 'id' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                            </th>
                            <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('name')}>
                                Name
                                {sortBy === 'name' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                                {sortBy === 'name' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                            </th>
                            <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('prompt')}>
                                Input Cost ($/M)
                                {sortBy === 'prompt' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                                {sortBy === 'prompt' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                            </th>
                            <th className="py-2 px-4 border-b dark:border-gray-600 text-left cursor-pointer" onClick={() => handleSort('completion')}>
                                Output Cost ($/M)
                                {sortBy === 'completion' && sortOrder === 'asc' && <ChevronUp className="inline-block w-4 h-4 ml-1" />}
                                {sortBy === 'completion' && sortOrder === 'desc' && <ChevronDown className="inline-block w-4 h-4 ml-1" />}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {models.map((model) => (
                            <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="py-2 px-4 border-b dark:border-gray-600 flex items-center">
                                    <CopyToClipboard text={model.id}>
                                        <div className="flex items-center">
                                            <span className="mr-2">{model.id}</span>
                                            <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" />
                                        </div>
                                    </CopyToClipboard>
                                </td>
                                <td className="py-2 px-4 border-b dark:border-gray-600">{model.name}</td>
                                <td className="py-2 px-4 border-b dark:border-gray-600">${model.pricing.prompt}</td>
                                <td className="py-2 px-4 border-b dark:border-gray-600">${model.pricing.completion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
