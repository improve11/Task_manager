<template>
  <div>
    <h1>Форма задачи</h1>
    <form @submit.prevent="submitForm">
      <label for="title">Заголовок:</label>
      <input type="text" id="title" v-model="newTask.title" required>
      <br>
      <label for="description">Описание:</label>
      <textarea id="description" v-model="newTask.description" required></textarea>
      <br>
      <button type="submit">Сохранить</button>
      <button type="button" @click="cancelForm">Отменить</button>
    </form>

    <h2>Добавленные задачи</h2>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <p><strong>Заголовок:</strong> {{ task.title }}</p>
        <p><strong>Описание:</strong> {{ task.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TaskForm',
  setup() {
    const store = useStore();
    const newTask = ref({
      title: '',
      description: ''
    });

    const editingTask = store.getters.getEditingTask;

    const submitForm = () => {
      if (!newTask.value.title.trim() || !newTask.value.description.trim()) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      const existingTask = store.getters.allTasks.find(task => task.title === newTask.value.title && task.description === newTask.value.description);
    
      if (!existingTask) {
        store.commit('addTask', { ...newTask.value, id: Date.now() });
      }

      if (editingTask) {
        store.commit('updateTask', { ...editingTask, ...newTask.value });
      } else {
        store.commit('addTask', { ...newTask.value, id: Date.now() });
      }

      newTask.value.title = '';
      newTask.value.description = '';
    
    };

    const tasks = computed(() => store.getters.allTasks);

    const cancelForm = () => {
      newTask.value.title = '';
      newTask.value.description = '';
    };

    onMounted(() => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (savedTasks) {
        savedTasks.forEach(task => {
          store.commit('addTask', task);
        });
      }
    });

    store.subscribe((mutation, state) => {
      if (mutation.type === 'addTask') {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    });

    return {
      newTask,
      submitForm,
      tasks,
      cancelForm,
      onMounted,
      editingTask,
    };
  }
}
</script>
