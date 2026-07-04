import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { apiFetch } from "../services/api";
import { User } from "../types";

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onNavigateHome: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onNavigateHome }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodType: "A+",
    weight: "",
    height: ""
  });

  // -------------------------------
  // EMAIL / PASSWORD AUTH
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res =
        mode === "signup"
          ? await apiFetch("/auth/register", {
              method: "POST",
              body: JSON.stringify({
                email: formData.email,
                username: formData.name,
                password: formData.password,
                blood_type: formData.bloodType,
                weight: formData.weight,
                height: formData.height
              })
            })
          : await apiFetch("/auth/login", {
              method: "POST",
              body: JSON.stringify({
                email_or_username: formData.email,
                password: formData.password
              })
            });

      localStorage.setItem("access_token", res.access_token);
      onAuthSuccess(res.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // GOOGLE AUTH
  // -------------------------------
  const handleGoogleLogin = async (cred: any) => {
    try {
      const res = await apiFetch("/auth/google/login", {
        method: "POST",
        body: JSON.stringify({ token: cred.credential })
      });

      localStorage.setItem("access_token", res.access_token);
      onAuthSuccess(res.user);
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-500">

        {/* HEADER */}
        <div className="bg-slate-900 p-10 text-white text-center">
          <h2 className="text-3xl font-black mb-2">
            {mode === "login" ? "Welcome Back" : "Join MediStream"}
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            {mode === "login"
              ? "Access your medical records"
              : "Secure patient registration"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          {/* FULL NAME */}
          {mode === "signup" && (
            <div className="space-y-2">
              <label className="label">Full Name</label>
              <input
                required
                className="input"
                placeholder="John Doe"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          {/* EMAIL + PASSWORD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">Email Address</label>
              <input
                required
                type="email"
                className="input"
                placeholder="name@company.com"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="label">Password</label>
              <input
                required
                type="password"
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* INITIAL HEALTH PROFILE */}
          {mode === "signup" && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">
                Initial Health Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="label">Blood Group</label>
                  <select
                    className="input"
                    value={formData.bloodType}
                    onChange={e =>
                      setFormData({ ...formData, bloodType: e.target.value })
                    }
                  >
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="label">Weight (kg)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="70"
                    value={formData.weight}
                    onChange={e =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="label">Height (cm)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="175"
                    value={formData.height}
                    onChange={e =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            disabled={isLoading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em]"
          >
            {mode === "login" ? "Sign In Securely" : "Create Patient Account"}
          </button>

          {/* GOOGLE */}
          <div className="flex justify-center pt-2">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed")}
            />
          </div>

          {/* MODE SWITCH */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-blue-600 font-black text-xs uppercase tracking-widest"
            >
              {mode === "login" ? "Start Registration" : "Return to Login"}
            </button>
          </div>
        </form>

        <div className="bg-slate-50 px-10 py-6 text-center border-t border-slate-100">
          <button
            onClick={onNavigateHome}
            className="text-[10px] font-black uppercase tracking-widest"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
