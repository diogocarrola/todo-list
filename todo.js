export default class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate; // Expected to be a string or Date object
    this.priority = priority; // e.g., 'low', 'medium', 'high'
    this.completed = false;
    this.id = Date.now().toString(); // simple unique id based on timestamp
  }

  toggleComplete() {
    this.completed = !this.completed;
  }
}