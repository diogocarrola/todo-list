import Project from './project.js';
import Todo from './todo.js';
import { saveProjects, loadProjects } from './storage.js';
import { renderProjects, renderTodos } from './dom.js';
import { KittVoiceManager } from './motivation.js';

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
  const defaultProject = new Project('Current Missions');
  projects = [defaultProject];
  saveProjects(projects);
}

let currentProjectId = projects[0].id;
const kittVoice = new KittVoiceManager();

// Theme mode management
let themeMode = {
  turbo: localStorage.getItem('turbo-mode') === 'true',
  surveillance: localStorage.getItem('surveillance-mode') === 'true',
  auto: localStorage.getItem('auto-mode') === 'true'
};

function setThemeMode(mode) {
  // Reset all modes if activating a new one
  if (mode === 'turbo') {
    themeMode.turbo = !themeMode.turbo;
    localStorage.setItem('turbo-mode', themeMode.turbo);
  } else if (mode === 'surveillance') {
    themeMode.surveillance = !themeMode.surveillance;
    themeMode.auto = false;
    localStorage.setItem('surveillance-mode', themeMode.surveillance);
    localStorage.setItem('auto-mode', false);
  } else if (mode === 'auto') {
    themeMode.auto = !themeMode.auto;
    themeMode.surveillance = false;
    localStorage.setItem('auto-mode', themeMode.auto);
    localStorage.setItem('surveillance-mode', false);
  }
  applyThemeMode();
}

function applyThemeMode() {
  document.body.classList.remove('turbo-mode', 'surveillance-mode', 'auto-mode');
  if (themeMode.turbo) document.body.classList.add('turbo-mode');
  if (themeMode.surveillance) document.body.classList.add('surveillance-mode');
  if (themeMode.auto) document.body.classList.add('auto-mode');
  // If Auto is active but Surveillance isn't, invert small decorative details
  if (themeMode.auto && !themeMode.surveillance) {
    document.body.classList.add('details-inverse');
  } else {
    document.body.classList.remove('details-inverse');
  }
}

function getThemeMode() {
  return themeMode;
}

applyThemeMode();

// Update mission stats
function updateMissionStats() {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;

  const activeMissions = project.todos.filter(todo => !todo.completed).length;
  const criticalMissions = project.todos.filter(todo => 
    !todo.completed && todo.priority === 'high'
  ).length;

  document.getElementById('active-missions').textContent = activeMissions;
  document.getElementById('critical-missions').textContent = criticalMissions;
}

// Update time display
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById('current-time').textContent = timeString;
  document.getElementById('current-date').textContent = dateString;
}

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

function onProjectDelete(projectId) {
  projects = projects.filter(p => p.id !== projectId);
  if (projects.length === 0) {
    const defaultProject = new Project('Current Missions');
    projects = [defaultProject];
    currentProjectId = defaultProject.id;
  } else if (currentProjectId === projectId) {
    currentProjectId = projects[0].id;
  }
  saveProjects(projects);
  renderApp();
}

function onProjectRename(projectId, newName) {
  const project = projects.find(p => p.id === projectId);
  if (project) {
    project.name = newName;
    saveProjects(projects);
    renderApp();
  }
}

function onTodoToggle(todoId) {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  const todo = project.todos.find(t => t.id === todoId);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveProjects(projects);
  
  if (todo.completed) {
    kittVoice.showCompletionMessage();
  }
  
  renderApp();
}

function onTodoDelete(todoId) {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  project.todos = project.todos.filter(t => t.id !== todoId);
  saveProjects(projects);
  renderApp();
}

function onTodoEdit(todoId, updated) {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  const todo = project.todos.find(t => t.id === todoId);
  if (!todo) return;
  todo.title = updated.title;
  todo.description = updated.description;
  todo.dueDate = updated.dueDate;
  todo.priority = updated.priority;
  saveProjects(projects);
  renderApp();
}

function onAddTodo(todoData) {
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;
  const newTodo = new Todo(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
  project.addTodo(newTodo);
  saveProjects(projects);
  kittVoice.showNewMissionMessage();
  renderApp();
}

function renderStats(project) {
  const statsContainer = document.createElement('div');
  statsContainer.className = 'stats-container';
  
  const totalTodos = project.todos.length;
  const completedTodos = project.todos.filter(todo => todo.completed).length;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  const highPriorityCount = project.todos.filter(todo => 
    todo.priority === 'high' && !todo.completed
  ).length;
  
  const overdueCount = project.todos.filter(todo => {
    if (todo.completed) return false;
    const due = new Date(todo.dueDate);
    const now = new Date();
    return due < now;
  }).length;

  statsContainer.innerHTML = `
    <div class="stat-card">
      <span class="stat-number">${completionRate}%</span>
      <span class="stat-label">Mission Completion</span>
    </div>
    <div class="stat-card ${highPriorityCount > 0 ? 'urgent' : ''}">
      <span class="stat-number">${highPriorityCount}</span>
      <span class="stat-label">Priority Missions</span>
    </div>
    <div class="stat-card ${overdueCount > 0 ? 'overdue' : ''}">
      <span class="stat-number">${overdueCount}</span>
      <span class="stat-label">Overdue Missions</span>
    </div>
  `;
  
  return statsContainer;
}

function renderDashboardButtons() {
  const statusPanel = document.querySelector('.left-panel');
  const existingButtons = statusPanel.querySelector('.dashboard-buttons');
  if (existingButtons) existingButtons.remove();

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dashboard-buttons';

  const turboBtn = document.createElement('button');
  turboBtn.className = `dashboard-btn btn-red ${themeMode.turbo ? 'active' : ''}`;
  turboBtn.innerHTML = '<span>TURBO BOOST</span>';
  turboBtn.addEventListener('click', () => {
    setThemeMode('turbo');
    renderDashboardButtons();
  });

  const surveillanceBtn = document.createElement('button');
  surveillanceBtn.className = `dashboard-btn btn-yellow ${themeMode.surveillance ? 'active' : ''}`;
  surveillanceBtn.innerHTML = '<span>SURVEILLANCE MODE</span>';
  surveillanceBtn.addEventListener('click', () => {
    setThemeMode('surveillance');
    renderDashboardButtons();
  });

  const autoBtn = document.createElement('button');
  autoBtn.className = `dashboard-btn btn-orange ${themeMode.auto ? 'active' : ''}`;
  autoBtn.innerHTML = '<span>AUTO CRUISE</span>';
  autoBtn.addEventListener('click', () => {
    setThemeMode('auto');
    renderDashboardButtons();
  });

  buttonContainer.appendChild(turboBtn);
  buttonContainer.appendChild(surveillanceBtn);
  buttonContainer.appendChild(autoBtn);

  const systemStatus = statusPanel.querySelector('.system-status');
  if (systemStatus) {
    systemStatus.insertAdjacentElement('beforebegin', buttonContainer);
  }
}

function renderApp() {
  const projectsSidebar = document.getElementById('projects-sidebar');
  const todosSection = document.getElementById('todos-section');
  
  // Render projects sidebar
  projectsSidebar.innerHTML = '';
  const projectsElement = renderProjects(projects, onProjectSelect, onAddProject, onProjectDelete, onProjectRename, currentProjectId);
  projectsSidebar.appendChild(projectsElement);
  
  renderDashboardButtons();
  
  // Render todos section
  todosSection.innerHTML = '';
  const project = projects.find(p => p.id === currentProjectId);
  if (project) {
    const statsElement = renderStats(project);
    todosSection.appendChild(statsElement);
    
    const todosElement = renderTodos(project.todos, onTodoToggle, onTodoDelete, onTodoEdit, onAddTodo);
    todosSection.appendChild(todosElement);
  }
  
  updateMissionStats();
}

// Initialize the app
updateTime();
setInterval(updateTime, 1000);
renderApp();

// Show welcome message
setTimeout(() => {
  kittVoice.showWelcomeMessage();
}, 1000);
