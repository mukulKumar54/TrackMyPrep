import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  RiAddLine, RiEditLine, RiDeleteBinLine, RiCheckLine,
  RiTimeLine, RiCalendarLine, RiSearchLine, RiFilterLine
} from 'react-icons/ri';

const STATUS_OPTIONS = ['pending', 'in-progress', 'completed'];

const EMPTY_FORM = { title: '', description: '', deadline: '', status: 'pending' };

const TaskForm = ({ initial = EMPTY_FORM, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <label className="label">Task Title *</label>
        <input name="title" value={form.title} onChange={set} placeholder="e.g. Revise DSA" className="input" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" value={form.description} onChange={set}
          placeholder="Add details about this task..." rows={3}
          className="input resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Deadline</label>
          <input name="deadline" type="date" value={form.deadline} onChange={set} className="input" />
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={set} className="input">
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s} className="bg-dark-800">{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <RiCheckLine />}
          {loading ? 'Saving...' : 'Save Task'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

  return (
    <div className="card-hover group animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-white text-sm truncate ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-brand-900/40 text-gray-400 hover:text-brand-400 transition-colors">
            <RiEditLine className="text-sm" />
          </button>
          <button onClick={() => onDelete(task._id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors">
            <RiDeleteBinLine className="text-sm" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {task.status === 'completed' && <span className="badge-completed"><RiCheckLine />Completed</span>}
          {task.status === 'in-progress' && <span className="badge-in-progress"><RiTimeLine />In Progress</span>}
          {task.status === 'pending' && <span className="badge-pending">Pending</span>}
          {task.deadline && (
            <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
              <RiCalendarLine />{new Date(task.deadline).toLocaleDateString()}
              {isOverdue && ' · Overdue'}
            </span>
          )}
        </div>
        {/* Quick status cycle */}
        {task.status !== 'completed' && (
          <button
            onClick={() => onStatusChange(task._id, task.status === 'pending' ? 'in-progress' : 'completed')}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            {task.status === 'pending' ? 'Start →' : 'Complete →'}
          </button>
        )}
      </div>
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      const { data } = await tasksAPI.getAll();
      setTasks(data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (form) => {
    if (!form.title.trim()) return toast.error('Title is required');
    setFormLoading(true);
    try {
      const { data } = await tasksAPI.create(form);
      setTasks(prev => [data, ...prev]);
      setShowForm(false);
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally { setFormLoading(false); }
  };

  const handleUpdate = async (form) => {
    if (!form.title.trim()) return toast.error('Title is required');
    setFormLoading(true);
    try {
      const { data } = await tasksAPI.update(editingTask._id, form);
      setTasks(prev => prev.map(t => t._id === data._id ? data : t));
      setEditingTask(null);
      toast.success('Task updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.remove(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await tasksAPI.update(id, { status });
      setTasks(prev => prev.map(t => t._id === id ? data : t));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = tasks
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="page-wrapper">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Task Planner</h1>
          <p className="page-subtitle">{tasks.length} tasks · {counts.completed} completed</p>
        </div>
        <button id="add-task-btn" onClick={() => { setShowForm(true); setEditingTask(null); }} className="btn-primary">
          <RiAddLine /> Add Task
        </button>
      </div>

      {/* Add Form */}
      {showForm && !editingTask && (
        <div className="card mb-6 border-brand-500/30 animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4">New Task</h2>
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..." className="input pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                filter === key
                  ? 'bg-brand-600/20 text-brand-400 border-brand-500/40'
                  : 'text-gray-400 border-gray-700/50 hover:text-white hover:border-gray-600'
              }`}>
              <RiFilterLine className="inline mr-1" />
              {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">
          <RiFilterLine className="text-4xl mx-auto mb-3 opacity-30" />
          <p className="font-medium">No tasks found</p>
          <p className="text-sm mt-1">
            {search ? 'Try a different search term' : 'Add your first task above'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(task => (
            editingTask?._id === task._id ? (
              <div key={task._id} className="card border-brand-500/30 col-span-full animate-slide-up">
                <h2 className="text-sm font-semibold text-white mb-4">Edit Task</h2>
                <TaskForm
                  initial={{
                    title: task.title,
                    description: task.description,
                    deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
                    status: task.status,
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingTask(null)}
                  loading={formLoading}
                />
              </div>
            ) : (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
