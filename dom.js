import Project from './project.js';
import Todo from './todo.js';

const appContainer = document.getElementById('app');

export function renderProjects(projects, onProjectSelect) {
  const projectsContainer = document.createElement('div');
  projectsContainer.id = 'projects-container';

  projects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project-item');
    projectElement.textContent = project.name;
    projectElement.dataset.projectId = project.id;
    projectElement.addEventListener('click', () => onProjectSelect(project.id));
    projectsContainer.appendChild(projectElement);
  });

  return projectsContainer;
}

export function renderTodos(todos, onTodoToggle, onTodoDelete) {
  const todosContainer = document.createElement('div');
  todosContainer.id = 'todos-container';

  todos.forEach(todo => {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo-item');
    todoElement.dataset.todoId = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => onTodoToggle(todo.id));

    const title = document.createElement('span');
    title.textContent = `${todo.title} (Due: ${todo.dueDate}) [${todo.priority}]`;
    if (todo.completed) {
      title.style.textDecoration = 'line-through';
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => onTodoDelete(todo.id));

    todoElement.appendChild(checkbox);
    todoElement.appendChild(title);
    todoElement.appendChild(deleteBtn);

    todosContainer.appendChild(todoElement);
  });

  return todosContainer;
}