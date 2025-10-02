import { useForm } from 'react-hook-form';
import useTaskStore from '../../store/taskStore';

const ProjectEditForm = ({ project, onClose }) => {
  const { updateProject, isLoading } = useTaskStore();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: project
  });

  const onSubmit = async (data) => {
    await updateProject(project.id, data);
    reset();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <input
        {...register('name', { required: true })}
        placeholder="Project name"
        className="border px-2 py-1 mr-2"
      />
      <select {...register('status')} className="border px-2 py-1 mr-2">
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
        <option value="on_hold">On Hold</option>
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

export default ProjectEditForm;