import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useTaskStore = create((set, get) => ({
  tasks: [],
  projects: [],
  isLoading: false,
  error: null,

  // Fetch tasks from backend
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/tasks');
      set({ tasks: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to fetch tasks');
    }
  },

  // Create a new task
  addTask: async (task) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/tasks', task);
      set((state) => ({
        tasks: [...state.tasks, response.data.data],
        isLoading: false,
        error: null
      }));
      toast.success('Task created!');
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create task');
    }
  },

  // Update a task
  updateTask: async (taskId, updates) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? response.data.data : task
        ),
        isLoading: false,
        error: null
      }));
      toast.success('Task updated!');
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update task');
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId),
        isLoading: false,
        error: null
      }));
      toast.success('Task deleted!');
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete task');
    }
  },

  // Fetch projects from backend
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/projects');
      set({ projects: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to fetch projects');
    }
  },

  // Create a new project
  addProject: async (project) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/projects', project);
      set((state) => ({
        projects: [...state.projects, response.data.data],
        isLoading: false,
        error: null
      }));
      toast.success('Project created!');
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create project');
    }
  },

  // Update a project
  updateProject: async (projectId, updates) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/projects/${projectId}`, updates);
      set((state) => ({
        projects: state.projects.map(project =>
          project.id === projectId ? response.data.data : project
        ),
        isLoading: false,
        error: null
      }));
      toast.success('Project updated!');
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update project');
    }
  },

  // Delete a project
  deleteProject: async (projectId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter(project => project.id !== projectId),
        isLoading: false,
        error: null
      }));
      toast.success('Project deleted!');
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete project');
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTaskStore;