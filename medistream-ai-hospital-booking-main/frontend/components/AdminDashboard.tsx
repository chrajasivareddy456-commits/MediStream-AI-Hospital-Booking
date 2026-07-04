import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  const loadAppointments = async () => {
    try {
      const data = await apiFetch("/admin/appointments");

      const priority: any = { Emergency: 3, Priority: 2, Normal: 1 };

      data.sort((a: any, b: any) => priority[b.urgency] - priority[a.urgency]);

      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  useEffect(() => {
    loadAppointments();

    // refresh queue every 5 seconds
    const interval = setInterval(loadAppointments, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-black mb-6">Admin Console</h1>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Active Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-slate-500">No active appointments</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                    <p className="font-bold">{appt.patientName}</p>

                    <p className="text-sm text-slate-500">
                    Department: {appt.department}
                    </p>

                    <p className="text-sm text-slate-500">
                    {appt.date} • {appt.time}
                    </p>

                    {appt.userSymptoms && (
                    <p className="text-sm text-slate-600 mt-2">
                        Symptoms: {appt.userSymptoms}
                    </p>
                    )}

                    {appt.reasoning && (
                    <p className="text-xs text-slate-400 mt-1 italic">
                        AI reasoning: {appt.reasoning}
                    </p>
                )}
                </div>

                <div className="text-right">
                    <p
                    className={`font-bold ${
                        appt.urgency === "Emergency"
                        ? "text-red-600"
                        : appt.urgency === "Priority"
                        ? "text-orange-500"
                        : "text-blue-600"
                    }`}
                    >
                    {appt.urgency || "Normal"}
                    </p>
                  <p className="text-xs text-slate-400">{appt.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;