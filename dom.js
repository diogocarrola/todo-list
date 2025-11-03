const appContainer = document.getElementById('app');

export function renderProjects(projects, onProjectSelect, onAddProject, onProjectDelete, onProjectRename, currentProjectId) {
  const projectsContainer = document.createElement('div');
  projectsContainer.id = 'projects-container';
  const projectsList = document.createElement('div');
  projectsList.className = 'projects-list';

  projects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project-item');
    if (project.id === currentProjectId) {
      projectElement.classList.add('active');
    }
    projectElement.dataset.projectId = project.id;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'project-name';
    nameSpan.textContent = project.name;
    nameSpan.style.cursor = 'pointer';
    nameSpan.addEventListener('click', () => onProjectSelect(project.id));

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'project-actions';

    const renameBtn = document.createElement('button');
    renameBtn.textContent = '✏️';
    renameBtn.className = 'btn-project-action';
    renameBtn.title = 'Rename';
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showRenameProjectModal(project, onProjectRename);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'btn-project-action';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete project "${project.name}"?`)) {
        onProjectDelete(project.id);
      }
    });

    actionsDiv.appendChild(renameBtn);
    actionsDiv.appendChild(deleteBtn);

    projectElement.appendChild(nameSpan);
    projectElement.appendChild(actionsDiv);
    projectsList.appendChild(projectElement);
  });

  projectsContainer.appendChild(projectsList);

  // Add new project form
  const addProjectForm = document.createElement('form');
  addProjectForm.id = 'add-project-form';
  addProjectForm.className = 'add-project-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'New mission';
  input.name = 'projectName';
  input.required = true;

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Mission';
  addButton.className = 'btn-primary';

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

function showRenameProjectModal(project, onRename) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Rename Mission</h3>
      <input type="text" id="rename-input" value="${project.name}" placeholder="New mission name">
      <div class="modal-actions">
        <button id="rename-save" class="btn-primary">Save</button>
        <button id="rename-cancel" class="btn-secondary">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const input = modal.querySelector('#rename-input');
  input.focus();
  input.select();

  modal.querySelector('#rename-cancel').onclick = () => modal.remove();
  modal.querySelector('#rename-save').onclick = () => {
    const newName = input.value.trim();
    if (newName && newName !== project.name) {
      onRename(project.id, newName);
    }
    modal.remove();
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') modal.querySelector('#rename-save').click();
    if (e.key === 'Escape') modal.remove();
  });
}

export function renderTodos(todos, onTodoToggle, onTodoDelete, onTodoEdit, onAddTodo) {
  const todosContainer = document.createElement('div');
  todosContainer.id = 'todos-container';

  todos.forEach(todo => {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo-item');
    todoElement.dataset.todoId = todo.id;
    todoElement.classList.add(todo.priority);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => onTodoToggle(todo.id));

    const title = document.createElement('span');
    title.textContent = `${todo.title} (Due: ${todo.dueDate}) [${todo.priority}]`;
    if (todo.completed) {
      todoElement.classList.add('completed');
      title.style.textDecoration = 'line-through';
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => onTodoDelete(todo.id));

    const expandBtn = document.createElement('button');
    expandBtn.textContent = 'Details';
    expandBtn.addEventListener('click', () => {
      showEditModal(todo, (updated) => {
        if (typeof onTodoEdit === 'function') {
          onTodoEdit(todo.id, updated);
        }
      });
    });

    todoElement.appendChild(checkbox);
    todoElement.appendChild(title);
    // timeline indicator
    const timeline = createTimelineIndicator(todo.dueDate, todo.priority);
    todoElement.appendChild(timeline);
    todoElement.appendChild(deleteBtn);
    todoElement.appendChild(expandBtn);

    todosContainer.appendChild(todoElement);
  });

  // Add new todo form (structured for KITT styling)
  const addTodoForm = document.createElement('form');
  addTodoForm.id = 'add-todo-form';
  addTodoForm.className = 'add-todo-form';

  const formGrid = document.createElement('div');
  formGrid.className = 'form-grid';

  // Title group
  const titleGroup = document.createElement('div');
  titleGroup.className = 'form-group';
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.placeholder = 'Mission Title';
  titleInput.name = 'title';
  titleInput.required = true;
  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);

  // Description group
  const descGroup = document.createElement('div');
  descGroup.className = 'form-group';
  const descLabel = document.createElement('label');
  descLabel.textContent = 'Description';
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.placeholder = 'Short description';
  descriptionInput.name = 'description';
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descriptionInput);

  // Due date group
  const dateGroup = document.createElement('div');
  dateGroup.className = 'form-group';
  const dateLabel = document.createElement('label');
  dateLabel.textContent = 'Due Date';
  const dueDateInput = document.createElement('input');
  dueDateInput.type = 'date';
  dueDateInput.name = 'dueDate';
  dueDateInput.required = true;
  dateGroup.appendChild(dateLabel);
  dateGroup.appendChild(dueDateInput);

  // Priority group
  const priorityGroup = document.createElement('div');
  priorityGroup.className = 'form-group';
  const priorityLabel = document.createElement('label');
  priorityLabel.textContent = 'Priority';
  const prioritySelect = document.createElement('select');
  prioritySelect.name = 'priority';
  ['low', 'medium', 'high'].forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    prioritySelect.appendChild(option);
  });
  priorityGroup.appendChild(priorityLabel);
  priorityGroup.appendChild(prioritySelect);

  formGrid.appendChild(titleGroup);
  formGrid.appendChild(descGroup);
  formGrid.appendChild(dateGroup);
  formGrid.appendChild(priorityGroup);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'form-actions';
  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Todo';
  addButton.className = 'btn-primary';
  actions.appendChild(addButton);

  addTodoForm.appendChild(formGrid);
  addTodoForm.appendChild(actions);

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

export function createTimelineIndicator(dueDateValue, priority) {
  const wrap = document.createElement('div');
  wrap.className = 'timeline-indicator';

  // normalize dueDate
  const due = dueDateValue ? new Date(dueDateValue) : null;
  if (!due || Number.isNaN(due.getTime())) {
    wrap.textContent = 'No due date';
    wrap.style.opacity = '0.6';
    return wrap;
  }

  const now = new Date();
  const diffMs = due - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  let label = '';
  if (diffMs < 0) {
    label = 'Overdue';
    wrap.classList.add('overdue');
    const badge = document.createElement('span');
    badge.className = 'overdue-badge';
    badge.textContent = 'OVERDUE';
    wrap.appendChild(badge);
    return wrap;
  }

  if (diffDays >= 1) label = `${diffDays}d left`;
  else if (diffHours >= 1) label = `${diffHours}h left`;
  else label = 'Less than 1h';

  const text = document.createElement('span');
  text.textContent = label;
  wrap.appendChild(text);
  return wrap;
}

function showEditModal(todo, onSave) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Edit Todo</h3>
      <label>Title: <input type="text" id="edit-title" value="${todo.title}"></label><br>
      <label>Description: <input type="text" id="edit-desc" value="${todo.description}"></label><br>
      <label>Due Date: <input type="date" id="edit-date" value="${todo.dueDate}"></label><br>
      <label>Priority:
        <select id="edit-priority">
          <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
      </label><br>
      <button id="save-edit">Save</button>
      <button id="close-modal">Cancel</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#close-modal').onclick = () => modal.remove();
  modal.querySelector('#save-edit').onclick = () => {
    onSave({
      title: modal.querySelector('#edit-title').value,
      description: modal.querySelector('#edit-desc').value,
      dueDate: modal.querySelector('#edit-date').value,
      priority: modal.querySelector('#edit-priority').value,
    });
    modal.remove();
  };
}