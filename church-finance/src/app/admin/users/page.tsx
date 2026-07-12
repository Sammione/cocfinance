"use client";
import React from "react";

const users = [
  { name: "Brother Segun", email: "segun@church.org", role: "Finance Officer", status: "Active" },
  { name: "Sister Mercy", email: "mercy@church.org", role: "Treasurer", status: "Active" },
  { name: "Brother Samuel", email: "samuel@church.org", role: "Church Leader / Elder", status: "Active" },
  { name: "Sister Grace", email: "grace@church.org", role: "Secretary", status: "Active" },
  { name: "Brother Femi", email: "femi@church.org", role: "Auditor", status: "Active" },
  { name: "Admin", email: "admin@church.org", role: "Super Admin", status: "Active" },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-purple-100 text-purple-800",
  "Treasurer": "bg-blue-100 text-blue-800",
  "Finance Officer": "bg-emerald-100 text-emerald-800",
  "Church Leader / Elder": "bg-amber-100 text-amber-800",
  "Auditor": "bg-slate-100 text-slate-800",
  "Secretary": "bg-pink-100 text-pink-800",
  "Member": "bg-sky-100 text-sky-800",
};

export default function UsersPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">User Management</h1>
          <p className="text-slate-500 text-sm">Manage users and assign roles.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors self-start">Invite User</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">All Users ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold hidden md:table-cell">Email</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u,i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{u.name[0]}</div>
                      <span className="font-medium text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 hidden md:table-cell">{u.email}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || "bg-slate-100 text-slate-800"}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">{u.status}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-xs font-medium">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
