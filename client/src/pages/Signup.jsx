import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { RiEyeLine, RiEyeOffLine, RiLockLine, RiMailLine, RiUser3Line, RiArrowRightLine } from 'react-icons/ri';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields are required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await authAPI.signup(form);
      login({ _id: data._id, name: data.name, email: data.email }, data.token);
      toast.success(`Account created! Welcome, ${data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: '📋', title: 'Plan Tasks', desc: 'Organize your prep schedule' },
    { icon: '🏢', title: 'Track Interviews', desc: 'Log rounds & feedback' },
    { icon: '🤖', title: 'Get AI Tips', desc: 'Personalized suggestions' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #f5f3ff 100%)' }}>

      {/* ── Left: Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="blob w-60 h-60 bg-blue-200 top-0 left-0 opacity-40" />
        <div className="blob w-40 h-40 bg-sky-200 bottom-10 left-10 opacity-30" />

        <div className="w-full max-w-md relative z-10 animate-slide-up">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
              <span className="text-white font-black text-2xl">T</span>
            </div>
          </div>

          <div className="card-glass">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-800">Start your journey 🚀</h2>
              <p className="text-slate-400 text-sm mt-1">Create your free account — takes 30 seconds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <RiUser3Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
                  <input id="signup-name" type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="John Doe"
                    className="input pl-10" autoComplete="name" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="label">Email address</label>
                <div className="relative">
                  <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
                  <input id="signup-email" type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com"
                    className="input pl-10" autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-lg" />
                  <input id="signup-password" type={showPwd ? 'text' : 'password'} name="password"
                    value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                    className="input pl-10 pr-10" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                    {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>

                {/* Password strength indicator */}
                <div className="flex gap-1 mt-2">
                  {[1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      form.password.length === 0 ? 'bg-slate-100'
                      : form.password.length < 6 && i === 1 ? 'bg-red-300'
                      : form.password.length >= 6 && i <= 2 ? 'bg-amber-300'
                      : form.password.length >= 10 ? 'bg-emerald-400'
                      : 'bg-slate-100'
                    }`} />
                  ))}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {form.password.length === 0 ? 'Enter a password' : form.password.length < 6 ? 'Too short' : form.password.length < 10 ? 'Good' : 'Strong!'}
                </p>
              </div>

              <button id="signup-submit" type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Free Account <RiArrowRightLine />
                  </span>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 hover:text-brand-600 font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-300 mt-6">
            Free forever · No credit card required 💙
          </p>
        </div>
      </div>

      {/* ── Right decorative panel ── */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="blob w-80 h-80 bg-indigo-200 bottom-[-60px] right-[-60px]" />
        <div className="blob w-60 h-60 bg-blue-200 top-[-40px] right-10" />

        <div className="relative z-10 max-w-sm animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 animate-float"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 12px 32px rgba(59,130,246,0.35)' }}>
            <span className="text-white font-black text-2xl">T</span>
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-3 leading-tight">
            Everything you need<br /><span className="gradient-text">to crack interviews.</span>
          </h2>
          <p className="text-slate-400 mb-10 text-base leading-relaxed">
            Join students who use TrackMyPrep to stay organized and prepared.
          </p>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-white/80 animate-slide-in"
                style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{s.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
