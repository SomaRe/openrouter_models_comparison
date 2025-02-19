import React from 'react';

async function getModels() {
  const res = await fetch(process.env.OPENROUTER_MODELS_URL || "");
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const models = await getModels();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">OpenRouter Models</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Cost per Million Tokens</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{model.id}</td>
              <td className="py-2 px-4 border-b">{model.name}</td>
              <td className="py-2 px-4 border-b">${(model.pricing.prompt * 1000000).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
