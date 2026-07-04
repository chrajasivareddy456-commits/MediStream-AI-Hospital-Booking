
import React, { useState, useEffect } from 'react';
import { Appointment, UrgencyLevel, View } from '../types';
import { MOCK_DOCTORS } from '../constants';

interface DashboardProps {
  appointments: Appointment[];
  onCancel: (id: string) => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, onCancel, onReschedule, onNavigate }) => {
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleSlot, setRescheduleSlot] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'success' | 'info' | 'error' }>({ message: '', visible: false });
  
  // Custom cancellation modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [apptToCancelId, setApptToCancelId] = useState<string | null>(null);

  // Reminder state
  const [activeReminderMenu, setActiveReminderMenu] = useState<string | null>(null);

  const activeAppointments = appointments.filter(a => a.status === 'Scheduled');
  const pastAppointments = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  const getDoctor = (id: string) => MOCK_DOCTORS.find(d => d.id === id);
  const selectedAppt = appointments.find(a => a.id === selectedApptId);
  const selectedDoc = selectedAppt ? getDoctor(selectedAppt.doctorId) : null;

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedApptId(null);
        setIsRescheduling(false);
        setIsCancelModalOpen(false);
        setActiveReminderMenu(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleOpenCancelModal = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setApptToCancelId(id);
    setIsCancelModalOpen(true);
  };

  const confirmCancelSlot = () => {
    if (apptToCancelId) {
      onCancel(apptToCancelId);
      setIsCancelModalOpen(false);
      setApptToCancelId(null);
      setSelectedApptId(null); // Close detail modal if it was open
      showToast('Appointment is cancelled. The specialist slot has been released.', 'info');
    }
  };

  const handleSetReminder = async (apptId: string, timeLabel: string) => {
    setActiveReminderMenu(null);
    
    if (!("Notification" in window)) {
      showToast("Browser notifications are not supported on this device.", "error");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      showToast(`Reminder set for ${timeLabel} before your appointment.`, "success");
      
      new Notification("MediStream AI", {
        body: `Reminder successfully scheduled for ${timeLabel} prior to your session with ${getDoctor(appointments.find(a => a.id === apptId)?.doctorId || '')?.name}.`,
        icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      });
    } else {
      showToast("Notification permission denied. Please enable them in your browser settings.", "error");
    }
  };
const downloadReceipt = (appt: Appointment) => {
  const receipt = `
MediStream AI Hospital

Patient: ${appt.patientName}
Department: ${appt.department}
Date: ${appt.date}
Time: ${appt.time}
Urgency: ${appt.urgency}
Status: ${appt.status}

Thank you for using MediStream AI.
`;

  const blob = new Blob([receipt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `appointment-${appt.id}.txt`;
  a.click();
};
  const getUrgencyBadge = (level?: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.EMERGENCY: return 'bg-red-50 text-red-600 border-red-100';
      case UrgencyLevel.PRIORITY: return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-green-50 text-green-600 border-green-100';
    }
  };

  const handleConfirmReschedule = () => {
    if (selectedApptId && rescheduleSlot) {
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      onReschedule(selectedApptId, today, rescheduleSlot);
      setIsRescheduling(false);
      setRescheduleSlot(null);
      setSelectedApptId(null);
      showToast('Your session has been successfully rescheduled.', 'success');
    }
  };

  const AppointmentCard = ({ appt, isPast }: { appt: Appointment, isPast?: boolean }) => {
    const doc = getDoctor(appt.doctorId);
    const isReminderMenuOpen = activeReminderMenu === appt.id;
    
    return (
      <div 
        key={appt.id} 
        onClick={() => {
          setSelectedApptId(appt.id);
          setIsRescheduling(false);
          setActiveReminderMenu(null);
        }}
        className={`group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-3xl transition-all duration-500 cursor-pointer hover:scale-[1.02] relative ${isPast ? 'opacity-70 grayscale-[30%]' : ''}`}
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl border uppercase tracking-[0.2em] ${isPast ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                {appt.department}
              </span>
              {appt.urgency && !isPast && (
                <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl border uppercase tracking-[0.2em] ${getUrgencyBadge(appt.urgency)}`}>
                  {appt.urgency}
                </span>
              )}
              {isPast && (
                <span className={`px-4 py-1.5 text-[10px] font-black rounded-xl border uppercase tracking-[0.2em] ${appt.status === 'Cancelled' ? 'bg-red-50 text-red-400 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {appt.status}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-300 font-black bg-slate-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">{appt.id}</span>
          </div>
          
          <div className="flex items-start space-x-8 mb-6 border-b border-slate-50 pb-6">
            <img 
              src={doc?.image} 
              alt="Doctor" 
              className="w-24 h-24 rounded-3xl object-cover shadow-2xl ring-4 ring-white" 
            />
            <div className="flex-1">
              <h4 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{doc?.name || 'Medical Specialist'}</h4>
              <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4">{doc?.specialty || appt.department}</p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center text-slate-700 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-xs font-black uppercase tracking-tight">{appt.date}</span>
                </div>
                <div className="flex items-center text-slate-700 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-xs font-black uppercase tracking-tight">{appt.time}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center relative">
            <div className="flex items-center space-x-6">
              {!isPast ? (
                <>
                  <button 
                    onClick={(e) => handleOpenCancelModal(appt.id, e)}
                    className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
                  >
                    Cancel Slot
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReminderMenu(isReminderMenuOpen ? null : appt.id);
                      }}
                      className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isReminderMenuOpen ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span>Set Reminder</span>
                    </button>
                    
                    {isReminderMenuOpen && (
                      <div className="absolute bottom-full mb-3 left-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 w-48 z-50 animate-in slide-in-from-bottom-2 duration-200">
                        {['15 mins before', '1 hour before', '24 hours before'].map((label) => (
                          <button
                            key={label}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetReminder(appt.id, label);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[10px] font-black text-slate-700 uppercase tracking-widest transition-colors"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Booking Finalized</span>
              )}
            </div>
            
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedApptId(appt.id);
          }}
          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
        >
          Details →
        </button>
          </div>
        </div>
        <div className={`${isPast ? 'bg-slate-200' : 'bg-slate-900'} px-10 py-5 flex justify-between items-center text-white`}>
          <span className="flex items-center text-[9px] font-black uppercase tracking-[0.3em]">
            <span className={`w-2 h-2 rounded-full mr-3 ${isPast ? 'bg-slate-400 shadow-none' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'}`}></span>
            {isPast ? (appt.status === 'Cancelled' ? 'Record Stored' : 'Session Completed') : 'Verified Booking'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadReceipt(appt);
            }}
          >
            Digital Receipt →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500 relative">

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md animate-in slide-in-from-top-4 duration-500">
          <div className={`mx-4 text-white p-5 rounded-2xl shadow-2xl flex items-center border ${
            toast.type === 'error' ? 'bg-red-600 border-red-500' : 
            toast.type === 'info' ? 'bg-slate-800 border-slate-700' : 
            'bg-blue-600 border-blue-500'
          }`}>
            <div className="bg-white/20 p-2 rounded-lg mr-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {toast.type === 'error' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
            </div>
            <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
              {toast.message}
            </p>
          </div>
        </div>
      )}

      {/* Custom Cancellation Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            onClick={() => setIsCancelModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-red-50/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Cancel Appointment?</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Are you sure you want to cancel this slot? This will release the specialist for other patients and this action is <span className="text-red-600 font-black">permanent</span>.
            </p>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={confirmCancelSlot}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
              >
                Yes, Cancel Appointment Slot
              </button>
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-95"
              >
                No, Keep My Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tight">Active Appointments</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage your sessions and review AI triage records.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-200 shadow-sm flex items-center">
            <div className="relative flex h-3 w-3 mr-4">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </div>
            <span className="text-sm font-black text-slate-700 tracking-tight uppercase">{activeAppointments.length} Active Bookings</span>
          </div>
          <button 
            onClick={() => onNavigate('SymptomChecker')}
            className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-widest"
          >
            New Checkup
          </button>
        </div>
      </div>

      {activeAppointments.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200 shadow-inner mb-20">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">No active appointments</h3>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium leading-relaxed italic">"The greatest wealth is health. Take the first step today."</p>
          <button 
            onClick={() => onNavigate('SymptomChecker')}
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200"
          >
            Start AI Diagnosis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
          {activeAppointments.map(appt => (
            <AppointmentCard key={appt.id} appt={appt} />
          ))}
        </div>
      )}

      {/* Past Appointments History */}
      {pastAppointments.length > 0 && (
        <div className="animate-in slide-in-from-bottom-8 duration-1000">
          <div className="border-t border-slate-100 pt-16 mb-12">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-1.5 h-10 bg-slate-300 rounded-full"></div>
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Past Medical History</h2>
                <p className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-widest">Archived consultation records & cancelled slots</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {pastAppointments.map(appt => (
              <AppointmentCard key={appt.id} appt={appt} isPast />
            ))}
          </div>
        </div>
      )}

      {/* DETAILED MODAL OVERLAY */}
      {selectedApptId && selectedAppt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => {
              setSelectedApptId(null);
              setIsRescheduling(false);
            }}
          ></div>
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-10 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-1 text-[10px] font-black rounded-xl uppercase tracking-widest ${selectedAppt.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                  {isRescheduling ? 'Reschedule Session' : `${selectedAppt.status} Summary`}
                </span>
                <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">ID: {selectedAppt.id}</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedApptId(null);
                  setIsRescheduling(false);
                }}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Col: Doctor Full Profile */}
                <div className="lg:col-span-1 border-r border-slate-50 pr-0 lg:pr-10">
                  <div className="text-center">
                    <img 
                      src={selectedDoc?.image} 
                      className="w-40 h-40 rounded-[2.5rem] object-cover mx-auto mb-6 shadow-2xl ring-8 ring-slate-50" 
                      alt="Doctor"
                    />
                    <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2">{selectedDoc?.name}</h3>
                    <p className="text-blue-600 font-black uppercase text-xs tracking-[0.2em] mb-6">{selectedDoc?.specialty}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Rating</p>
                        <p className="text-lg font-black text-slate-800">{selectedDoc?.rating}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Experience</p>
                        <p className="text-lg font-black text-slate-800">{selectedDoc?.experience}Y</p>
                      </div>
                    </div>

                    <div className="text-left space-y-4">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-50 pb-2">Professional Profile</p>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {selectedDoc?.name} is a board-certified specialist with extensive experience in {selectedDoc?.department}. Known for a patient-centered approach and integrating advanced diagnostic techniques.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Col: Appointment & AI Details or Rescheduling */}
                <div className="lg:col-span-2 space-y-10">
                  {isRescheduling ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
                        <h5 className="text-xl font-black text-slate-800 tracking-tight">Select a New Time</h5>
                      </div>
                      <p className="text-sm text-slate-500 mb-6 font-medium">Available slots for today with {selectedDoc?.name}:</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                        {selectedDoc?.availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setRescheduleSlot(slot)}
                            className={`py-4 rounded-2xl text-xs font-black tracking-widest transition-all border-2 ${
                              rescheduleSlot === slot 
                                ? 'bg-amber-500 text-white border-amber-500 shadow-xl shadow-amber-100 scale-105' 
                                : 'bg-white text-slate-600 border-slate-100 hover:border-amber-300 hover:bg-amber-50'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsRescheduling(false)}
                          className="flex-1 py-5 bg-slate-100 text-slate-700 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleConfirmReschedule}
                          disabled={!rescheduleSlot}
                          className={`flex-1 py-5 rounded-3xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${
                            rescheduleSlot 
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100' 
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Confirm Reschedule
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Schedule Card */}
                      <div className={`${selectedAppt.status === 'Scheduled' ? 'bg-blue-600 shadow-blue-100' : 'bg-slate-500 shadow-slate-100'} rounded-[2rem] p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors`}>
                        <div className="flex items-center space-x-6">
                          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                          <div>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Scheduled Date</p>
                            <h4 className="text-2xl font-black">{selectedAppt.date}</h4>
                            <p className="text-white/80 font-bold tracking-widest">{selectedAppt.time}</p>
                          </div>
                        </div>
                        <div className="px-6 py-2 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                          {selectedAppt.status}
                        </div>
                      </div>

                      {/* AI Triage Section */}
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                          <h5 className="text-xl font-black text-slate-800 tracking-tight">AI Diagnostic Summary</h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Triage Priority</p>
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-widest inline-block ${getUrgencyBadge(selectedAppt.urgency)}`}>
                              {selectedAppt.urgency}
                            </span>
                          </div>
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Target Wing</p>
                            <p className="text-lg font-black text-slate-800 uppercase tracking-tight">{selectedAppt.department}</p>
                          </div>
                        </div>

                        <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100">
                          <p className="text-[10px] text-blue-600 uppercase font-black tracking-[0.2em] mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            AI's Reasoning
                          </p>
                          <p className="text-blue-900 font-bold leading-relaxed italic text-sm">
                            "{selectedAppt.reasoning || "Triage successfully completed based on symptom severity and physiological indicators reported."}"
                          </p>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-4">User Symptoms</p>
                          <p className="text-slate-700 font-medium leading-relaxed text-sm">
                            {selectedAppt.userSymptoms || "No symptoms text stored for this record."}
                          </p>
                        </div>
                      </div>

                      {/* Modal Actions - Only show if active */}
                      {selectedAppt.status === 'Scheduled' ? (
                        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <button 
                            onClick={() => setIsRescheduling(true)}
                            className="py-5 bg-slate-100 text-slate-700 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all border-2 border-transparent hover:border-slate-300"
                          >
                            Reschedule
                          </button>
                          
                          <div className="relative group">
                            <button 
                              className="w-full py-5 bg-blue-50 text-blue-600 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all border-2 border-blue-100"
                            >
                              Set Reminder
                            </button>
                            <div className="absolute bottom-full left-0 right-0 mb-3 hidden group-hover:block animate-in fade-in slide-in-from-bottom-2">
                               <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 flex flex-col">
                                  {['15m', '1h', '24h'].map(t => (
                                    <button 
                                      key={t}
                                      onClick={() => handleSetReminder(selectedAppt.id, t)}
                                      className="px-4 py-2 hover:bg-blue-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 text-left"
                                    >
                                      {t} Before
                                    </button>
                                  ))}
                               </div>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleOpenCancelModal(selectedAppt.id)}
                            className="py-5 bg-red-50 text-red-600 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all border-2 border-red-100 shadow-xl shadow-red-50"
                          >
                            Cancel Slot
                          </button>
                        </div>
                      ) : (
                        <div className="pt-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-200 text-center">
                          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">This record is finalized and cannot be modified.</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  <p className="text-center text-[10px] text-slate-300 font-black uppercase tracking-widest mt-10">
                    Consultation is protected by hospital data privacy protocols
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
