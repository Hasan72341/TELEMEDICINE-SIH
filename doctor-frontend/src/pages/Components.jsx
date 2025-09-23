import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  Calendar, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Search,
  FileText,
  Stethoscope
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ today: 0, patients: 0 });

  useEffect(() => {
    api.get('/appointments/').then(r => {
      setStats({
        today: r.data.length,
        patients: new Set(r.data.map(a => a.patient_id)).size
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Practice Dashboard</h1>
        <p className="text-slate-500 font-medium">Overview of your appointments and patient activity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Appointments</div>
            <div className="text-5xl font-bold text-slate-900 tracking-tighter">{stats.today}</div>
          </div>
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Calendar size={32} />
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Unique Patients</div>
            <div className="text-5xl font-bold text-slate-900 tracking-tighter">{stats.patients}</div>
          </div>
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Users size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Stethoscope size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Expert Medical Service</h3>
          <p className="text-slate-500 text-sm font-medium">Helping patients across rural India with high-quality digital consultations.</p>
        </div>
      </div>
    </div>
  );
};

const Appointments = () => {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments/').then(r => {
      setAppts(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = (id, status) => {
    api.put(`/appointments/${id}`, { status }).then(() => {
      setAppts(appts.map(a => a.id === id ? { ...a, status } : a));
    }).catch(alert);
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Loading records...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
        <p className="text-sm font-medium text-slate-500">Manage patient consultation requests.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Name</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Concern</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {appts.map(a => (
              <tr key={a.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="p-6">
                  <div className="font-bold text-slate-800 text-lg">{a.patient?.full_name || 'Patient'}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">ID: #{a.patient_id}</div>
                </td>
                <td className="p-6">
                  <div className="text-sm font-bold text-slate-700">{a.time}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{a.date}</div>
                </td>
                <td className="p-6 max-w-xs">
                  <div className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed group-hover:bg-white transition-colors">
                    "{a.symptoms || 'Regular checkup'}"
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                    a.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    a.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  {(a.status === 'pending' || a.status === 'scheduled') ? (
                    <div className="flex justify-end gap-3">
                      <button onClick={() => updateStatus(a.id, 'completed')} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95">Accept</button>
                      <button onClick={() => updateStatus(a.id, 'cancelled')} className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 px-6 py-2 rounded-xl text-xs font-bold transition-all active:scale-95">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                      <CheckCircle2 size={14} /> Completed
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appts.length === 0 && <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">No active requests</div>}
      </div>
    </div>
  );
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/appointments/').then(r => {
      const uniquePatients = [];
      const seen = new Set();
      r.data.forEach(a => {
        if (a.patient && !seen.has(a.patient_id)) {
          seen.add(a.patient_id);
          uniquePatients.push(a.patient);
        }
      });
      setPatients(uniquePatients);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex gap-10 h-[calc(100vh-160px)] animate-in fade-in duration-500">
      <div className="w-80 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 tracking-tight">Patient Directory</h2>
          <Users size={18} className="text-slate-400" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {patients.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} className={`p-5 rounded-2xl cursor-pointer transition-all border ${selected?.id === p.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-transparent hover:bg-slate-50 text-slate-600 font-medium'}`}>
              <div className="font-bold text-lg leading-tight mb-1">{p.full_name}</div>
              <div className="text-[10px] font-bold opacity-60 tracking-widest uppercase">{p.email}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-2xl p-16 flex flex-col relative overflow-hidden group">
        {selected ? (
          <div className="space-y-12 animate-in fade-in">
             <header className="flex items-center gap-10 border-b pb-12">
               <div className="w-32 h-32 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-bold shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50">
                 {selected.full_name[0]}
               </div>
               <div>
                 <h2 className="text-5xl font-bold text-slate-900 tracking-tighter mb-2">{selected.full_name}</h2>
                 <div className="flex items-center gap-4">
                   <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{selected.email}</span>
                   <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                   <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">User ID: #{selected.id}</span>
                 </div>
               </div>
             </header>
             <p className="text-slate-500 font-medium text-lg leading-relaxed">Access full clinical records and uploaded reports via the <Link to="/health-records" className="text-indigo-600 font-bold underline underline-offset-4">Medical Files</Link> section.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 p-20 text-center">
            <Users size={100} strokeWidth={1} className="mb-6 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-sm">Select a patient to view profile</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HealthRecordsReview = () => {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/health-records/').then(r => {
      setRecords(r.data);
      if (r.data[0]) setSelected(r.data[0]);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex gap-10 h-[calc(100vh-160px)] animate-in slide-in-from-bottom-4 duration-500">
      <div className="w-96 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-8 border-b bg-gray-50/50">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Medical Files</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patient uploaded records</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {records.map(r => (
            <div key={r.id} onClick={() => setSelected(r)} className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${selected?.id === r.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-transparent hover:bg-slate-50 text-slate-600 font-medium'}`}>
              <div className="font-bold text-sm truncate uppercase tracking-tight mb-2">{r.title}</div>
              <div className="flex justify-between items-center opacity-60 text-[9px] font-bold uppercase tracking-widest">
                <span>{r.patient?.full_name}</span>
                <span>{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col relative group">
        {selected ? (
          <div className="flex flex-col h-full">
            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
               <div>
                 <h2 className="text-2xl font-bold tracking-tight italic">{selected.title}</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patient: {selected.patient?.full_name} | ID: #{selected.patient_id}</p>
               </div>
            </div>
            
            <div className="flex-1 bg-slate-50 p-12 overflow-auto flex justify-center">
               <div className="w-full max-w-3xl bg-white shadow-2xl p-20 flex flex-col border border-slate-100 min-h-[900px]">
                  <div className="flex justify-between border-b-4 border-slate-900 pb-10 mb-16 uppercase tracking-tighter">
                    <div className="font-bold text-3xl italic">GS Report</div>
                    <div className="text-right text-[10px] font-bold text-slate-400 leading-loose uppercase">
                      Logged: {new Date(selected.created_at).toLocaleString()}<br/>
                      System: Gramin Swasthya
                    </div>
                  </div>
                  <div className="flex-1 space-y-12">
                    <section>
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Patient Observations</h4>
                      <p className="text-slate-800 font-serif text-3xl leading-relaxed italic p-10 bg-slate-50 border-l-8 border-slate-900 rounded-r-[2rem]">
                        "{selected.description || 'No additional clinical data recorded.'}"
                      </p>
                    </section>
                  </div>
                  <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-end opacity-20 grayscale">
                    <div className="text-[9px] font-bold uppercase tracking-widest leading-loose">Digitally Signed By GS Network</div>
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[10px] uppercase -rotate-12 border-4 border-double border-white shadow-inner">Official</div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
            <FileText size={100} strokeWidth={1} className="mb-6 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-xs">Select a record to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { Dashboard, Appointments, Patients, HealthRecordsReview };
