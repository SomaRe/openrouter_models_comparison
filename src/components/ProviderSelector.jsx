'use client';

import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'selectedProvidersAndModels';

export default function ProviderSelector({ providers, initialModels, onFilter }) {
    const [selectedProviders, setSelectedProviders] = useState(new Set());
    const [expandedProviders, setExpandedProviders] = useState({});
    const [selectedModels, setSelectedModels] = useState(new Set());

    // Load saved selections from localStorage on mount
    useEffect(() => {
        const savedSelections = localStorage.getItem(STORAGE_KEY);
        if (savedSelections) {
            try {
                const { providers: savedProviders, models: savedModels } = JSON.parse(savedSelections);
                setSelectedProviders(new Set(savedProviders));
                setSelectedModels(new Set(savedModels));
                // Apply filters immediately after loading
                const filtered = initialModels.filter(model => {
                    const provider = model.id.split('/')[0];
                    return savedProviders.includes(provider) && 
                           (savedModels.length === 0 || savedModels.includes(model.id));
                });
                onFilter(filtered);
            } catch (error) {
                console.error('Error loading saved selections:', error);
            }
        } else {
            // If no saved selections, default to all providers selected
            setSelectedProviders(new Set(providers));
            // Apply default filter (show all models)
            onFilter(initialModels);
        }
    }, [providers, initialModels, onFilter]);

    // Save selections to localStorage whenever they change
    useEffect(() => {
        const selections = {
            providers: Array.from(selectedProviders),
            models: Array.from(selectedModels)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    }, [selectedProviders, selectedModels]);

    const handleApplyFilters = () => {
        let filteredModels = initialModels.filter(model => {
            const provider = model.id.split('/')[0];
            return selectedProviders.has(provider);
        });

        // Include only selected models
        filteredModels = filteredModels.filter(model => selectedModels.has(model.id));

        onFilter(filteredModels);
    };

    const handleCheckboxChange = (provider, isChecked) => {
        setSelectedProviders(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(provider);
            } else {
                newSet.delete(provider);
            }
            return newSet;
    }
    );
};

    const handleModelCheckboxChange = (modelId, isChecked) => {
        setSelectedModels(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(modelId);
            } else {
                newSet.delete(modelId);
            }
            return newSet;
        });
    };

    const toggleProvider = (provider) => {
        setExpandedProviders(prev => ({
            ...prev,
            [provider]: !prev[provider]
        }));
    };

    const getModelsForProvider = (provider) => {
        return initialModels.filter(model => model.id.startsWith(provider + '/'));
    };

    return (
        <div className="mb-4">
            <label htmlFor="provider-modal" className="btn btn-sm btn-primary">
                Filter Providers
            </label>

            <input type="checkbox" id="provider-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-11/12 max-w-3xl h-[60vh] flex flex-col p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">Filter Providers & Models</h3>
                        <div className="flex gap-2">
                            <button 
                                className="btn btn-xs btn-ghost" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedProviders(new Set(providers));
                                }}
                            >
                                All
                            </button>
                            <button 
                                className="btn btn-xs btn-ghost" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedProviders(new Set());
                                }}
                            >
                                None
                            </button>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 pr-2">
                        {providers.map(provider => (
                            <div key={provider} className="mb-1">
                                <div 
                                    className="flex items-center justify-between p-2 hover:bg-base-200 rounded cursor-pointer"
                                    onClick={(e) => {
                                        // Only toggle if not clicking the checkbox
                                        if (e.target.tagName !== 'INPUT' && getModelsForProvider(provider).length > 0) {
                                            toggleProvider(provider);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={selectedProviders.has(provider)}
                                            onChange={(e) => handleCheckboxChange(provider, e.target.checked)}
                                        />
                                        <span className="font-medium">
                                            {provider}
                                        </span>
                                    </div>
                                    {getModelsForProvider(provider).length > 0 && (
                                        <button 
                                            className="btn btn-xs btn-ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleProvider(provider);
                                            }}
                                        >
                                            {expandedProviders[provider] ? '▲' : '▼'}
                                        </button>
                                    )}
                                </div>
                                {expandedProviders[provider] && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {getModelsForProvider(provider).map(model => (
                                            <div key={model.id} className="flex items-center gap-2 pl-2">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-xs"
                                                    checked={selectedModels.has(model.id)}
                                                    onChange={(e) => handleModelCheckboxChange(model.id, e.target.checked)}
                                                    disabled={!selectedProviders.has(provider)}
                                                />
                                                <span className="text-sm" style={{ opacity: selectedProviders.has(provider) ? 1 : 0.5 }}>
                                                    {model.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="modal-action mt-2">
                        <label
                            htmlFor="provider-modal"
                            className="btn btn-sm btn-primary"
                            onClick={handleApplyFilters}
                        >
                            Apply
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
