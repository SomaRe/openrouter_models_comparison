import ModelsTable from '../components/ModelsTable';

async function getModels() {
    const res = await fetch(process.env.OPENROUTER_MODELS_URL || "");
    const data = await res.json();
    return data.data;
}

export default async function Home() {
    const initialModels = await getModels();

    // Extract providers from model IDs
    const providers = [...new Set(initialModels.map(model => model.id.split('/')[0]))];

    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">OpenRouter Models</h1>

                {/* Provider Dropdown */}
                <div className="dropdown dropdown-hover mb-4">
                    <div tabIndex={0} role="button" className="btn select-bordered w-full max-w-xs">
                        Select Provider
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 max-h-[40vh] overflow-y-auto">
                        {providers.map(provider => (
                            <li key={provider}>
                                <a>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" className="checkbox" />
                                        <span>{provider}</span>
                                    </label>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <ModelsTable models={initialModels} />
            </div>
        </div>

    );
}
