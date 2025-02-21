'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'selectedProvidersAndModels';

const getInitialSelections = (providers, initialModels) => {
    const savedSelections = localStorage.getItem(STORAGE_KEY);
    if (savedSelections) {
        try {
            const { providers: savedProviders, models: savedModels } = JSON.parse(savedSelections);
            return {
                providers: new Set(savedProviders),
                models: new Set(savedModels)
            };
        } catch (error) {
            console.error('Error loading saved selections:', error);
        }
    }
    // Default to all providers and models selected
    const allModels = new Set(initialModels.map(model => model.id));
    return {
        providers: new Set(providers),
        models: allModels
    };
};

export default function ProviderSelector({ providers, initialModels, onFilter }) {
    const initialSelection = getInitialSelections(providers, initialModels);
    const [selectedProviders, setSelectedProviders] = useState(initialSelection.providers);
    const [expandedProviders, setExpandedProviders] = useState({});
    const [selectedModels, setSelectedModels] = useState(initialSelection.models);

    // Memoize Provider-Model Grouping
    const modelsByProvider = useMemo(() => {
        const map = new Map();
        initialModels.forEach(model => {
            const provider = model.id.split('/')[0];
            if (!map.has(provider)) map.set(provider, []);
            map.get(provider).push(model);
        });
        return map;
    }, [initialModels]);

    // Memoize Event Handlers
    const handleCheckboxChange = useCallback((provider, isChecked) => {
        setSelectedProviders(prev => {
            const newSet = new Set(prev);
            isChecked ? newSet.add(provider) : newSet.delete(provider);
            return newSet;
        });
    }, []);

    const handleModelCheckboxChange = useCallback((modelId, isChecked) => {
        setSelectedModels(prev => {
            const newSet = new Set(prev);
            isChecked ? newSet.add(modelId) : newSet.delete(modelId);
            return newSet;
        });
    }, []);

    // Optimize Filtering in useEffect
    useEffect(() => {
        const filteredModels = initialModels.filter(model => {
            const provider = model.id.split('/')[0];
            return selectedProviders.has(provider) && selectedModels.has(model.id);
        });
        onFilter(filteredModels);
    }, [selectedProviders, selectedModels, initialModels, onFilter]);

    // Save selections to localStorage whenever they change
    useEffect(() => {
        const selections = {
            providers: Array.from(selectedProviders),
            models: Array.from(selectedModels)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    }, [selectedProviders, selectedModels]);

    const toggleProvider = (provider) => {
        setExpandedProviders(prev => ({
            ...prev,
            [provider]: !prev[provider]
        }));
    };

    const getModelsForProvider = (provider) => {
        return modelsByProvider.get(provider) || [];
    };

    const handleSelectAllProviders = () => {
        const allModels = new Set();
        providers.forEach(provider => {
            getModelsForProvider(provider).forEach(model => {
                allModels.add(model.id);
            });
        });
        setSelectedProviders(new Set(providers));
        setSelectedModels(allModels);
    };

    const handleSelectNoProviders = () => {
        setSelectedProviders(new Set());
        setSelectedModels(new Set());
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
                                onClick={handleSelectAllProviders}
                            >
                                All
                            </button>
                            <button
                                className="btn btn-xs btn-ghost"
                                onClick={handleSelectNoProviders}
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
                                    onClick={() => {
                                        if (getModelsForProvider(provider).length > 0) {
                                            toggleProvider(provider);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={selectedProviders.has(provider)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleCheckboxChange(provider, e.target.checked);
                                            }}
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
                            className="btn btn-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('provider-modal').checked = false;
                            }}
                        >
                            Cancel
                        </label>
                        <label
                            htmlFor="provider-modal"
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('provider-modal').checked = false;
                            }}
                        >
                            Apply
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
