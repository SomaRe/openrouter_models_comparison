import ModelsTable from '../components/ModelsTable';

async function getModels() {
    const res = await fetch(process.env.OPENROUTER_MODELS_URL || "");
    const data = await res.json();
    return data.data;
}

export default async function Home() {
    const initialModels = await getModels();

    // Extract providers from model IDs
    // Extract providers from model IDs and sort them alphabetically
    const providers = [...new Set(initialModels.map(model => model.id.split('/')[0]))].sort();

    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">OpenRouter Models</h1>

                {/* Provider Dropdown */}
                <details className="dropdown mb-4">
                    <summary role="button" className="btn select-bordered w-full max-w-xs">
                        Select Provider
                    </summary>
                    <ul className="menu dropdown-content z-50 p-2 shadow bg-base-100 rounded-box w-64 max-h-96 overflow-y-auto">
                        <div className="overflow-y-auto max-h-96">
                            {providers.map(provider => (
                                <li key={provider}>
                                    <a>
                                        <label className="flex items-center p-2 cursor-pointer">
                                            <input type="checkbox" className="checkbox" />
                                            <span className="ml-2">{provider}</span>
                                        </label>
                                    </a>
                                </li>
                            ))}
                        </div>
                    </ul>
                </details>

                <ModelsTable models={initialModels} />
            </div>
        </div>

    );
}
