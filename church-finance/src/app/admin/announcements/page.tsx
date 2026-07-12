"use client";
import React, { useState } from "react";

const sampleAnnouncements = [
  { id: 1, title: "Monthly Financial Report - June 2026", content: "The June 2026 financial report has been approved and is now available for viewing in the Member Portal.", published: true, date: "01 Jul 2026" },
  { id: 2, title: "Church Building Fund Update", content: "We are pleased to announce that the Church Building Fund has reached ₦2.5 million. Thank you for your generous contributions.", published: true, date: "15 Jun 2026" },
  { id: 3, title: "Pledge Reminder", content: "Members with outstanding pledges are kindly reminded to fulfill them before the end of the quarter.", published: false, date: "10 Jun 2026" },
];

export default function AnnouncementsPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Announcements</h1>
          <p className="text-slate-500 text-sm">Manage announcements for church members.</p>
        </div>
        <button onClick={()=>setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors self-start">New Announcement</button>
      </div>

      <div className="space-y-4">
        {sampleAnnouncements.map(a => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">{a.title}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${a.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{a.published ? "Published" : "Draft"}</span>
              </div>
              <span className="text-xs text-slate-400">{a.date}</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{a.content}</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
              {!a.published && <button className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">Publish</button>}
              <button className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">New Announcement</h3>
              <button onClick={()=>setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Title</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Content</label><textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" rows={4}></textarea></div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={()=>setShowAddModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={()=>{alert("Will save to Supabase");setShowAddModal(false);}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save as Draft</button>
              <button onClick={()=>{alert("Will save and publish to Supabase");setShowAddModal(false);}} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
