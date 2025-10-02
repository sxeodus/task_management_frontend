import TaskForm from '../Tasks/TaskForm';
import TaskList from '../Tasks/TaskList';
import ProjectForm from '../Projects/ProjectForm';
import ProjectList from '../Projects/ProjectList';
import useAuthStore from '../../store/authStore';

const TaskManagerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <button 
          onClick={() => useAuthStore.getState().logout()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <TaskForm />
      <TaskList />
      <ProjectForm />
      <ProjectList />
    </div>
  );
};

export default TaskManagerDashboard;