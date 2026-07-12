"use client";
import React from "react";

const announcements = [
  { id: 1, title: "Monthly Financial Report - June 2026", content: "The June 2026 financial report has been approved and is now available for viewing. Please check the Financial Summary section for details.", date: "01 Jul 2026" },
  { id: 2, title: "Church Building Fund Update", content: "We are pleased to announce that the Church Building Fund has reached ₦2.5 million. Thank you for your generous contributions. We encourage all members to continue supporting this important project.", date: "15 Jun 2026" },
  { id: 3, title: "Pledge Reminder", content: "Members with outstanding pledges for the church programme are kindly reminded to fulfill them before the end of the quarter. You can view your pledge status in the 'My Pledges' section.", date: "10 Jun 2026" },
];

export default function MemberAnnouncementsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Announcements</h1>
        <p className="text-slate-500 text-sm">Important updates from the church finance team.</p>
      </div>

      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <h3 className="font-bold text-slate-900 text-lg">{a.title}</h3>
              <span className="text-xs text-slate-400 whitespace-nowrap">{a.date}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
