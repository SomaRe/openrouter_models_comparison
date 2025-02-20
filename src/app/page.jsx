import ModelsTable from '../components/ModelsTable';
import ProviderSelector from '../components/ProviderSelector';

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

                <ProviderSelector providers={providers} />

                <ModelsTable models={initialModels} />
            </div>
        </div>

    );
}
