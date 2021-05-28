require("dotenv").config();
const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: "Id inválido" });

  return next();
}

app.use(logRequests);
app.use("/projects/:id", validateProjectId);

const projects = [];

app.get("/", (request, response) => {
  return response.send("Hello");
});

app.get("/projects", (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter((p) => p.title.includes(title))
    : projects;

  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;

  const project = {
    id: uuid(),
    title,
    owner,
  };

  projects.push(project);

  return response.status(200).json(project);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex < 0)
    return response.status(400).json({ error: "Projeto não encontrado" });

  const project = { title, owner };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((p) => p.id === id);

  if (projectIndex < 0)
    return response.status(400).json({ error: "Projeto não encontrado" });

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
