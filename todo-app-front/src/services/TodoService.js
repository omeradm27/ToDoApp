import requests from './httpService';

const TodoService = {
  getTodos() {
    return requests.get(`/todos/`);
  },
  getTodoById(id) {
    return requests.get(`/todos/${id}`);
  },
  getTodoByUserId(id) {
    return requests.get(`/todos/user/${id}`);
  },
  createTodo(body) {
    return requests.post(`/todos/`, body);
  },
  deleteTodoById(id) {
    return requests.delete(`/todos/${id}`);
  },
  updateTodoById(id,body) {
    return requests.put(`/todos/${id}`,body);
  },

};

export default TodoService;
