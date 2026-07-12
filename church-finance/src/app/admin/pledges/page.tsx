"use client";
import React, { useState } from "react";
import extraData from "@/data/extra_data.json";

interface Pledge { sn: number; name: string; description: string | number; total: number; status: string; }

const pledgesRaw = ((extraData as any).pledges || []).slice(1); // skip header
const pledges: Pledge[] = pledgesRaw.filter((r:any) => r[1]).map((r:any) => ({
  sn: r[0] || 0, name: r[1] || "Unknown", description: r[2] || "-", total: r[3] || 0,
  status: r[3] > 0 ? "Completed" : "Pending",
}));

const totalPledged = pledges.reduce((a,p)=>a+p.total,0);

export default function PledgesPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Pledges</h1>
          <p className="text-slate-500 text-sm">Track member pledges for church programmes.</p>
        </div>
        <button onClick={()=>setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors self-start">Add Pledge</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Pledges</h3>
          <p className="text-2xl font-bold text-slate-900">{pledges.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Amount</h3>
          <p className="text-2xl font-bold text-emerald-600">₦{totalPledged.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Completed</h3>
          <p className="text-2xl font-bold text-blue-600">{pledges.filter(p=>p.status==="Completed").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">All Pledges - Church Programmes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">S/N</th>
              <th className="py-3 px-4 font-semibold">Contributor</th>
              <th className="py-3 px-4 font-semibold text-right">Amount (₦)</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {pledges.map((p,i)=>(
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-500">{p.sn}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-slate-900 tabular-nums">₦{p.total.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {pledges.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-slate-500">No pledges found.</td></tr>}
            </tbody>
            <tfoot><tr className="bg-slate-50 border-t-2 border-slate-300">
              <td className="py-3 px-4" colSpan={2}><strong className="text-sm text-slate-900">Total</strong></td>
              <td className="py-3 px-4 text-right text-sm font-bold text-emerald-700 tabular-nums">₦{totalPledged.toLocaleString()}</td>
              <td></td>
            </tr></tfoot>
          </table>
        </div>
      </div>

      {/* Add Pledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add Pledge</h3>
              <button onClick={()=>setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Member Name</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label><input type="tel" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Programme/Project</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g. Church Building Programme"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Pledged Amount (₦)</label><input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0"/></div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={()=>setShowAddModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={()=>{alert("Will save to Supabase when connected");setShowAddModal(false);}} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Pledge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
