<template>
  <div>
    <h1>Список задач</h1>
    <p><router-link to="/new">Добавить задачу</router-link></p>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <p><strong>Заголовок:</strong> {{ task.title }}</p>
        <p><strong>Описание:</strong> {{ task.description }}</p>
        <button @click="confirmDelete(task.id)">Удалить</button>
        <button @click="editTask(task)">Редактировать</button>
        <div v-if="showConfirmation[task.id]">
          <p>Вы уверены, что хотите удалить задачу?</p>
          <button @click="deleteTask(task.id)">Да</button>
          <button @click="cancelDelete(task.id)">Отмена</button>
        </div>
        <div v-if="taskToEdit === task.id">
          <input v-model="editedTask.title" type="text" placeholder="Новый заголовок">
          <textarea v-model="editedTask.description" placeholder="Новое описание"></textarea>
          <button @click="saveTaskEdit(task.id)">Сохранить</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TaskList',
  setup() {
    const store = useStore();
    const tasks = computed(() => store.getters.allTasks);
    const taskToDelete = ref(null);
    const showConfirmation = ref({});
    const taskToEdit = ref(null);
    const editedTask = ref({ title: '', description: '' });

    const confirmDelete = (id) => {
      taskToDelete.value = id;
      showConfirmation.value = {
        ...showConfirmation.value,
        [id]: true
      };
    };

    const deleteTask = (taskId) => {
      store.commit('deleteTask', taskId);
    };

    const editTask = (task) => {
      taskToEdit.value = task.id;
      editedTask.value = { ...task };
    };

    const saveTaskEdit = (taskId) => {
      store.commit('editTask', { id: taskId, title: editedTask.value.title, description: editedTask.value.description });
      taskToEdit.value = null;
    };

    const cancelDelete = (id) => {
      taskToDelete.value = null;
      showConfirmation.value = {
        ...showConfirmation.value,
        [id]: false
      };
    };

    // Дополнительно сохраняем задачи в localStorage при каждом изменении
    store.watch(() => store.getters.allTasks, (tasks) => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { deep: true });

    onMounted(() => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (savedTasks) {
        savedTasks.forEach(task => {
          store.commit('addTask', task);
        });
      }
    });

    return {
      tasks,
      confirmDelete,
      deleteTask,
      editTask,
      cancelDelete,
      showConfirmation,
      saveTaskEdit,
      taskToEdit,
      editedTask
    };
  }
}
</script>
