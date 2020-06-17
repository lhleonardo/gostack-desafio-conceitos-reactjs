import React, { useState, useEffect } from "react";

import "./styles.css";
import api from "./services/api";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function loadRepositories() {
      const response = await api.get("/repositories");

      setRepositories(response.data);
    }

    loadRepositories();
  }, []);

  useEffect(() => console.log(repositories), [repositories]);

  async function handleAddRepository() {
    // TODO

    const repoTitle = `Repositorio ${repositories.length + 1}`;

    const repository = {
      title: repoTitle,
      url: `https://github.com/lhleonardo/${repoTitle.trim().toLowerCase()}`,
    };

    const response = await api.post("/repositories", repository);

    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      return;
    }

    try {
      await api.delete(`/repositories/${id}`);

      const newRepositories = [
        ...repositories.slice(0, repositoryIndex),
        ...repositories.slice(repositoryIndex + 1),
      ];

      setRepositories(newRepositories);
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
