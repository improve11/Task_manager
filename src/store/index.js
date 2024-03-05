import { createStore } from 'vuex';

export default createStore({
  state: {
    tasks: [],
  },
  mutations: {
    addTask(state, task) {
      if (!state.tasks.find(t => t.title === task.title && t.description === task.description)) {
        state.tasks.push(task);
      }
    },
    deleteTask(state, taskId) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    editTask(state, updatedTask) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    }
  },
  actions: {
    
  },
  getters: {
    allTasks: state => state.tasks,
  },
});