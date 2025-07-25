import Project from './project.js';
import Todo from './todo.js';

const appContainer = document.getElementById('app');

export function renderProjects(projects, onProjectSelect, onAddProject) {
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

  // Add new project form
  const addProjectForm = document.createElement('form');
  addProjectForm.id = 'add-project-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'New project name';
  input.name = 'projectName';
  input.required = true;

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Project';

  addProjectForm.appendChild(input);
  addProjectForm.appendChild(addButton);

  addProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const projectName = input.value.trim();
    if (projectName) {
      onAddProject(projectName);
      input.value = '';
    }
  });

  projectsContainer.appendChild(addProjectForm);

  return projectsContainer;
}

export function renderTodos(todos, onTodoToggle, onTodoDelete, onAddTodo) {
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

  // Add new todo form
  const addTodoForm = document.createElement('form');
  addTodoForm.id = 'add-todo-form';

  // Title input
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Title';
  titleInput.name = 'title';
  titleInput.required = true;

  // Description input
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.placeholder = 'Description';
  descriptionInput.name = 'description';

  // Due date input
  const dueDateInput = document.createElement('input');
  dueDateInput.type = 'date';
  dueDateInput.name = 'dueDate';
  dueDateInput.required = true;

  // Priority select
  const prioritySelect = document.createElement('select');
  prioritySelect.name = 'priority';
  ['low', 'medium', 'high'].forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    prioritySelect.appendChild(option);
  });

  // Submit button
  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Todo';

  addTodoForm.appendChild(titleInput);
  addTodoForm.appendChild(descriptionInput);
  addTodoForm.appendChild(dueDateInput);
  addTodoForm.appendChild(prioritySelect);
  addTodoForm.appendChild(addButton);

  addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTodo = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      dueDate: dueDateInput.value,
      priority: prioritySelect.value,
    };
    if (newTodo.title && newTodo.dueDate) {
      onAddTodo(newTodo);
      addTodoForm.reset();
    }
  });

  todosContainer.appendChild(addTodoForm);

  return todosContainer;
}