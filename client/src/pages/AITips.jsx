import { useState } from 'react';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  RiRobot2Line, RiSendPlane2Line, RiLightbulbLine,
  RiBookOpenLine, RiBarChartLine, RiUserStarLine, RiSparklingLine
} from 'react-icons/ri';

const PREP_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const SuggestionSection = ({ icon: Icon, title, items, theme }) => {
  const themes = {
    yellow: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', iconBg: 'bg-amber-100', iconText: 'text-amber-600', dot: 'bg-amber-400' },
    red: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', iconBg: 'bg-rose-100', iconText: 'text-rose-600', dot: 'bg-rose-400' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', iconBg: 'bg-blue-100', iconText: 'text-blue-600', dot: 'bg-blue-400' },
    green: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', dot: 'bg-emerald-400' },
  };
  const t = themes[theme] || themes.blue;

  return (
    <div className={`p-5 rounded-2xl border ${t.bg} ${t.border} shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.iconBg} ${t.iconText}`}>
          <Icon className="text-lg" />
        </div>
        <h3 className={`text-sm font-bold ${t.text}`}>{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className={`flex items-start gap-2.5 text-sm ${t.text} opacity-90 leading-relaxed`}>
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${t.dot} flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AITips = () => {
  const [form, setForm] = useState({
    resumeText: '',
    weakTopics: '',
    prepLevel: 'Intermediate',
    feedback: '',
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resumeText && !form.weakTopics) {
      return toast.error('Please fill in at least your resume summary or weak topics');
    }
    setLoading(true);
    setSuggestions(null);
    try {
      const { data } = await aiAPI.getSuggestions(form);
      setSuggestions(data);
      toast.success('AI suggestions generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI service failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
            <RiRobot2Line className="text-brand-600 text-lg" />
          </div>
          <h1 className="page-title mb-0">AI Prep Coach</h1>
        </div>
        <p className="page-subtitle ml-11">
          Share your context and get personalized interview prep suggestions powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card border-brand-100 bg-white shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <RiSparklingLine className="text-brand-500" /> Your Context
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Resume Summary / Skills</label>
              <textarea
                name="resumeText"
                value={form.resumeText}
                onChange={set}
                rows={4}
                placeholder="Paste your resume summary or list your key skills, projects, and experience..."
                className="input resize-none bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-brand-500"
              />
            </div>
            <div>
              <label className="label">Weak Topics / Areas to Improve</label>
              <input
                name="weakTopics"
                value={form.weakTopics}
                onChange={set}
                placeholder="e.g. Dynamic Programming, System Design, SQL joins"
                className="input bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-brand-500"
              />
            </div>
            <div>
              <label className="label">Current Preparation Level</label>
              <div className="flex gap-2">
                {PREP_LEVELS.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, prepLevel: level }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      form.prepLevel === level
                        ? 'bg-brand-50 text-brand-700 border-brand-200 shadow-sm'
                        : 'bg-white text-gray-500 border-gray-200 hover:text-brand-600 hover:border-brand-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Interview Feedback (optional)</label>
              <textarea
                name="feedback"
                value={form.feedback}
                onChange={set}
                rows={3}
                placeholder="Any feedback from past interviews or self-assessment..."
                className="input resize-none bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-brand-500"
              />
            </div>

            <button
              id="ai-generate-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-brand-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating suggestions...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RiSendPlane2Line /> Generate AI Tips
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Suggestions Output */}
        <div className="space-y-4">
          {!suggestions && !loading && (
            <div className="card border-brand-100 bg-white shadow-sm flex flex-col items-center justify-center text-center py-16 text-gray-500 h-full min-h-64">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                <RiRobot2Line className="text-4xl text-gray-300" />
              </div>
              <p className="font-medium text-gray-600">AI suggestions will appear here</p>
              <p className="text-sm mt-1 text-gray-400">Fill in your context and click Generate</p>
            </div>
          )}

          {loading && (
            <div className="card border-brand-100 bg-white shadow-sm flex flex-col items-center justify-center text-center py-16 h-full min-h-64">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-brand-100 rounded-full" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-brand-700 font-bold">Analyzing your profile...</p>
              <p className="text-brand-600/70 text-sm mt-1 font-medium">This may take a few seconds</p>
            </div>
          )}

          {suggestions && (
            <div className="space-y-4 animate-slide-up">
              <SuggestionSection
                icon={RiLightbulbLine}
                title="Resume Improvement Tips"
                items={suggestions.resumeTips || []}
                theme="yellow"
              />
              <SuggestionSection
                icon={RiBarChartLine}
                title="Skill Gaps to Address"
                items={suggestions.skillGaps || []}
                theme="red"
              />
              <SuggestionSection
                icon={RiBookOpenLine}
                title="What to Study Next"
                items={suggestions.studyPlan || []}
                theme="blue"
              />
              <SuggestionSection
                icon={RiUserStarLine}
                title="Personalized Suggestions"
                items={suggestions.personalSuggestions || []}
                theme="green"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITips;

