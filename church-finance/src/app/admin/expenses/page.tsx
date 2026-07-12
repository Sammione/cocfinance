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

interface ExpenseRow { date: number; description: string; cash: number; bank: number; total: number; collectedBy: string; remarks: string; month: string; status: string; }

function parseExpenseRows(rows: any[]): ExpenseRow[] {
  return rows.filter((r: any) => typeof r[0] === "number").map((r: any) => ({
    date: r[0], description: r[1]||"Unknown", cash: r[2]||0, bank: r[3]||0, total: r[4]||(r[2]||0)+(r[3]||0), collectedBy: r[5]||"-", remarks: r[6]||"", month: getMonthYear(r[0]), status: "Paid",
  }));
}

export default function ExpensesPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const allExpenses = useMemo(() => {
    const e26 = parseExpenseRows((allData as any).expense2026 || []);
    const e25 = parseExpenseRows((allData as any).expense2025 || []);
    return [...e25, ...e26];
  }, []);

  const filtered = useMemo(() => allExpenses.filter(t => {
    const yearMatch = t.month.includes(selectedYear);
    const monthMatch = selectedMonth === "All" || t.month.startsWith(selectedMonth);
    return yearMatch && monthMatch;
  }), [allExpenses, selectedYear, selectedMonth]);

  const grouped = useMemo(() => {
    const g: Record<string, ExpenseRow[]> = {};
    filtered.forEach(t => { if (!g[t.month]) g[t.month] = []; g[t.month].push(t); });
    return Object.keys(g).sort((a,b) => MONTHS_ORDER.findIndex(m=>a.startsWith(m)) - MONTHS_ORDER.findIndex(m=>b.startsWith(m))).map(k => ({month:k, rows: g[k]}));
  }, [filtered]);

  const totalExpense = filtered.reduce((a,t)=>a+t.total,0);
  const availableMonths = useMemo(() => {
    const months = new Set(allExpenses.filter(t=>t.month.includes(selectedYear)).map(t=>t.month.split(" ")[0]));
    return Array.from(months).sort((a,b)=>MONTHS_ORDER.indexOf(a)-MONTHS_ORDER.indexOf(b));
  }, [allExpenses, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Expense Records</h1>
          <p className="text-slate-500 text-sm">Manage all church expense transactions.</p>
        </div>
        <button onClick={()=>setShowAddModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 self-start">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Add Expense
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select value={selectedYear} onChange={e=>{setSelectedYear(e.target.value);setSelectedMonth("All");}} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
          <option value="2026">2026</option><option value="2025">2025</option>
        </select>
        <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
          <option value="All">All Months</option>
          {availableMonths.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-500">Total: <strong className="text-red-600">₦{totalExpense.toLocaleString()}</strong></span>
      </div>

      {grouped.map(group => {
        const mTotal = group.rows.reduce((a,t)=>a+t.total,0);
        return (
          <div key={group.month} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="px-4 md:px-6 py-4 border-b border-slate-200 bg-red-50 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800">{group.month}</h3>
              <span className="text-sm font-bold text-red-600">₦{mTotal.toLocaleString()}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Date</th><th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold text-right">Cash</th><th className="py-3 px-4 font-semibold text-right">Bank</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th><th className="py-3 px-4 font-semibold hidden md:table-cell">Collected By</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {group.rows.map((r,i)=>(
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{parseExcelDate(r.date)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900 max-w-[250px] truncate">{r.description}</td>
                      <td className="py-3 px-4 text-sm text-right tabular-nums">₦{r.cash.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right tabular-nums">₦{r.bank.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right font-bold text-red-600 tabular-nums">₦{r.total.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-slate-500 hidden md:table-cell">{r.collectedBy}</td>
                      <td className="py-3 px-4 text-sm text-center"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Paid</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      {grouped.length === 0 && <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-slate-500">No expense records found.</div>}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add Expense Request</h3>
              <button onClick={()=>setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Date</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option>Welfare and Benevolence</option><option>Church Maintenance</option><option>Generator and Fuel</option><option>Utility Bills</option><option>Minister Support</option><option>Church Programmes and Events</option><option>Transport</option><option>Refreshments</option><option>Equipment Purchase</option><option>Repairs</option><option>Evangelism</option><option>Administration</option><option>Other Expenses</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="What is this expense for?"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Cash (₦)</label><input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0"/></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Bank (₦)</label><input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0"/></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Payment Recipient</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Name"/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label><textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" rows={2}></textarea></div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={()=>setShowAddModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={()=>{alert("Will save to Supabase when connected");setShowAddModal(false);}} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Submit for Approval</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
