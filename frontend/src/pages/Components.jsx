import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  User, 
  Calendar, 
  FileText, 
  Stethoscope, 
  Plus, 
  Search, 
  Clock, 
  ChevronRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Info,
  Download
} from 'lucide-react';

const getLangText = (obj) => {
  if (!obj) return "";
  if (typeof obj === 'string') return obj;
  const lang = localStorage.getItem('lang') || 'en';
  return obj[lang] || obj['en'] || "";
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState("10:00");
  const [symptoms, setSymptoms] = useState("");
  const [filterSpec, setFilterSpec] = useState("");

  useEffect(() => {
    api.get('/doctors/').then(r => setDoctors(r.data)).catch(console.error);
  }, []);

  const docTypes = ['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Orthopedic', 'Gynecologist', 'Psychiatrist'];

  const filteredDoctors = doctors.filter(d => 
    !filterSpec || getLangText(d.specialization).toLowerCase().includes(filterSpec.toLowerCase())
  );

  const book = () => {
    api.post('/appointments/', {
      doctor_id: selectedDoc.id,
      date: bookingDate,
      time: bookingTime,
      symptoms: symptoms || "General checkup"
    }).then(() => {
      alert('Appointment booked successfully');
      setSelectedDoc(null);
    }).catch(e => alert(e.response?.data?.detail || 'Booking failed'));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Healthcare Specialists</h1>
          <p className="text-gray-500 mt-1 font-medium">Connect with verified doctors for your medical needs.</p>
        </div>
        <div className="flex bg-white p-2 rounded-xl border border-gray-200 shadow-sm items-center gap-3">
          <Search size={16} className="text-gray-400 ml-2" />
          <select 
            className="text-sm font-bold bg-transparent outline-none border-none cursor-pointer pr-4"
            value={filterSpec}
            onChange={(e) => setFilterSpec(e.target.value)}
          >
            <option value="">All Specializations</option>
            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(d => (
          <div key={d.id} className="group bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer flex flex-col" onClick={() => setSelectedDoc(d)}>
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">👨‍⚕️</div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star size={14} fill="currentColor" /> {d.rating || "4.8"}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.reviews || "50+"} Reviews</div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{getLangText(d.name)}</h3>
            <p className="text-blue-600 text-xs font-black uppercase tracking-widest mt-1 mb-4">{getLangText(d.specialization)}</p>
            <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-6 font-medium">{getLangText(d.bio) || "Professional medical consultant dedicated to patient care."}</p>
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Consultation</span>
                <span className="font-bold text-gray-900">₹{d.fees}</span>
              </div>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 group-hover:bg-blue-700 transition-all">Book Now</button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
            <div className="md:w-1/3 bg-slate-50 p-8 border-r border-gray-100 flex flex-col">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-5xl mb-6 mx-auto">👨‍⚕️</div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">{getLangText(selectedDoc.name)}</h2>
              <p className="text-blue-600 font-bold text-xs uppercase tracking-widest text-center mt-1 mb-8">{getLangText(selectedDoc.specialization)}</p>
              
              <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Expertise</h4>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{getLangText(selectedDoc.bio)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Exp.</span>
                    <span className="text-sm font-bold text-gray-700">{getLangText(selectedDoc.experience)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Degree</span>
                    <span className="text-sm font-bold text-gray-700">{getLangText(selectedDoc.qualification)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="mt-8 text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Close Profile</button>
            </div>

            <div className="flex-1 p-10 overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Schedule Appointment</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="bookingDate" className="text-xs font-bold text-gray-400 uppercase ml-2">Preferred Date</label>
                    <input id="bookingDate" type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bookingTime" className="text-xs font-bold text-gray-400 uppercase ml-2">Preferred Time</label>
                    <input id="bookingTime" type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="symptoms" className="text-xs font-bold text-gray-400 uppercase ml-2">Reason for Visit</label>
                  <textarea id="symptoms" placeholder="Describe your health concern..." value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-medium h-32 outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="bg-blue-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl shadow-blue-100">
                  <div>
                    <span className="text-xs opacity-80 font-bold uppercase block mb-1">Consultation Fee</span>
                    <span className="text-3xl font-bold">₹{selectedDoc.fees}</span>
                  </div>
                  <button onClick={book} className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-95">Confirm Booking</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

  if (loading) return <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">Loading your timeline...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Your Appointments</h1>
        <p className="text-gray-500 font-medium">Keep track of your medical sessions and reports.</p>
      </header>

      <div className="space-y-4">
        {appts.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-blue-200 transition-all shadow-sm">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👨‍⚕️</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-gray-900 text-lg">Dr. {getLangText(a.doctor?.name) || "Assigned Specialist"}</h3>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-1 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {a.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500"/> {a.time}</span>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              a.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {a.status}
            </span>
          </div>
        ))}
        {appts.length === 0 && <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase tracking-widest">No history found.</div>}
      </div>
    </div>
  );
};

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Prescription');
  const [desc, setDesc] = useState('');

  const fetchRecords = () => {
    api.get('/health-records/').then(r => {
      setRecords(r.data);
      if (r.data[0] && !selected) setSelected(r.data[0]);
    });
  };

  useEffect(() => fetchRecords(), []);

  const handleUpload = (e) => {
    e.preventDefault();
    api.post('/health-records/', { title, record_type: type, description: desc, file_url: "" }).then(() => {
      setIsUploading(false);
      setTitle('');
      setDesc('');
      fetchRecords();
    });
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-160px)] animate-in fade-in duration-500">
      <div className="w-80 bg-white border border-gray-200 rounded-3xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-900 tracking-tight">Health Vault</h2>
          <button onClick={() => setIsUploading(!isUploading)} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
            {isUploading ? "×" : <Plus size={20}/>}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {records.map(r => (
            <div key={r.id} onClick={() => { setSelected(r); setIsUploading(false); }} className={`p-4 rounded-2xl cursor-pointer transition-all ${selected?.id === r.id && !isUploading ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-gray-50 text-gray-700 font-medium'}`}>
              <div className="font-bold text-sm truncate">{r.title}</div>
              <div className="text-[9px] opacity-70 mt-1 uppercase font-black tracking-widest">{r.record_type} • {new Date(r.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        {isUploading ? (
          <div className="p-12 animate-in slide-in-from-bottom-4 flex flex-col h-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-8">Add Medical Document</h2>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Document Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="e.g. June 2025 Lab Report" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Category</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                  <option>Prescription</option><option>Lab Report</option><option>Vaccination</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Observations / Notes</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none font-medium" placeholder="Additional details..." />
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Save Document</button>
            </form>
          </div>
        ) : selected ? (
          <div className="flex flex-col h-full">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{selected.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-blue-600 font-black uppercase tracking-widest">{selected.record_type}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-400 font-bold">Document ID: #{selected.id}</span>
                </div>
              </div>
              <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                <Download size={20} />
              </button>
            </div>
            <div className="flex-1 bg-slate-50 p-10 overflow-auto flex justify-center">
               <div className="w-full max-w-3xl bg-white shadow-2xl p-16 flex flex-col border border-gray-100 min-h-[800px]">
                  <div className="flex justify-between border-b-4 border-gray-900 pb-8 mb-12">
                    <div className="font-bold text-3xl tracking-tighter">MEDICAL REPORT</div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 text-sm">GRAMIN SWASTHYA</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(selected.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Patient Observations</h4>
                      <p className="text-gray-800 leading-relaxed font-serif text-2xl italic border-l-4 border-blue-600 pl-8">
                        "{selected.description || "No specific clinical notes recorded for this document."}"
                      </p>
                    </div>
                  </div>
                  <div className="mt-20 pt-8 border-t border-gray-50 flex justify-between items-end">
                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-loose">
                      Verification Status: Active<br/>
                      Digital Signature: Confirmed
                    </div>
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border-4 border-double border-gray-100 text-[10px] font-bold text-gray-300 -rotate-12">OFFICIAL</div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-20 text-center">
            <FileText size={80} strokeWidth={1} className="mb-6 opacity-20" />
            <p className="font-black uppercase tracking-widest text-xs">Select a medical file to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AIRemedies = () => {
  const [symptoms, setSymptoms] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRemedy = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/ai/remedy?symptom=${encodeURIComponent(symptoms)}&lang=en`);
      setRes(response.data);
    } catch(e) { alert('AI Health Assistant currently offline'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-blue-600/20 transition-all duration-700"></div>
        
        <header className="mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/30">
            <Sparkles size={14} /> AI Health Assistant
          </div>
          <h2 className="text-5xl font-bold tracking-tight leading-[1.1]">Check symptoms.<br/>Get health advice.</h2>
          <p className="text-slate-400 mt-4 text-lg font-medium">Describe how you feel to get instant medical suggestions.</p>
        </header>

        <div className="space-y-8 relative z-10">
          <textarea 
            id="aiSymptoms"
            className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-xl font-medium placeholder:text-slate-600 focus:bg-white/10 focus:border-blue-500/50 transition-all outline-none h-48 resize-none" 
            placeholder="Describe your symptoms here..."
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
          />
          <div className="flex flex-wrap gap-4">
            <button onClick={getRemedy} disabled={loading || !symptoms.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black tracking-widest shadow-2xl transition-all flex items-center gap-3 active:scale-95">
              {loading ? "ANALYZING..." : "GET SUGGESTIONS"} <ArrowRight size={20}/>
            </button>
            <button onClick={() => navigate('/doctors')} className="text-slate-400 hover:text-white px-6 py-5 font-black text-xs uppercase tracking-[0.2em] transition-all">Talk to a Doctor</button>
          </div>
        </div>
      </div>

      {res && (
        <div className="mt-10 p-12 bg-white rounded-[3rem] border border-gray-200 shadow-xl space-y-10 animate-in slide-in-from-top-8 duration-700">
          <div className="flex justify-between items-center border-b border-gray-50 pb-8">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight italic">Health Suggestion</h3>
            <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full uppercase tracking-widest">{res.language?.name || 'English'}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Recommended Remedy</h4>
              <p className="text-3xl font-bold text-gray-900 leading-tight">{res.remedy}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Detailed Instructions</h4>
              <p className="text-gray-600 leading-relaxed font-medium text-lg">{res.description}</p>
            </div>
          </div>
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start">
            <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-bold uppercase leading-relaxed tracking-tight">Important: This is an AI suggestion for information purposes only. If symptoms are severe or persist, consult a professional doctor immediately.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get('/shop/').then(r => setProducts(r.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Medical Pharmacy</h1>
        <p className="text-gray-500 mt-2 font-medium">Healthcare essentials delivered to your home.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(p => (
          <div key={p.id} className="group bg-white rounded-3xl border border-gray-200 p-6 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 flex flex-col">
            <div className="h-48 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center text-6xl shadow-inner group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0">{p.image || "📦"}</div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{p.name}</h3>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">{p.brand || "GS GENERIC"}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Price</span>
                <span className="font-bold text-emerald-600 text-2xl">₹{p.price}</span>
              </div>
              <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 shadow-xl transition-all active:scale-90"><ShoppingBag size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Doctors, Appointments, HealthRecords, AIRemedies, Shop };