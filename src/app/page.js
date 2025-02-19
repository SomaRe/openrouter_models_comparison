import React from 'react';

async function getModels() {
  const res = await fetch(process.env.OPENROUTER_MODELS_URL || "");
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const models = await getModels();

  return (
    <div className="container mx-auto py-8 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">OpenRouter Models</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-2 px-4 border-b dark:border-gray-600 text-left">ID</th>
              <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Name</th>
              <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Cost per Million Input Tokens</th>
              <th className="py-2 px-4 border-b dark:border-gray-600 text-left">Cost per Million Output Tokens</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="py-2 px-4 border-b dark:border-gray-600">{model.id}</td>
                <td className="py-2 px-4 border-b dark:border-gray-600">{model.name}</td>
                <td className="py-2 px-4 border-b dark:border-gray-600">${(model.pricing.prompt * 1000000).toFixed(6).replace(/\.?0+$/, "")}</td>
                <td className="py-2 px-4 border-b dark:border-gray-600">${(model.pricing.completion * 1000000).toFixed(6).replace(/\.?0+$/, "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
