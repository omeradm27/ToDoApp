// todoStore.js
import { create } from 'zustand';

const useTodoStore = create((set) => ({
    todos: [], // Set initial value to an empty array
    setTodos: (newTodos) => set({ todos: newTodos }),
}));


export default { useTodoStore };
