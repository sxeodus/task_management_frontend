import { useForm } from 'react-hook-form';
import useTaskStore from '../../store/taskStore';
import { useState } from 'react';

const ProjectForm = () => {
  const { addProject, isLoading } = useTaskStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [formError, setFormError] = useState('');

  const onSubmit = async (data) => {
    setFormError('');
    if (!data.startDate || !data.endDate) {
      setFormError('Please fill both start date and end date.');
      return;
    }
    await addProject(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-wrap gap-2 items-center">
      <input
        {...register('name', { required: true })}
        placeholder="Project name"
        className="border px-2 py-1 rounded"
      />
      <input
        {...register('description')}
        placeholder="Description"
        className="border px-2 py-1 rounded"
      />
      <select {...register('priority')} className="border px-2 py-1 rounded">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select {...register('status')} className="border px-2 py-1 rounded">
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
        <option value="on_hold">On Hold</option>
      </select>
      <input
        {...register('color')}
        type="color"
        className="border px-2 py-1 rounded w-12 h-8"
      />
      <input
        {...register('startDate', { required: true })}
        type="date"
        className="border px-2 py-1 rounded"
      />
      <input
        {...register('endDate', { required: true })}
        type="date"
        className="border px-2 py-1 rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Add Project
      </button>
      {formError && (
        <span className="text-red-500 ml-2">{formError}</span>
      )}
    </form>
  );
};

export default ProjectForm;