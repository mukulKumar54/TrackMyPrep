import { useState, useEffect } from 'react';
import { interviewsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  RiAddLine, RiEditLine, RiDeleteBinLine, RiCheckLine,
  RiBuildingLine, RiArrowDownSLine, RiArrowUpSLine, RiCalendarLine
} from 'react-icons/ri';

const EMPTY_FORM = {
  companyName: '', roundName: '', topicsAsked: '',
  questionsPracticed: '', personalNotes: '', feedback: '', date: '',
};

const InterviewForm = ({ initial = EMPTY_FORM, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initial);
  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma-separated strings to arrays
    onSubmit({
      ...form,
      topicsAsked: form.topicsAsked ? form.topicsAsked.split(',').map(s => s.trim()).filter(Boolean) : [],
      questionsPracticed: form.questionsPracticed ? form.questionsPracticed.split(',').map(s => s.trim()).filter(Boolean) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Company Name *</label>
          <input name="companyName" value={form.companyName} onChange={set}
            placeholder="e.g. Google" className="input" required />
        </div>
        <div>
          <label className="label">Round Name</label>
          <input name="roundName" value={form.roundName} onChange={set}
            placeholder="e.g. Technical Round 1" className="input" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Topics Asked <span className="text-gray-600 normal-case">(comma-separated)</span></label>
          <input name="topicsAsked" value={form.topicsAsked} onChange={set}
            placeholder="Arrays, DP, Graphs" className="input" />
        </div>
        <div>
          <label className="label">Questions Practiced <span className="text-gray-600 normal-case">(comma-separated)</span></label>
          <input name="questionsPracticed" value={form.questionsPracticed} onChange={set}
            placeholder="Two Sum, LRU Cache" className="input" />
        </div>
      </div>
      <div>
        <label className="label">Personal Notes</label>
        <textarea name="personalNotes" value={form.personalNotes} onChange={set}
          rows={2} placeholder="What went well, what didn't..." className="input resize-none" />
      </div>
      <div>
        <label className="label">Feedback Received</label>
        <textarea name="feedback" value={form.feedback} onChange={set}
          rows={2} placeholder="Feedback from interviewer or self-evaluation..." className="input resize-none" />
      </div>
      <div>
        <label className="label">Interview Date</label>
        <input name="date" type="date" value={form.date} onChange={set} className="input" />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <RiCheckLine />}
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

const InterviewCard = ({ entry, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card-hover animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-900/40 flex items-center justify-center flex-shrink-0">
            <RiBuildingLine className="text-purple-400 text-lg" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{entry.companyName}</h3>
            {entry.roundName && <p className="text-xs text-gray-400 mt-0.5">{entry.roundName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {entry.date && (
            <span className="text-xs text-gray-500 flex items-center gap-1 mr-2">
              <RiCalendarLine />{new Date(entry.date).toLocaleDateString()}
            </span>
          )}
          <button onClick={() => onEdit(entry)} className="p-1.5 rounded-lg hover:bg-brand-900/40 text-gray-400 hover:text-brand-400 transition-colors">
            <RiEditLine className="text-sm" />
          </button>
          <button onClick={() => onDelete(entry._id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors">
            <RiDeleteBinLine className="text-sm" />
          </button>
        </div>
      </div>

      {/* Topics preview */}
      {entry.topicsAsked?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.topicsAsked.slice(0, 4).map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-brand-900/40 text-brand-400 border border-brand-800/50">
              {t}
            </span>
          ))}
          {entry.topicsAsked.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-xs text-gray-500">+{entry.topicsAsked.length - 4} more</span>
          )}
        </div>
      )}

      {/* Expand toggle */}
      <button onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors w-full">
        {expanded ? <><RiArrowUpSLine /> Hide details</> : <><RiArrowDownSLine /> Show details</>}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-gray-700/50 pt-3 animate-fade-in">
          {entry.questionsPracticed?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Questions Practiced</p>
              <div className="flex flex-wrap gap-1.5">
                {entry.questionsPracticed.map((q, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-blue-900/30 text-blue-400 border border-blue-800/40">{q}</span>
                ))}
              </div>
            </div>
          )}
          {entry.personalNotes && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Personal Notes</p>
              <p className="text-xs text-gray-300 leading-relaxed">{entry.personalNotes}</p>
            </div>
          )}
          {entry.feedback && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Feedback</p>
              <p className="text-xs text-gray-300 leading-relaxed">{entry.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Tracker = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const fetchEntries = async () => {
    try {
      const { data } = await interviewsAPI.getAll();
      setEntries(data);
    } catch { toast.error('Failed to load interview entries'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await interviewsAPI.create(form);
      setEntries(prev => [data, ...prev]);
      setShowForm(false);
      toast.success('Interview entry added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save entry');
    } finally { setFormLoading(false); }
  };

  const handleUpdate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await interviewsAPI.update(editingEntry._id, form);
      setEntries(prev => prev.map(e => e._id === data._id ? data : e));
      setEditingEntry(null);
      toast.success('Entry updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update entry');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview entry?')) return;
    try {
      await interviewsAPI.remove(id);
      setEntries(prev => prev.filter(e => e._id !== id));
      toast.success('Entry deleted');
    } catch { toast.error('Failed to delete entry'); }
  };

  // Unique companies count
  const companies = [...new Set(entries.map(e => e.companyName))].length;

  return (
    <div className="page-wrapper">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Interview Tracker</h1>
          <p className="page-subtitle">{entries.length} entries · {companies} companies tracked</p>
        </div>
        <button id="add-interview-btn" onClick={() => { setShowForm(true); setEditingEntry(null); }} className="btn-primary">
          <RiAddLine /> Add Entry
        </button>
      </div>

      {/* Add Form */}
      {showForm && !editingEntry && (
        <div className="card mb-6 border-purple-500/30 animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4">New Interview Entry</h2>
          <InterviewForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">
          <RiBuildingLine className="text-4xl mx-auto mb-3 opacity-30" />
          <p className="font-medium">No interview entries yet</p>
          <p className="text-sm mt-1">Track your interview rounds, topics, and feedback</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map(entry => (
            editingEntry?._id === entry._id ? (
              <div key={entry._id} className="card border-purple-500/30 col-span-full animate-slide-up">
                <h2 className="text-sm font-semibold text-white mb-4">Edit Entry</h2>
                <InterviewForm
                  initial={{
                    companyName: entry.companyName,
                    roundName: entry.roundName,
                    topicsAsked: entry.topicsAsked?.join(', ') || '',
                    questionsPracticed: entry.questionsPracticed?.join(', ') || '',
                    personalNotes: entry.personalNotes || '',
                    feedback: entry.feedback || '',
                    date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : '',
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingEntry(null)}
                  loading={formLoading}
                />
              </div>
            ) : (
              <InterviewCard
                key={entry._id}
                entry={entry}
                onEdit={setEditingEntry}
                onDelete={handleDelete}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Tracker;
