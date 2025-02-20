import ModelsTable from '../components/ModelsTable';

async function getModels() {
    const res = await fetch(process.env.OPENROUTER_MODELS_URL || "");
    const data = await res.json();
    return data.data;
}

export default async function Home() {
    const initialModels = await getModels();

    return (
        <div className="container mx-auto py-8 dark:bg-gray-900 dark:text-white">
            <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">OpenRouter Models</h1>
            <ModelsTable models={initialModels} />
        </div>
    );
}