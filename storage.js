const STORAGE_KEY = 'todoListProjects';

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProjects() {
  const projectsJSON = localStorage.getItem(STORAGE_KEY);
  if (!projectsJSON) return [];
  try {
    const projects = JSON.parse(projectsJSON);
    return projects;
  } catch (error) {
    console.error('Error parsing projects from localStorage', error);
    return [];
  }
}