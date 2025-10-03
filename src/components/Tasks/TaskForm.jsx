import { useForm } from 'react-hook-form';
import useTaskStore from '../../store/taskStore';

const TaskForm = () => {
  const { addTask, isLoading, projects } = useTaskStore();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    // Convert empty dueDate to null
    if (data.dueDate === "") {
      data.dueDate = null;
    }
    await addTask(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-wrap gap-2 items-center">
      <input
        {...register('title', { required: true })}
        placeholder="Task title"
        className="border px-2 py-1 rounded"
      />
      <input
        {...register('description')}
        placeholder="Description"
        className="border px-2 py-1 rounded"
      />
      <select {...register('priority')} className="border px-2 py-1 rounded">
        <option value="low">Low</option>
        <option value="medium" selected>Medium</option>
        <option value="high">High</option>
      </select>
      <select {...register('status')} className="border px-2 py-1 rounded">
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <input
        {...register('dueDate')}
        type="date"
        className="border px-2 py-1 rounded"
      />
      <select {...register('projectId')} className="border px-2 py-1 rounded">
        <option value="">No Project</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isLoading}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;