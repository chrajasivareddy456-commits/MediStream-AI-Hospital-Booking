import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SymptomChecker from './components/SymptomChecker';
import BookingFlow from './components/BookingFlow';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import Auth from './components/Auth';
import AdminDashboard from "./components/AdminDashboard";
import { View, SymptomAnalysis, Appointment, User } from './types';
import { apiFetch } from "./services/api";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Home');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
const loadAppointments = async () => {
  try {
    const data = await apiFetch("/appointments/my");
    setAppointments(data);
  } catch (e) {
    console.error("Failed to load appointments", e);
  }
};

loadAppointments();

  const token = localStorage.getItem("access_token");
  if (!token) return;

  fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    })
    .then(user => {
      setIsLoggedIn(true);
      setCurrentUser(user);

      if (user.role === "admin") {
        setCurrentView("AdminDashboard");
      } else {
        setCurrentView("Dashboard");
      }
    })
    .catch(() => {
      localStorage.removeItem("access_token");
      setIsLoggedIn(false);
      setCurrentUser(null);
    });
}, []);


  // ✅ Normalize backend user
const handleAuthSuccess = (backendUser: any) => {
  const normalizedUser: User = {
    id: backendUser.id,
    name: backendUser.username || backendUser.name || "Patient",
    email: backendUser.email,
    role: backendUser.role,   // ⭐ IMPORTANT
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      backendUser.username || backendUser.email
    )}&background=2563eb&color=fff`,
    bloodType: "Not Set",
    weight: "",
    height: "",
    memberSince: new Date().toLocaleDateString(),
    lastCheckup: "No record yet"
  };

  setIsLoggedIn(true);
  setCurrentUser(normalizedUser);

  // ⭐ ROLE BASED ROUTING
  if (backendUser.role === "admin") {
    setCurrentView("AdminDashboard");
  } else {
    setCurrentView("Dashboard");
  }
};

  // ✅ Proper Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("access_token");
    setCurrentView("Home");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

const handleBookingComplete = async (appointment: Appointment) => {
  await apiFetch("/appointments", {
    method: "POST",
    body: JSON.stringify(appointment),
  });

  const updated = [appointment, ...appointments];
  setAppointments(updated);

  setCurrentView("Dashboard");
  setActiveAnalysis(null);
};

  const handleCancelAppointment = (id: string) => {
    const updated = appointments.map(appt =>
      appt.id === id ? { ...appt, status: 'Cancelled' as const } : appt
    );
    setAppointments(updated);
    localStorage.setItem('hospital_appointments', JSON.stringify(updated));
  };

  const handleReschedule = (id: string, newDate: string, newTime: string) => {
    const updated = appointments.map(appt =>
      appt.id === id ? { ...appt, date: newDate, time: newTime, status: 'Scheduled' as const } : appt
    );
    setAppointments(updated);
    localStorage.setItem('hospital_appointments', JSON.stringify(updated));
  };

  const handleTriageComplete = (analysis: SymptomAnalysis) => {
    setActiveAnalysis(analysis);
    setCurrentView('Booking');
  };

  const renderView = () => {
    switch (currentView) {
      case 'Home':
  return (
    <div className="animate-in fade-in duration-1000">
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 blur-3xl pointer-events-none">
          <div className="aspect-[1/1] bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
                <span>Next-Gen Medical Infrastructure</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] drop-shadow-sm">
                Smart Care, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Real Impact.
                </span>
              </h1>

              <p className="text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                Navigate your health journey with AI triage, instant routing, and the world's finest specialists at your fingertips.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <button 
                  onClick={() => setCurrentView('SymptomChecker')}
                  className="group px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[13px] hover:bg-blue-700 shadow-[0_20px_50px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98] flex items-center justify-center uppercase tracking-widest"
                >
                  Start AI Triage
                </button>

                {isLoggedIn ? (
                  <button 
                    onClick={() => setCurrentView('Dashboard')}
                    className="px-8 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[13px] hover:bg-indigo-700 transition-all shadow-lg uppercase tracking-widest"
                  >
                    My Appointments
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentView('Booking')}
                    className="px-8 py-5 bg-white text-slate-800 border-2 border-slate-100 rounded-[1.5rem] font-black text-[13px] hover:bg-slate-50 transition-all shadow-lg uppercase tracking-widest"
                  >
                    Browse Clinics
                  </button>
                )}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-50 p-4 transform rotate-3 hover:rotate-0 transition-all duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                  alt="Medical Interface" 
                  className="rounded-[2.5rem] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

      case 'Auth':
        return (
          <Auth
            onAuthSuccess={handleAuthSuccess}
            onNavigateHome={() => setCurrentView('Home')}
          />
        );
      case 'SymptomChecker':
        return <SymptomChecker onRecommendation={handleTriageComplete} />;
      case 'Booking':
        return isLoggedIn ? (
        <BookingFlow
          analysis={activeAnalysis}
          onBookingComplete={handleBookingComplete}
          currentUser={currentUser}
        />

        ) : (
          <Auth
            onAuthSuccess={handleAuthSuccess}
            onNavigateHome={() => setCurrentView('Home')}
          />
        );

      case 'Dashboard':
        return (
          <Dashboard
            appointments={appointments}
            onCancel={handleCancelAppointment}
            onReschedule={handleReschedule}
            onNavigate={setCurrentView}
          />
        );
      case 'Profile':
        return currentUser ? (
          <UserProfile
            user={currentUser}
            appointments={appointments}
            onNavigate={setCurrentView}
            onUpdateUser={handleUpdateUser}
          />
        ) : null;
        case "AdminDashboard":
  return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        appointmentCount={appointments.filter(a => a.status === 'Scheduled').length}
        isLoggedIn={isLoggedIn}
        user={currentUser}
        onLogin={() => setCurrentView('Auth')}
      />

      <main className="flex-grow">{renderView()}</main>

      <footer className="bg-white border-t border-slate-200 py-10 text-center">
        <span className="text-xl font-bold">
          MediStream <span className="text-blue-600">AI</span>
        </span>
        {isLoggedIn && (
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              Logout
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
