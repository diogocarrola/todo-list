import Todo from './todo.js';

export default class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
    this.id = Date.now().toString(); // simple unique id
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }

  getTodo(todoId) {
    return this.todos.find(todo => todo.id === todoId);
  }
}