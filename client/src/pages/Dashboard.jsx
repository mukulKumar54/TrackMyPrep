import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI, interviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  RiTaskLine, RiCheckboxCircleLine, RiTimeLine,
  RiBuildingLine, RiArrowRightLine, RiCalendarLine,
  RiTrophyLine, RiFireLine
} from 'react-icons/ri';

const statCards = [
  { key: 'total',     label: 'Total Tasks',         icon: RiTaskLine,            bg: 'from-blue-50 to-sky-50',     border: 'border-blue-100',   icon_bg: 'bg-blue-100',    icon_color: 'text-blue-600' },
  { key: 'completed', label: 'Completed',            icon: RiCheckboxCircleLine,  bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', icon_bg: 'bg-emerald-100', icon_color: 'text-emerald-600' },
  { key: 'progress',  label: 'In Progress',          icon: RiTimeLine,            bg: 'from-indigo-50 to-violet-50',border: 'border-indigo-100', icon_bg: 'bg-indigo-100',  icon_color: 'text-indigo-600' },
  { key: 'interviews',label: 'Interviews Tracked',   icon: RiBuildingLine,        bg: 'from-violet-50 to-purple-50',border: 'border-violet-100', icon_bg: 'bg-violet-100',  icon_color: 'text-violet-600' },
];

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 shadow-card text-sm">
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="font-semibold text-slate-700">{payload[0].value} tasks</p>
    </div>
  );
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tasksAPI.getAll(), interviewsAPI.getAll()])
      .then(([t, i]) => { setTasks(t.data); setInterviews(i.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total      = tasks.length;
  const completed  = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending    = tasks.filter(t => t.status === 'pending').length;
  const rate       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.toDateString() };
  });
  const barData = last7.map(({ day, date }) => ({
    day,
    tasks: tasks.filter(t => new Date(t.createdAt).toDateString() === date).length,
  }));

  const pieData = [
    { name: 'Completed',   value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Pending',     value: pending },
  ].filter(d => d.value > 0);

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const statValues = { total, completed, progress: inProgress, interviews: interviews.length };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-brand-200 border-t-brand-500 animate-spin" style={{ borderWidth: 3 }} />
        <p className="text-sm text-slate-400">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">

      {/* ── Header ── */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {rate > 0
              ? `You've completed ${rate}% of your tasks. Keep it up!`
              : 'Start adding tasks to track your progress.'}
          </p>
        </div>
        {rate >= 50 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
            <RiTrophyLine /> {rate}% Done — Great job!
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      {total > 0 && (
        <div className="card mb-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5"><RiFireLine className="text-orange-400" /> Overall Progress</span>
            <span className="text-sm font-bold text-brand-600">{rate}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${rate}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />
          </div>
          <div className="flex justify-between text-xs text-slate-300 mt-1.5">
            <span>0 tasks</span><span>{completed}/{total} complete</span>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ key, label, icon: Icon, bg, border, icon_bg, icon_color }) => (
          <div key={key} className={`rounded-2xl p-5 bg-gradient-to-br ${bg} border ${border} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card`}>
            <div className={`w-10 h-10 rounded-xl ${icon_bg} flex items-center justify-center mb-3`}>
              <Icon className={`text-xl ${icon_color}`} />
            </div>
            <p className="text-2xl font-black text-slate-800">{statValues[key]}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Bar chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
            <RiCalendarLine className="text-brand-400" /> Tasks Added — Last 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={barData} barSize={28}>
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)', radius: 6 }} />
              <Bar dataKey="tasks" radius={[8, 8, 0, 0]}
                fill="url(#barGrad)" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Task Status</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={4} strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={7} formatter={v => <span style={{ color: '#64748b', fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-44 text-slate-300">
              <RiTaskLine className="text-4xl mb-2" />
              <p className="text-sm">No tasks yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Tasks ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-slate-700">Recent Tasks</h2>
          <Link to="/tasks" className="text-xs text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1 transition-colors">
            View all <RiArrowRightLine />
          </Link>
        </div>
        {recentTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-300">
            <RiTaskLine className="text-4xl mx-auto mb-2" />
            <p className="text-sm font-medium">No tasks yet</p>
            <Link to="/tasks" className="text-brand-400 hover:underline text-xs mt-1 inline-block">Add your first task →</Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentTasks.map(task => (
              <div key={task._id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all duration-200">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold text-slate-700 truncate ${task.status === 'completed' ? 'line-through text-slate-300' : ''}`}>
                    {task.title}
                  </p>
                  {task.deadline && (
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <RiCalendarLine className="text-xs" /> Due {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  {task.status === 'completed' && <span className="badge-completed">Done</span>}
                  {task.status === 'in-progress' && <span className="badge-in-progress">In Progress</span>}
                  {task.status === 'pending' && <span className="badge-pending">Pending</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
