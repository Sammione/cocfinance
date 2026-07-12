"use client";
import React from "react";

const pendingItems = [
  { id: 1, type: "Income", description: "Sunday Collection - Jan 5", amount: 94700, submittedBy: "Bro Segun", date: "05 Jan 2026", status: "Pending Approval" },
  { id: 2, type: "Expense", description: "Cleaning of the premises", amount: 7900, submittedBy: "Finance Officer", date: "05 Jan 2026", status: "Pending Approval" },
  { id: 3, type: "Expense", description: "Generator Fuel", amount: 15000, submittedBy: "Finance Officer", date: "12 Jan 2026", status: "Pending Approval" },
];

export default function ApprovalsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Approvals</h1>
        <p className="text-slate-500 text-sm">Review and approve or reject pending transactions.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
        <p className="text-sm text-amber-800"><strong>Reminder:</strong> You cannot approve a transaction you created. This rule is enforced by the system.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">Pending Approvals ({pendingItems.length})</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingItems.map(item => (
            <div key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.type === "Income" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{item.type}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">{item.status}</span>
                </div>
                <h4 className="font-medium text-slate-900">{item.description}</h4>
                <p className="text-sm text-slate-500 mt-1">Submitted by {item.submittedBy} on {item.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900 mb-2">₦{item.amount.toLocaleString()}</p>
                <div className="flex gap-2 justify-end">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">Approve</button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
