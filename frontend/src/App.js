import React, { useEffect, useState } from "react";
import "./App.css";

import api from "./services/api";

import Header from "./components/Header";

export default function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((response) => {
      setProjects(response.data);
    });
  }, []);

  async function handleAddProject() {
    const response = await api.post("/projects", {
      title: "teste front",
      owner: "nao",
    });
    setProjects([...projects, response.data]);
  }

  return (
    <>
      <Header title={"Homepage"}></Header>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.title}</li>
        ))}
      </ul>

      <button type="button" onClick={() => handleAddProject()}>
        Adicionar Projeto
      </button>
    </>
  );
}
