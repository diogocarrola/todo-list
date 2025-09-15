import Project from './project.js';
import Todo from './todo.js';
import { saveProjects, loadProjects } from './storage.js';
import { renderProjects, renderTodos } from './dom.js';

let projects = loadProjects().map(projectObj => {
  const project = new Project(projectObj.name);
  project.id = projectObj.id;
  project.todos = projectObj.todos.map(todoObj => {
    const todo = new Todo(todoObj.title, todoObj.description, todoObj.dueDate, todoObj.priority);
    todo.completed = todoObj.completed;
    todo.id = todoObj.id;
    return todo;
  });
  return project;
});
if (projects.length === 0) {
  // Initialize with a default project if none exist
  const defaultProject = new Project('Default Project');
  projects = [defaultProject];
  saveProjects(projects);
}

let currentProjectId = projects[0].id;

const appContainer = document.getElementById('app');

function onProjectSelect(projectId) {
  currentProjectId = projectId;
  renderApp();
}

function onAddProject(projectName) {
  const newProject = new Project(projectName);
  projects.push(newProject);
  currentProjectId = newProject.id;
  saveProjects(projects);
  renderApp();
}

function onTodoToggle(todoId) {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  const todo = project.todos.find(t => t.id === todoId);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveProjects(projects);
  renderApp();
}

function onTodoDelete(todoId) {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  project.todos = project.todos.filter(t => t.id !== todoId);
  saveProjects(projects);
  renderApp();
}

function renderApp() {
  appContainer.innerHTML = '';

  // Render projects list
  const projectsElement = renderProjects(projects, onProjectSelect, onAddProject);
  appContainer.appendChild(projectsElement);

  // Render todos for current project
  const project = projects.find(p => p.id === currentProjectId);
  if (project) {
    const todosElement = renderTodos(project.todos, onTodoToggle, onTodoDelete, onAddTodo);
    appContainer.appendChild(todosElement);
  }
}

function onAddTodo(todoData) {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  const newTodo = new Todo(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
  project.addTodo(newTodo);
  saveProjects(projects);
  renderApp();
}

renderApp();