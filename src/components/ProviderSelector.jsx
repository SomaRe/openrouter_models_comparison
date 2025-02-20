'use client';

import React from 'react';

export default function ProviderSelector({ providers }) {
    return (
        <div className="mb-4">
            <label htmlFor="provider-modal" className="btn btn-primary">
                Select Providers
            </label>
            
            <input type="checkbox" id="provider-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl h-[70vh] flex flex-col">
                    <h3 className="font-bold text-lg mb-4">Select Providers</h3>
                    <div className="flex justify-between mb-4">
                        <button className="btn btn-sm btn-ghost" onClick={(e) => {
                            e.preventDefault();
                            document.querySelectorAll('.provider-checkbox').forEach(checkbox => {
                                checkbox.checked = true;
                            });
                        }}>
                            Select All
                        </button>
                        <button className="btn btn-sm btn-ghost" onClick={(e) => {
                            e.preventDefault();
                            document.querySelectorAll('.provider-checkbox').forEach(checkbox => {
                                checkbox.checked = false;
                            });
                        }}>
                            Unselect All
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1">
                        {providers.map(provider => (
                            <div key={provider} className="card bg-base-100 shadow-sm">
                                <div className="card-body p-4">
                                    <label className="label cursor-pointer justify-start gap-4">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox provider-checkbox" 
                                            defaultChecked
                                        />
                                        <span className="label-text">{provider}</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal-action">
                        <label htmlFor="provider-modal" className="btn btn-primary">
                            Apply Filters
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
