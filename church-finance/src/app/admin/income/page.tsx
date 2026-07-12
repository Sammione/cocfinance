"use client";

import React, { useState, useMemo } from "react";
import allData from "@/data/all_transactions.json";

function parseExcelDate(serial: number): string {
  const utc_days = Math.floor(serial - 25569);
  const d = new Date(utc_days * 86400 * 1000);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function getMonthYear(serial: number): string {
  const utc_days = Math.floor(serial - 25569);
  const d = new Date(utc_days * 86400 * 1000);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

const MONTHS_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December"];

interface IncomeRow { date: number; source: string; cash: number; bank: number; other: number; total: number; recordedBy: string; remarks: string; month: string; }

function parseIncomeRows(rows: any[]): IncomeRow[] {
  return rows.filter((r: any) => typeof r[0] === "number").map((r: any) => ({
    date: r[0], source: r[1]||"Unknown", cash: r[2]||0, bank: r[3]||0, other: r[4]||0, total: r[5]||0, recordedBy: r[6]||"-", remarks: r[7]||"", month: getMonthYear(r[0]),
  }));
}

export default function IncomePage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const allIncome = useMemo(() => {
    const i26 = parseIncomeRows((allData as any).income2026 || []);
    const i25 = parseIncomeRows((allData as any).income2025 || []);
    return [...i25, ...i26];
  }, []);

  const filtered = useMemo(() => allIncome.filter(t => {
    const yearMatch = t.month.includes(selectedYear);
    const monthMatch = selectedMonth === "All" || t.month.startsWith(selectedMonth);
    return yearMatch && monthMatch;
  }), [allIncome, selectedYear, selectedMonth]);

  const grouped = useMemo(() => {
    const g: Record<string, IncomeRow[]> = {};
    filtered.forEach(t => { if (!g[t.month]) g[t.month] = []; g[t.month].push(t); });
    return Object.keys(g).sort((a,b) => MONTHS_ORDER.findIndex(m=>a.startsWith(m)) - MONTHS_ORDER.findIndex(m=>b.startsWith(m))).map(k => ({month:k, rows: g[k]}));
  }, [filtered]);

  const totalIncome = filtered.reduce((a,t)=>a+t.total,0);
  const availableMonths = useMemo(() => {
    const months = new Set(allIncome.filter(t=>t.month.includes(selectedYear)).map(t=>t.month.split(" ")[0]));
    return Array.from(months).sort((a,b)=>MONTHS_ORDER.indexOf(a)-MONTHS_ORDER.indexOf(b));
  }, [allIncome, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Income Records</h1>
          <p className="text-slate-500 text-sm">Manage all church income transactions.</p>
        </div>
        <button onClick={()=>setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 self-start">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Add Income
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select value={selectedYear} onChange={e=>{setSelectedYear(e.target.value);setSelectedMonth("All");}} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
          <option value="2026">2026</option><option value="2025">2025</option>
        </select>
        <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
          <option value="All">All Months</option>
          {availableMonths.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-500">Total: <strong className="text-emerald-700">₦{totalIncome.toLocaleString()}</strong></span>
      </div>

      {grouped.map(group => {
        const mTotal = group.rows.reduce((a,t)=>a+t.total,0);
        return (
          <div key={group.month} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="px-4 md:px-6 py-4 border-b border-slate-200 bg-emerald-50 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800">{group.month}</h3>
              <span className="text-sm font-bold text-emerald-700">₦{mTotal.toLocaleString()}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Date</th><th className="py-3 px-4 font-semibold">Source</th>
                  <th className="py-3 px-4 font-semibold text-right">Cash</th><th className="py-3 px-4 font-semibold text-right">Bank</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th><th className="py-3 px-4 font-semibold hidden md:table-cell">By</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">Remarks</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {group.rows.map((r,i)=>(
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{parseExcelDate(r.date)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">{r.source}</td>
                      <td className="py-3 px-4 text-sm text-right tabular-nums">₦{r.cash.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right tabular-nums">₦{r.bank.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right font-bold text-emerald-700 tabular-nums">₦{r.total.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-slate-500 hidden md:table-cell">{r.recordedBy}</td>
                      <td className="py-3 px-4 text-sm text-slate-400 hidden lg:table-cell max-w-[200px] truncate">{r.remarks || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      {grouped.length === 0 && <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-slate-500">No income records found.</div>}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add Income Transaction</h3>
              <button onClick={()=>setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Date</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Income Category</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option>Sunday Collection</option><option>Fellowship Collection</option><option>Tithes</option><option>Offering</option><option>Pledges</option><option>Diaspora Inflow</option><option>Welfare / Health Fund</option><option>Church Programme Donations</option><option>Special Contributions</option><option>Refunds</option><option>Other Income</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Brief description"/></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Cash (₦)</label><input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0"/></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Bank (₦)</label><input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0"/></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Other (₦)</label><input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0"/></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Contributor (Optional)</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Name"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label><textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" rows={2} placeholder="Any notes"></textarea></div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={()=>setShowAddModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={()=>{alert("Will save to Supabase when connected");setShowAddModal(false);}} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Save as Draft</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
