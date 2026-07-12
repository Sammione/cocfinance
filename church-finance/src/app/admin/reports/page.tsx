"use client";
import React, { useState, useMemo } from "react";
import allData from "@/data/all_transactions.json";

function getMonthYear(serial: number): string {
  const utc_days = Math.floor(serial - 25569);
  const d = new Date(utc_days * 86400 * 1000);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}
const MONTHS_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseIncome(rows: any[]) { return rows.filter((r:any) => typeof r[0] === "number").map((r:any) => ({ total: r[5]||0, cash: r[2]||0, bank: r[3]||0, month: getMonthYear(r[0]) })); }
function parseExpense(rows: any[]) { return rows.filter((r:any) => typeof r[0] === "number").map((r:any) => ({ total: r[4]||(r[2]||0)+(r[3]||0), cash: r[2]||0, bank: r[3]||0, month: getMonthYear(r[0]) })); }

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [reportType, setReportType] = useState("monthly");

  const income = useMemo(() => [...parseIncome((allData as any).income2025||[]), ...parseIncome((allData as any).income2026||[])], []);
  const expense = useMemo(() => [...parseExpense((allData as any).expense2025||[]), ...parseExpense((allData as any).expense2026||[])], []);

  const monthlySummary = useMemo(() => {
    const months: Record<string, {income:number;expense:number;cashIn:number;bankIn:number;cashOut:number;bankOut:number}> = {};
    income.filter(t=>t.month.includes(selectedYear)).forEach(t => {
      if (!months[t.month]) months[t.month] = {income:0,expense:0,cashIn:0,bankIn:0,cashOut:0,bankOut:0};
      months[t.month].income += t.total; months[t.month].cashIn += t.cash; months[t.month].bankIn += t.bank;
    });
    expense.filter(t=>t.month.includes(selectedYear)).forEach(t => {
      if (!months[t.month]) months[t.month] = {income:0,expense:0,cashIn:0,bankIn:0,cashOut:0,bankOut:0};
      months[t.month].expense += t.total; months[t.month].cashOut += t.cash; months[t.month].bankOut += t.bank;
    });
    return Object.keys(months).sort((a,b) => MONTHS_ORDER.findIndex(m=>a.startsWith(m))-MONTHS_ORDER.findIndex(m=>b.startsWith(m))).map(k => ({month:k,...months[k]}));
  }, [income, expense, selectedYear]);

  const totals = monthlySummary.reduce((a,m) => ({income:a.income+m.income,expense:a.expense+m.expense}), {income:0,expense:0});

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Reports</h1>
          <p className="text-slate-500 text-sm">Generate and export financial reports.</p>
        </div>
        <button onClick={()=>alert("Export feature coming with Supabase integration")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors self-start flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select value={reportType} onChange={e=>setReportType(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
          <option value="monthly">Monthly Summary</option><option value="income_category">Income by Category</option><option value="expense_category">Expense by Category</option><option value="cash_vs_bank">Cash vs Bank</option>
        </select>
        <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
          <option value="2026">2026</option><option value="2025">2025</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">Monthly Income vs Expense Report - {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">Month</th>
              <th className="py-3 px-4 font-semibold text-right">Income</th>
              <th className="py-3 px-4 font-semibold text-right">Expenses</th>
              <th className="py-3 px-4 font-semibold text-right">Balance</th>
              <th className="py-3 px-4 font-semibold text-center hidden md:table-cell">Margin</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {monthlySummary.map(row => {
                const balance = row.income - row.expense;
                const margin = row.income > 0 ? ((balance/row.income)*100).toFixed(1) : "0.0";
                return (
                  <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{row.month}</td>
                    <td className="py-3 px-4 text-sm text-right text-emerald-600 font-semibold tabular-nums">₦{row.income.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-red-500 font-semibold tabular-nums">₦{row.expense.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-sm text-right font-bold tabular-nums ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>₦{balance.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-center hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${Number(margin) >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{margin}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot><tr className="bg-slate-50 border-t-2 border-slate-300">
              <td className="py-3 px-4 text-sm font-bold text-slate-900">Annual Total</td>
              <td className="py-3 px-4 text-sm text-right font-bold text-emerald-700 tabular-nums">₦{totals.income.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-right font-bold text-red-600 tabular-nums">₦{totals.expense.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm text-right font-bold text-blue-700 tabular-nums">₦{(totals.income-totals.expense).toLocaleString()}</td>
              <td className="hidden md:table-cell"></td>
            </tr></tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
