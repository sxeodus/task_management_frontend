import { useEffect, useState } from 'react';
import TaskEditForm from './TaskEditForm';
import useTaskStore from '../../store/taskStore';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react'; // Or use any icon library

const SortableTaskItem = ({ task, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </li>
  );
};

const TaskList = () => {
  const { tasks, fetchTasks, isLoading, error, deleteTask, projects } = useTaskStore();
  const [editingTask, setEditingTask] = useState(null);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [taskOrder, setTaskOrder] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setTaskOrder(filteredTasks.map(task => task.id));
  }, [tasks, filterProjectId]);

  const filteredTasks = filterProjectId
    ? tasks.filter(task => task.projectId === filterProjectId)
    : tasks;

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = taskOrder.indexOf(active.id);
      const newIndex = taskOrder.indexOf(over.id);
      const newOrder = arrayMove(taskOrder, oldIndex, newIndex);
      setTaskOrder(newOrder);
      // Optionally, update order in backend here
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <select
        value={filterProjectId}
        onChange={e => setFilterProjectId(e.target.value)}
        className="border px-2 py-1 rounded mb-2"
      >
        <option value="">All Projects</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      {projects.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          No projects yet. Start by adding a new project!
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center py-4">
          <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={taskOrder}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {taskOrder.map(taskId => {
              const task = filteredTasks.find(t => t.id === taskId);
              if (!task) return null;
              return (
                <SortableTaskItem key={task.id} task={task}>
                  <div className="mb-4 p-4 bg-white rounded shadow border flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center gap-2">
                      <span className="cursor-grab text-gray-400 mr-2">&#x2630;</span>
                      <span>
                        <strong>{task.title}</strong> - {task.status} | {task.priority}
                        <br />
                        <span className="text-sm text-gray-600">{task.description}</span>
                        {task.dueDate && (
                          <span className="ml-2 text-xs text-gray-500">Due: {task.dueDate}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                    {editingTask && editingTask.id === task.id && (
                      <TaskEditForm task={editingTask} onClose={() => setEditingTask(null)} />
                    )}
                  </div>
                </SortableTaskItem>
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskList;