
import React, { useState } from 'react';
import { User, Appointment, View } from '../types';
import { MOCK_DOCTORS } from '../constants';

interface UserProfileProps {
  user: User;
  appointments: Appointment[];
  onNavigate: (view: View) => void;
  onUpdateUser: (updatedUser: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, appointments, onNavigate, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    bloodType: user.bloodType,
    weight: user.weight.replace(' kg', ''),
    height: user.height.replace(' cm', ''),
  });

  const pastAppointments = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');
  const getDoctor = (id: string) => MOCK_DOCTORS.find(d => d.id === id);

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      name: editForm.name,
      bloodType: editForm.bloodType,
      weight: `${editForm.weight} kg`,
      height: `${editForm.height} cm`,
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const NavTile = ({ title, icon, color, view, desc }: { title: string, icon: React.ReactNode, color: string, view: View, desc: string }) => (
    <button 
      onClick={() => onNavigate(view)}
      className={`group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-200 text-left transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95`}
    >
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-100 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-900 mb-2">{title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
      <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform">
        Explore Section →
      </div>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      
      {/* QUICK DASHBOARD LINKS */}
      <div className="flex flex-wrap items-center gap-4 mb-10 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] border border-white shadow-xl sticky top-24 z-40">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mr-2">Quick Nav:</span>
        <button 
          onClick={() => onNavigate('Home')}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <span>Home</span>
        </button>
        <button 
          onClick={() => onNavigate('Dashboard')}
          className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path></svg>
          <span>My Appointments</span>
        </button>
        <button 
          onClick={() => onNavigate('SymptomChecker')}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          <span>AI Triage</span>
        </button>
        <button 
          onClick={() => onNavigate('Booking')}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          <span>Browse Clinics</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>
        <div className="flex-1 text-right pr-4 hidden lg:block">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Profile</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm mb-12">
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        </div>
        <div className="px-12 pb-12 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8 text-center md:text-left">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-44 h-44 rounded-[2.5rem] border-[8px] border-white shadow-2xl object-cover" 
              />
              <div className="pb-4 w-full md:w-auto">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 border border-blue-100">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                  <span>Registered Patient</span>
                </div>
                {isEditing ? (
                  <input 
                    className="text-4xl font-black text-slate-900 tracking-tight mb-1 bg-slate-50 border-b-2 border-blue-600 outline-none w-full max-w-md px-2"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                ) : (
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{user.name}</h2>
                )}
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">{user.email} • ID: {user.id}</p>
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 active:scale-95"
                >
                  Edit Profile
                </button>
              )}
              <button 
                onClick={() => {
                   sessionStorage.removeItem('hospital_session_token');
                   window.location.reload(); 
                }}
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all border border-red-100"
                title="Sign Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6-10V7a3 3 0 00-6 0v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION OPTIONS */}
      <div className="mb-16">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 px-2">Global Navigation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NavTile 
            title="AI Triage Analysis" 
            view="SymptomChecker" 
            color="bg-blue-600 text-white" 
            desc="Analyze new symptoms and get specialist department routing."
            icon={<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>}
          />
          <NavTile 
            title="My Appointments" 
            view="Dashboard" 
            color="bg-indigo-600 text-white" 
            desc="View your upcoming sessions, history, and medical receipts."
            icon={<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          />
          <NavTile 
            title="Browse Clinics" 
            view="Booking" 
            color="bg-emerald-600 text-white" 
            desc="Directly browse hospital wings and book available specialists."
            icon={<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
          />
        </div>
      </div>

      {/* Vital Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { 
            label: 'Blood Group', 
            value: user.bloodType, 
            icon: 'M4.5 12.75l6 6 9-13.5', 
            color: 'text-red-600', 
            bg: 'bg-red-50',
            editable: true,
            type: 'select',
            options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            field: 'bloodType'
          },
          { 
            label: 'Weight', 
            value: user.weight, 
            icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33', 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            editable: true,
            type: 'number',
            field: 'weight',
            suffix: ' kg'
          },
          { 
            label: 'Height', 
            value: user.height, 
            icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.008v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.008v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            editable: true,
            type: 'number',
            field: 'height',
            suffix: ' cm'
          },
          { 
            label: 'Last Checkup', 
            value: user.lastCheckup, 
            icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', 
            color: 'text-amber-600', 
            bg: 'bg-amber-50',
            editable: false
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
              </svg>
            </div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            {isEditing && stat.editable ? (
              stat.type === 'select' ? (
                <select 
                  className="text-lg font-black text-slate-800 bg-slate-50 border-b border-blue-600 outline-none w-full"
                  value={editForm[stat.field as keyof typeof editForm]}
                  onChange={e => setEditForm({...editForm, [stat.field!]: e.target.value})}
                >
                  {stat.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <div className="flex items-center">
                  <input 
                    type="number"
                    className="text-lg font-black text-slate-800 bg-slate-50 border-b border-blue-600 outline-none w-full"
                    value={editForm[stat.field as keyof typeof editForm]}
                    onChange={e => setEditForm({...editForm, [stat.field!]: e.target.value})}
                  />
                  <span className="ml-1 text-xs font-black text-slate-400">{stat.suffix}</span>
                </div>
              )
            ) : (
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* History Section */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-8">
          <div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Clinical History</h3>
            <p className="text-slate-400 font-medium text-sm mt-1">Review your journey with MediStream specialists.</p>
          </div>
          <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Download Records (PDF)</button>
        </div>

        {pastAppointments.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
            <p className="text-slate-400 font-black text-lg">No medical records found in your archive.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {pastAppointments.map(appt => {
              const doc = getDoctor(appt.doctorId);
              return (
                <div key={appt.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between mb-8">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${appt.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {appt.status}
                    </span>
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{appt.date}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <img src={doc?.image} className="w-16 h-16 rounded-2xl object-cover grayscale" />
                    <div>
                      <h4 className="text-xl font-black text-slate-800">{doc?.name}</h4>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{appt.department}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
