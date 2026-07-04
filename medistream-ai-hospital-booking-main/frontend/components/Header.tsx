import React from 'react';
import { View, User } from '../types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  appointmentCount: number;
  isLoggedIn: boolean;
  user: User | null;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  appointmentCount,
  isLoggedIn,
  user,
  onLogin
}) => {

  // ✅ Safe display name logic
  const displayName =
    user?.name?.split(' ')[0] ||
    user?.username?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'User';

  // ✅ Safe avatar fallback
  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${displayName}&background=2563eb&color=fff`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('Home')}
          >
            <div className="bg-blue-600 p-2.5 rounded-2xl mr-3 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">
              MediStream <span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {['Home', 'SymptomChecker', 'Booking', 'Dashboard'].map((view) => (
              <button
                key={view}
                onClick={() => onNavigate(view as View)}
                className={`${
                  currentView === view
                    ? 'text-blue-600 font-black'
                    : 'text-slate-500 hover:text-slate-800 font-bold'
                } transition-all text-[11px] uppercase tracking-[0.2em]`}
              >
                {view === 'SymptomChecker'
                  ? 'Triage'
                  : view === 'Booking'
                  ? 'Clinics'
                  : view === 'Dashboard'
                  ? 'Calendar'
                  : view}
              </button>
            ))}

            {appointmentCount > 0 && (
              <span className="bg-red-500 text-white text-[9px] h-4 w-4 flex items-center justify-center rounded-full font-black animate-pulse">
                {appointmentCount}
              </span>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-6">
            {isLoggedIn && user ? (
              <div
                onClick={() => onNavigate('Profile')}
                className={`flex items-center space-x-3 cursor-pointer group p-1.5 pr-4 rounded-2xl transition-all border-2 ${
                  currentView === 'Profile'
                    ? 'bg-blue-50 border-blue-100'
                    : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Patient
                  </p>
                  <p className="text-xs font-black text-slate-800 leading-none">
                    {displayName}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
