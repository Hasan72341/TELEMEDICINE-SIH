import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Activity, Award, Briefcase, IndianRupee } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  
  const [specialization, setSpecialization] = useState('General Physician');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [fees, setFees] = useState('');
  const [bio, setBio] = useState('');
  const [selectedLangs, setSelectedLangs] = useState(['English']);

  const navigate = useNavigate();
  const { login } = useAuth();

  const docTypes = ['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Orthopedic', 'Gynecologist', 'Psychiatrist'];
  const languages = ['English', 'Hindi', 'Punjabi', 'Bengali', 'Tamil', 'Telugu'];

  const toggleLang = (lang) => {
    setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const response = await api.post('/users/login/access-token', formData);
        const user = await login(response.data.access_token);
        if (user.role === 'doctor') navigate('/dashboard');
        else window.location.href = 'http://localhost:3000/dashboard';
      } else {
        await api.post('/users/signup', {
          email, password, full_name: fullName, role: 'doctor',
          doctor_profile: { specialization, qualification, experience, fees, bio, languages: selectedLangs }
        });
        setIsLogin(true);
        setError('Account created. Please log in.');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className={`w-full animate-premium-in transition-all ${!isLogin ? 'max-w-[720px]' : 'max-w-[440px]'}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Activity className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl text-slate-900">Gramin Swasthya</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{isLogin ? 'Doctor Login' : 'Doctor Registration'}</h1>
        </div>

        <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className={`grid gap-5 ${!isLogin ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              <div className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                    <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Dr. Vikram Singh" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                  <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="email" placeholder="doctor@example.com" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                  <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Specialization</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                      {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Experience</label>
                      <input type="text" placeholder="e.g. 5 yrs" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={experience} onChange={(e) => setExperience(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Fee (₹)</label>
                      <input type="number" placeholder="500" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={fees} onChange={(e) => setFees(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Qualification</label>
                    <input type="text" placeholder="MBBS, MD" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <button key={lang} type="button" onClick={() => toggleLang(lang)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedLangs.includes(lang) ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}>{lang}</button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
              {isLogin ? 'Login to Dashboard' : 'Complete Registration'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-center gap-4">
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold text-sm hover:underline">
              {isLogin ? "New doctor? Register here" : "Already a member? Log in"}
            </button>
            <div className="hidden md:block w-px h-4 bg-slate-200"></div>
            <a href="http://localhost:3000" className="text-slate-500 font-bold text-sm hover:text-indigo-600">Patient Portal</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
