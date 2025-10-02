import { useForm } from 'react-hook-form';
import useTaskStore from '../../store/taskStore';

const TaskEditForm = ({ task, onClose }) => {
  const { updateTask, isLoading } = useTaskStore();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: task
  });

  const onSubmit = async (data) => {
    await updateTask(task.id, data);
    reset();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <input
        {...register('title', { required: true })}
        placeholder="Task title"
        className="border px-2 py-1 mr-2"
      />
      <select {...register('status')} className="border px-2 py-1 mr-2">
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select {...register('priority')} className="border px-2 py-1 mr-2">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button
        type="submit"
        disabled={isLoading}
        className="px-3 py-1 bg-yellow-600 text-white rounded"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-3 py-1 ml-2 bg-gray-400 text-white rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default TaskEditForm;