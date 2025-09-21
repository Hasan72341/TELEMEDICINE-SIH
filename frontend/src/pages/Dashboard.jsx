import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, FileText, Sparkles, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [nextAppt, setNextAppt] = useState(null);
  const [summary, setSummary] = useState({ appointments: 0, records: 0 });
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appts, records] = await Promise.all([
          api.get('/appointments/'),
          api.get('/health-records/')
        ]);
        
        const upcoming = appts.data.find(a => a.status === 'scheduled' || a.status === 'pending');
        setNextAppt(upcoming);
        setSummary({ appointments: appts.data.length, records: records.data.length });
        setRecentRecords(records.data.slice(0, 5));
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Health Overview</h1>
        <p className="text-gray-500 font-medium">Welcome back. Here is a summary of your recent activity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Next Appointment</div>
            <div className="text-xl font-bold text-gray-900">
              {nextAppt ? `${nextAppt.date} @ ${nextAppt.time}` : 'No upcoming'}
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Medical Vault</div>
            <div className="text-xl font-bold text-gray-900">{summary.records} Files Stored</div>
          </div>
        </div>

        <Link to="/ai-remedies" className="bg-gray-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between group hover:scale-[1.02] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 relative z-10">
            <Sparkles size={24} />
          </div>
          <div className="relative z-10 text-white">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">AI Assistant</div>
            <div className="text-xl font-bold flex items-center gap-2">Check Symptoms <ChevronRight size={20}/></div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <h2 className="font-bold text-xl text-gray-900 tracking-tight">Recent Records</h2>
           <Link to="/health-records" className="text-sm font-bold text-blue-600 hover:underline">View Vault</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentRecords.map(r => (
            <div key={r.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-xs uppercase tracking-tighter">
                  {r.record_type[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{r.title}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{r.record_type}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {recentRecords.length === 0 && <p className="text-center text-gray-400 py-20 font-medium">Your medical vault is empty.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;