"use client";

import React, { useState, useMemo } from "react";
import allData from "@/data/all_transactions.json";

function parseExcelDate(serial: number): Date {
  const utc_days = Math.floor(serial - 25569);
  return new Date(utc_days * 86400 * 1000);
}

function formatDate(serial: number): string {
  const d = parseExcelDate(serial);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getMonthYear(serial: number): string {
  const d = parseExcelDate(serial);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

interface Transaction {
  date: number;
  source: string;
  cash: number;
  bank: number;
  total: number;
  month: string;
}

const MONTHS_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseIncomeRows(rows: any[]): Transaction[] {
  return rows.filter((r: any) => typeof r[0] === "number").map((r: any) => ({
    date: r[0], source: r[1] || "Unknown", cash: r[2] || 0, bank: r[3] || 0, total: r[5] || 0, month: getMonthYear(r[0]),
  }));
}

function parseExpenseRows(rows: any[]): Transaction[] {
  return rows.filter((r: any) => typeof r[0] === "number").map((r: any) => ({
    date: r[0], source: r[1] || "Unknown", cash: r[2] || 0, bank: r[3] || 0, total: r[4] || (r[2] || 0) + (r[3] || 0), month: getMonthYear(r[0]),
  }));
}

export default function MemberDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const income = useMemo(() => {
    const i26 = parseIncomeRows((allData as any).income2026 || []);
    const i25 = parseIncomeRows((allData as any).income2025 || []);
    return [...i25, ...i26];
  }, []);

  const expenses = useMemo(() => {
    const e26 = parseExpenseRows((allData as any).expense2026 || []);
    const e25 = parseExpenseRows((allData as any).expense2025 || []);
    return [...e25, ...e26];
  }, []);

  const filteredIncome = useMemo(() => income.filter((t) => {
    const yearMatch = t.month.includes(selectedYear);
    const monthMatch = selectedMonth === "All" || t.month.startsWith(selectedMonth);
    return yearMatch && monthMatch;
  }), [income, selectedYear, selectedMonth]);

  const filteredExpenses = useMemo(() => expenses.filter((t) => {
    const yearMatch = t.month.includes(selectedYear);
    const monthMatch = selectedMonth === "All" || t.month.startsWith(selectedMonth);
    return yearMatch && monthMatch;
  }), [expenses, selectedYear, selectedMonth]);

  // Monthly summaries
  const monthlySummary = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    filteredIncome.forEach((t) => {
      if (!months[t.month]) months[t.month] = { income: 0, expense: 0 };
      months[t.month].income += t.total;
    });
    filteredExpenses.forEach((t) => {
      if (!months[t.month]) months[t.month] = { income: 0, expense: 0 };
      months[t.month].expense += t.total;
    });
    const sortedKeys = Object.keys(months).sort((a, b) => {
      const aMonth = MONTHS_ORDER.findIndex((m) => a.startsWith(m));
      const bMonth = MONTHS_ORDER.findIndex((m) => b.startsWith(m));
      return aMonth - bMonth;
    });
    return sortedKeys.map((key) => ({ month: key, ...months[key] }));
  }, [filteredIncome, filteredExpenses]);

  const totalIncome = filteredIncome.reduce((a, t) => a + t.total, 0);
  const totalExpense = filteredExpenses.reduce((a, t) => a + t.total, 0);

  const availableMonths = useMemo(() => {
    const all = [...income, ...expenses].filter((t) => t.month.includes(selectedYear));
    const months = new Set(all.map((t) => t.month.split(" ")[0]));
    return Array.from(months).sort((a, b) => MONTHS_ORDER.indexOf(a) - MONTHS_ORDER.indexOf(b));
  }, [income, expenses, selectedYear]);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Welcome, Member</h1>
        <p className="text-slate-500">View approved financial summaries of the church.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-emerald-600">₦{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-500">₦{totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Balance</h3>
          <p className="text-2xl font-bold text-blue-600">₦{(totalIncome - totalExpense).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setSelectedMonth("All"); }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 bg-blue-50">
          <h3 className="text-base md:text-lg font-bold text-slate-800">Monthly Financial Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 md:px-6 font-semibold">Month</th>
                <th className="py-3 px-4 md:px-6 font-semibold text-right">Income (₦)</th>
                <th className="py-3 px-4 md:px-6 font-semibold text-right">Expenses (₦)</th>
                <th className="py-3 px-4 md:px-6 font-semibold text-right">Balance (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlySummary.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 md:px-6 text-sm font-medium text-slate-900">{row.month}</td>
                  <td className="py-3 px-4 md:px-6 text-sm text-emerald-600 text-right font-semibold tabular-nums">₦{row.income.toLocaleString()}</td>
                  <td className="py-3 px-4 md:px-6 text-sm text-red-500 text-right font-semibold tabular-nums">₦{row.expense.toLocaleString()}</td>
                  <td className={`py-3 px-4 md:px-6 text-sm text-right font-bold tabular-nums ${row.income - row.expense >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    ₦{(row.income - row.expense).toLocaleString()}
                  </td>
                </tr>
              ))}
              {monthlySummary.length === 0 && (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">No records found.</td></tr>
              )}
            </tbody>
            {monthlySummary.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-300">
                  <td className="py-3 px-4 md:px-6 text-sm font-bold text-slate-900">Total</td>
                  <td className="py-3 px-4 md:px-6 text-sm text-emerald-700 text-right font-bold tabular-nums">₦{totalIncome.toLocaleString()}</td>
                  <td className="py-3 px-4 md:px-6 text-sm text-red-600 text-right font-bold tabular-nums">₦{totalExpense.toLocaleString()}</td>
                  <td className="py-3 px-4 md:px-6 text-sm text-blue-700 text-right font-bold tabular-nums">₦{(totalIncome - totalExpense).toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Note:</strong> This summary shows approved financial records only. For detailed breakdowns or questions, please contact the Finance Team.
      </div>
    </div>
  );
}
