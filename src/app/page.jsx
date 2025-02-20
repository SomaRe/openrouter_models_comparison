'use client';

import React, { useState } from 'react';
import ModelsTable from '../components/ModelsTable';
import ProviderSelector from '../components/ProviderSelector';

async function getModels() {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/models");
        
        // Check if response is OK
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
        }

        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Failed to fetch models:', error);
        return []; // Return empty array on error
    }
}

export default function Home() {
    const [initialModels, setInitialModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [providers, setProviders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const models = await getModels();
                setInitialModels(models);
                setFilteredModels(models);
                const uniqueProviders = [...new Set(models.map(model => model.id.split('/')[0]))].sort();
                setProviders(uniqueProviders);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">OpenRouter Models</h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : error ? (
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Error loading models: {error}</span>
                    </div>
                ) : (
                    <>
                        <ProviderSelector 
                            providers={providers} 
                            initialModels={initialModels}
                            onFilter={setFilteredModels}
                        />
                        <ModelsTable models={filteredModels} />
                    </>
                )}
            </div>
        </div>
    );
}
