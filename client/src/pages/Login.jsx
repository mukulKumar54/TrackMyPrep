import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { RiEyeLine, RiEyeOffLine, RiLockLine, RiMailLine, RiArrowRightLine } from 'react-icons/ri';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields are required');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login({ _id: data._id, name: data.name, email: data.email }, data.token);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #f5f3ff 100%)' }}>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16">

        {/* Blobs */}
        <div className="blob w-80 h-80 bg-blue-300 top-[-80px] left-[-60px]" />
        <div className="blob w-64 h-64 bg-indigo-200 bottom-[-40px] right-[-40px]" />
        <div className="blob w-48 h-48 bg-sky-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 text-center max-w-md animate-slide-up">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 animate-float"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 16px 40px rgba(59,130,246,0.35)' }}>
            <span className="text-white font-black text-3xl">T</span>
          </div>

          <h1 className="text-4xl font-black text-slate-800 mb-4 leading-tight">
            Your Prep,<br />
            <span className="gradient-text">Perfectly Tracked.</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-10">
            Organize tasks, track interview rounds, and get AI-powered tips to land your dream job.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {['📋 Task Planner', '🏢 Interview Tracker', '🤖 AI Coach', '📊 Progress Dashboard'].map(f => (
              <span key={f} className="px-4 py-2 rounded-full text-sm font-medium text-blue-700 border border-blue-200"
                style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">

        {/* Subtle top-right blob */}
        <div className="blob w-56 h-56 bg-lavender-200 top-0 right-0 opacity-50" />

        <div className="w-full max-w-md relative z-10 animate-slide-up">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
              <span className="text-white font-black text-2xl">T</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">TrackMyPrep</h2>
          </div>

          {/* Card */}
          <div className="card-glass">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-800">Welcome back 👋</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in to continue your prep journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
                  <input id="login-email" type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com"
                    className="input pl-10" autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
                  <input id="login-password" type={showPwd ? 'text' : 'password'} name="password"
                    value={form.password} onChange={handleChange} placeholder="••••••••"
                    className="input pl-10 pr-10" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                    {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button id="login-submit" type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <RiArrowRightLine />
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <p className="text-center text-sm text-slate-400">
              New to TrackMyPrep?{' '}
              <Link to="/signup" className="text-brand-500 hover:text-brand-600 font-semibold transition-colors">
                Create a free account →
              </Link>
            </p>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-slate-300 mt-6">
            Crafted for students who prepare with purpose 🎯
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
