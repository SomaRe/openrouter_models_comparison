import React from 'react';

async function getModels() {
  const res = await fetch(process.env.OPENROUTER_MODELS_URL || "");
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const models = await getModels();

  return (
    <div>
      <h1>OpenRouter Models</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.id}>
              <td>{model.id}</td>
              <td>{model.name}</td>
              <td>{model.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
