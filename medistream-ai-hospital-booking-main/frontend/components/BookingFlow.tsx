
import React, { useState, useMemo } from 'react';
import { MOCK_DOCTORS, DEPARTMENTS } from '../constants';
import { Doctor, Appointment, UrgencyLevel, SymptomAnalysis, User } from '../types';
interface BookingFlowProps {
  analysis?: SymptomAnalysis | null;
  onBookingComplete: (appointment: Appointment) => void;
  currentUser: User | null;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ 
  analysis,
  onBookingComplete,
  currentUser
}) => {
  const initialDepartment = analysis?.suggestedDepartment || 'General Medicine';
  const initialUrgency = analysis?.urgency;

  const [selectedDept, setSelectedDept] = useState(initialDepartment);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  // Generate the next 7 days for the calendar view
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  }, []);

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter(doc => doc.department === selectedDept);
  }, [selectedDept]);

  const handleBook = () => {
    if (selectedDoctor && selectedSlot && selectedDate) {
      const newAppointment: Appointment = {
        id: `APT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        doctorId: selectedDoctor.id,
        patientName: currentUser?.name || "Patient",
        date: selectedDate,
        time: selectedSlot,
        department: selectedDept,
        status: 'Scheduled',
        urgency: initialUrgency,
        reasoning: analysis?.reasoning,
        userSymptoms: analysis?.userSymptoms
      };
      onBookingComplete(newAppointment);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Select a Specialist</h2>
          <p className="text-slate-500 font-medium">Browse verified doctors in the {selectedDept} department.</p>
        </div>
        {initialUrgency && (
          <div className={`px-5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center shadow-sm ${
            initialUrgency === UrgencyLevel.EMERGENCY ? 'bg-red-50 text-red-600 border-red-100' :
            initialUrgency === UrgencyLevel.PRIORITY ? 'bg-amber-50 text-amber-600 border-amber-100' :
            'bg-green-50 text-green-600 border-green-100'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse mr-2.5"></span>
            Triage Priority: {initialUrgency}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar - Dept Filter */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Select Wing</h3>
            <div className="space-y-2">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDept(dept);
                    setSelectedDoctor(null);
                    setStep(1);
                  }}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    selectedDept === dept 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.05]' 
                      : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id}
                  className={`bg-white p-8 rounded-[2rem] border transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-2 ${
                    selectedDoctor?.id === doctor.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'
                  }`}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setStep(2);
                    // Reset selections when switching doctor
                    setSelectedDate(availableDates[0].full);
                    setSelectedSlot(null);
                  }}
                >
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg border-2 border-white">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-black text-slate-800 mb-1 leading-tight">{doctor.name}</h4>
                      <p className="text-sm text-blue-600 font-bold mb-4">{doctor.specialty}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Rating</p>
                          <p className="text-xs font-black text-slate-700">{doctor.rating}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Experience</p>
                          <p className="text-xs font-black text-slate-700">{doctor.experience}Y</p>
                        </div>
                      </div>

                      <button className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
                        View Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-black text-lg">No specialists found in {selectedDept}.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl animate-in zoom-in duration-300">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 mb-10 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Select Different Specialist
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-slate-100 pb-10">
                <div className="flex items-center space-x-6 mb-8 md:mb-0">
                  <img src={selectedDoctor?.image} className="w-28 h-28 rounded-3xl object-cover shadow-2xl ring-4 ring-white" />
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 leading-tight">{selectedDoctor?.name}</h3>
                    <p className="text-blue-600 font-black uppercase text-xs tracking-widest mt-1">{selectedDoctor?.specialty}</p>
                    <div className="flex items-center mt-3 text-slate-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <p className="text-[10px] font-black uppercase tracking-widest">{selectedDept} Wing, Level 4</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600 px-10 py-6 rounded-3xl text-white text-center shadow-xl shadow-blue-100">
                  <p className="text-[8px] text-blue-200 uppercase font-black tracking-[0.3em] mb-2">Specialist Status</p>
                  <p className="text-2xl font-black">Active Today</p>
                </div>
              </div>

              {/* Date Selection (Calendar View) */}
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Select Date</h4>
              <div className="flex space-x-4 overflow-x-auto pb-6 mb-10 scrollbar-hide no-scrollbar">
                {availableDates.map((dateObj) => (
                  <button
                    key={dateObj.full}
                    onClick={() => {
                      setSelectedDate(dateObj.full);
                      setSelectedSlot(null); // Clear slot when date changes
                    }}
                    className={`flex-shrink-0 w-24 py-4 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                      selectedDate === dateObj.full 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 scale-105' 
                        : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest mb-1">{dateObj.dayName}</span>
                    <span className="text-2xl font-black mb-1">{dateObj.dayNum}</span>
                    <span className="text-[10px] font-bold uppercase">{dateObj.month}</span>
                  </button>
                ))}
              </div>

              {/* Slot Selection */}
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Available Time Slots</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
                {selectedDoctor?.availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-5 rounded-2xl text-xs font-black tracking-widest transition-all border-2 ${
                      selectedSlot === slot 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200 scale-105' 
                        : 'bg-white text-slate-600 border-slate-100 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl mb-10 border border-slate-100 flex items-start">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 mr-6 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tight">Booking Summary</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    You are booking a {initialUrgency || 'Normal'} priority session on <span className="text-blue-600 font-bold">{selectedDate}</span>. Your symptom analysis will be securely transmitted to the specialist.
                  </p>
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={!selectedSlot || !selectedDate}
                className={`w-full py-6 rounded-3xl text-white font-black text-xl uppercase tracking-widest transition-all shadow-2xl ${
                  selectedSlot && selectedDate
                    ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {selectedSlot ? `Confirm Booking • ${selectedSlot}` : 'Select a Slot to Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
