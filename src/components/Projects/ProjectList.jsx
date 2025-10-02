import { useEffect, useState } from 'react';
import ProjectEditForm from './ProjectEditForm';
import useTaskStore from '../../store/taskStore';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SortableProjectItem = ({ project, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });
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

const getProjectDueStatus = (endDate) => {
  if (!endDate) return null;
  const today = new Date();
  const end = new Date(endDate);
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'reminder';
  if (diffDays === 0) return 'due';
  return null;
};

const ProjectList = () => {
  const { projects, fetchProjects, isLoading, error, deleteProject } = useTaskStore();
  const [editingProject, setEditingProject] = useState(null);
  const [projectOrder, setProjectOrder] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    setProjectOrder(projects.map(project => project.id));
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = projectOrder.indexOf(active.id);
      const newIndex = projectOrder.indexOf(over.id);
      const newOrder = arrayMove(projectOrder, oldIndex, newIndex);
      setProjectOrder(newOrder);
      // Optionally, update order in backend here
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Projects</h2>
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
          items={projectOrder}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {projectOrder.map(projectId => {
              const project = projects.find(p => p.id === projectId);
              if (!project) return null;
              const dueStatus = getProjectDueStatus(project.endDate);
              return (
                <SortableProjectItem key={project.id} project={project}>
                  <div className="mb-4 p-4 bg-white rounded shadow border flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className="cursor-grab text-gray-400 mr-2">
                          <GripVertical size={18} />
                        </span>
                        <span>
                          <strong>{project.name}</strong> - {project.status}
                          <br />
                          <span className="text-sm text-gray-600">{project.description}</span>
                          {project.startDate && (
                            <span className="ml-2 text-xs text-gray-500">Start: {project.startDate}</span>
                          )}
                          {project.endDate && (
                            <span className="ml-2 text-xs text-gray-500">End: {project.endDate}</span>
                          )}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => setEditingProject(project)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {/* Reminder Alert */}
                    {dueStatus === 'reminder' && (
                      <div className="mt-2 text-yellow-700 bg-yellow-100 px-3 py-2 rounded text-sm font-semibold">
                        Reminder: This project ends tomorrow!
                      </div>
                    )}
                    {dueStatus === 'due' && (
                      <div className="mt-2 text-red-700 bg-red-100 px-3 py-2 rounded text-sm font-semibold">
                        Alert: This project ends today!
                      </div>
                    )}
                    {editingProject && editingProject.id === project.id && (
                      <ProjectEditForm project={editingProject} onClose={() => setEditingProject(null)} />
                    )}
                  </div>
                </SortableProjectItem>
              );
            })}
            {projects.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No projects yet. Start by adding a new project!
              </div>
            )}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ProjectList;