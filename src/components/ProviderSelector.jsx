'use client';

import React, { useState, useEffect } from 'react';

export default function ProviderSelector({ providers, initialModels, onFilter }) {
    const [selectedProviders, setSelectedProviders] = useState(new Set(providers));
    const [expandedProviders, setExpandedProviders] = useState({});
    const [selectedModels, setSelectedModels] = useState(new Set());

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
            <label htmlFor="provider-modal" className="btn btn-primary">
                Select Providers
            </label>

            <input type="checkbox" id="provider-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl h-[70vh] flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Select Providers</h3>
                    <div className="flex justify-start gap-4 mb-4">
                        <button className="btn btn-sm btn-ghost" onClick={(e) => {
                            e.preventDefault();
                            setSelectedProviders(new Set(providers));
                        }}>
                            Select All
                        </button>
                        <button className="btn btn-sm btn-ghost" onClick={(e) => {
                            e.preventDefault();
                            setSelectedProviders(new Set());
                        }}>
                            Unselect All
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {providers.map(provider => (
                            <div key={provider} className="mb-2">
                                <div className="card bg-base-100 shadow-sm">
                                    <div className="card-body p-4">
                                        <label className="label cursor-pointer justify-start gap-4">
                                            <input
                                                type="checkbox"
                                                className="checkbox provider-checkbox"
                                                checked={selectedProviders.has(provider)}
                                                onChange={(e) => handleCheckboxChange(provider, e.target.checked)}
                                            />
                                            <span className="label-text">{provider}</span>
                                        </label>
                                        {getModelsForProvider(provider).length > 0 && (
                                            <button className="btn btn-sm btn-ghost" onClick={() => toggleProvider(provider)}>
                                                {expandedProviders[provider] ? 'Hide Models' : 'Show Models'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {expandedProviders[provider] && (
                                    <div className="ml-4">
                                        {getModelsForProvider(provider).map(model => (
                                            <div key={model.id} className="py-2">
                                                <label className="label cursor-pointer justify-start gap-4" style={{ opacity: selectedProviders.has(provider) ? 1 : 0.5 }}>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox model-checkbox"
                                                        checked={selectedModels.has(model.id)}
                                                        onChange={(e) => handleModelCheckboxChange(model.id, e.target.checked)}
                                                        disabled={!selectedProviders.has(provider)}
                                                    />
                                                    <span className="label-text">{model.name} ({model.id})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="modal-action">
                        <label
                            htmlFor="provider-modal"
                            className="btn btn-primary"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
