"use client";
import React, { useState, useMemo } from "react";
import allData from "@/data/all_transactions.json";

function getMonthYear(serial: number): string {
  const utc_days = Math.floor(serial - 25569);
  const d = new Date(utc_days * 86400 * 1000);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
const MONTHS_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseIncome(rows: any[]) { return rows.filter((r:any) => typeof r[0] === "number").map((r:any) => ({ total: r[5]||0, month: getMonthYear(r[0]) })); }
function parseExpense(rows: any[]) { return rows.filter((r:any) => typeof r[0] === "number").map((r:any) => ({ total: r[4]||(r[2]||0)+(r[3]||0), month: getMonthYear(r[0]) })); }

export default function MemberSummaryPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const income = useMemo(() => [...parseIncome((allData as any).income2025||[]), ...parseIncome((allData as any).income2026||[])], []);
  const expense = useMemo(() => [...parseExpense((allData as any).expense2025||[]), ...parseExpense((allData as any).expense2026||[])], []);

  const monthlySummary = useMemo(() => {
    const months: Record<string, {income:number;expense:number}> = {};
    income.filter(t=>t.month.includes(selectedYear)).forEach(t => { if (!months[t.month]) months[t.month]={income:0,expense:0}; months[t.month].income+=t.total; });
    expense.filter(t=>t.month.includes(selectedYear)).forEach(t => { if (!months[t.month]) months[t.month]={income:0,expense:0}; months[t.month].expense+=t.total; });
    return Object.keys(months).sort((a,b) => MONTHS_ORDER.findIndex(m=>a.startsWith(m))-MONTHS_ORDER.findIndex(m=>b.startsWith(m))).map(k => ({month:k,...months[k]}));
  }, [income, expense, selectedYear]);

  const totals = monthlySummary.reduce((a,m) => ({income:a.income+m.income,expense:a.expense+m.expense}), {income:0,expense:0});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Financial Summary</h1>
        <p className="text-slate-500 text-sm">Approved monthly income and expense summaries.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Income ({selectedYear})</h3>
          <p className="text-2xl font-bold text-emerald-600">₦{totals.income.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Expenses ({selectedYear})</h3>
          <p className="text-2xl font-bold text-red-500">₦{totals.expense.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Net Balance ({selectedYear})</h3>
          <p className="text-2xl font-bold text-blue-600">₦{(totals.income-totals.expense).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
          <option value="2026">2026</option><option value="2025">2025</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200 bg-blue-50">
          <h3 className="text-base font-bold text-slate-800">Monthly Breakdown - {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">Month</th>
              <th className="py-3 px-4 font-semibold text-right">Income</th>
              <th className="py-3 px-4 font-semibold text-right">Expenses</th>
              <th className="py-3 px-4 font-semibold text-right">Balance</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {monthlySummary.map(row => (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{row.month}</td>
                  <td className="py-3 px-4 text-sm text-right text-emerald-600 font-semibold tabular-nums">₦{row.income.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right text-red-500 font-semibold tabular-nums">₦{row.expense.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-sm text-right font-bold tabular-nums ${row.income-row.expense>=0?"text-blue-600":"text-red-600"}`}>₦{(row.income-row.expense).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            {monthlySummary.length > 0 && <tfoot><tr className="bg-slate-50 border-t-2 border-slate-300">
              <td className="py-3 px-4 text-sm font-bold">Total</td>
              <td className="py-3 px-4 text-sm text-right font-bold text-emerald-700 tabular-nums">₦{totals.income.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-right font-bold text-red-600 tabular-nums">₦{totals.expense.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-right font-bold text-blue-700 tabular-nums">₦{(totals.income-totals.expense).toLocaleString()}</td>
            </tr></tfoot>}
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Note:</strong> This summary shows only approved financial records. Detailed breakdowns and receipts are available to authorized personnel only.
      </div>
    </div>
  );
}
