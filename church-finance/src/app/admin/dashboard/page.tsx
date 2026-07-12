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
  other: number;
  total: number;
  recordedBy: string;
  remarks: string;
  type: "income" | "expense";
  month: string;
}

function parseIncomeRows(rows: any[]): Transaction[] {
  return rows.filter((r: any) => typeof r[0] === "number").map((r: any) => ({
    date: r[0],
    source: r[1] || "Unknown",
    cash: r[2] || 0,
    bank: r[3] || 0,
    other: r[4] || 0,
    total: r[5] || 0,
    recordedBy: r[6] || "-",
    remarks: r[7] || "",
    type: "income" as const,
    month: getMonthYear(r[0]),
  }));
}

function parseExpenseRows(rows: any[]): Transaction[] {
  return rows.filter((r: any) => typeof r[0] === "number").map((r: any) => ({
    date: r[0],
    source: r[1] || "Unknown",
    cash: r[2] || 0,
    bank: r[3] || 0,
    other: 0,
    total: r[4] || (r[2] || 0) + (r[3] || 0),
    recordedBy: r[5] || "-",
    remarks: r[6] || "",
    type: "expense" as const,
    month: getMonthYear(r[0]),
  }));
}

const MONTHS_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AdminDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

  const income2026 = useMemo(() => parseIncomeRows((allData as any).income2026 || []), []);
  const expense2026 = useMemo(() => parseExpenseRows((allData as any).expense2026 || []), []);
  const income2025 = useMemo(() => parseIncomeRows((allData as any).income2025 || []), []);
  const expense2025 = useMemo(() => parseExpenseRows((allData as any).expense2025 || []), []);

  const allIncome = useMemo(() => [...income2025, ...income2026], [income2025, income2026]);
  const allExpenses = useMemo(() => [...expense2025, ...expense2026], [expense2025, expense2026]);

  const currentTransactions = activeTab === "income" ? allIncome : allExpenses;

  const filteredTransactions = useMemo(() => {
    return currentTransactions.filter((t) => {
      const yearMatch = t.month.includes(selectedYear);
      const monthMatch = selectedMonth === "All" || t.month.startsWith(selectedMonth);
      return yearMatch && monthMatch;
    });
  }, [currentTransactions, selectedYear, selectedMonth]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach((t) => {
      if (!groups[t.month]) groups[t.month] = [];
      groups[t.month].push(t);
    });
    // Sort months
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const aMonth = MONTHS_ORDER.findIndex((m) => a.startsWith(m));
      const bMonth = MONTHS_ORDER.findIndex((m) => b.startsWith(m));
      return aMonth - bMonth;
    });
    return sortedKeys.map((key) => ({ month: key, transactions: groups[key] }));
  }, [filteredTransactions]);

  // Summary calculations
  const totalIncome2026 = income2026.reduce((a, t) => a + t.total, 0);
  const totalExpense2026 = expense2026.reduce((a, t) => a + t.total, 0);
  const totalCash = filteredTransactions.reduce((a, t) => a + t.cash, 0);
  const totalBank = filteredTransactions.reduce((a, t) => a + t.bank, 0);
  const totalFiltered = filteredTransactions.reduce((a, t) => a + t.total, 0);

  // Available months for filter
  const availableMonths = useMemo(() => {
    const months = new Set(currentTransactions.filter((t) => t.month.includes(selectedYear)).map((t) => t.month.split(" ")[0]));
    return Array.from(months).sort((a, b) => MONTHS_ORDER.indexOf(a) - MONTHS_ORDER.indexOf(b));
  }, [currentTransactions, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Financial Dashboard</h1>
          <p className="text-slate-500 text-sm md:text-base">Church financial records imported from Excel spreadsheet.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <h3 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Total Income 2026</h3>
          <p className="text-xl md:text-2xl font-bold text-emerald-600">₦{totalIncome2026.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <h3 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Total Expense 2026</h3>
          <p className="text-xl md:text-2xl font-bold text-red-500">₦{totalExpense2026.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <h3 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Balance 2026</h3>
          <p className="text-xl md:text-2xl font-bold text-blue-600">₦{(totalIncome2026 - totalExpense2026).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <h3 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Filtered Total</h3>
          <p className="text-xl md:text-2xl font-bold text-slate-900">₦{totalFiltered.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Income/Expense Tabs */}
          <div className="flex bg-slate-100 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setActiveTab("income")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "income" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Income
            </button>
            <button
              onClick={() => setActiveTab("expense")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "expense" ? "bg-red-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Expenses
            </button>
          </div>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setSelectedMonth("All"); }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>

          {/* Month */}
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

          {/* Cash/Bank summary for filtered */}
          <div className="flex gap-4 ml-auto text-sm text-slate-500">
            <span>Cash: <strong className="text-slate-800">₦{totalCash.toLocaleString()}</strong></span>
            <span>Bank: <strong className="text-slate-800">₦{totalBank.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Month-by-Month Groups */}
      {groupedByMonth.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          No {activeTab} records found for the selected filters.
        </div>
      ) : (
        groupedByMonth.map((group) => {
          const monthTotal = group.transactions.reduce((a, t) => a + t.total, 0);
          const monthCash = group.transactions.reduce((a, t) => a + t.cash, 0);
          const monthBank = group.transactions.reduce((a, t) => a + t.bank, 0);

          return (
            <div key={group.month} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
              {/* Month Header */}
              <div className={`px-4 md:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 ${activeTab === "income" ? "bg-emerald-50" : "bg-red-50"}`}>
                <h3 className="text-base md:text-lg font-bold text-slate-800">{group.month}</h3>
                <div className="flex gap-4 text-xs md:text-sm">
                  <span className="text-slate-500">Cash: <strong className="text-slate-800">₦{monthCash.toLocaleString()}</strong></span>
                  <span className="text-slate-500">Bank: <strong className="text-slate-800">₦{monthBank.toLocaleString()}</strong></span>
                  <span className={`font-bold ${activeTab === "income" ? "text-emerald-700" : "text-red-600"}`}>
                    Total: ₦{monthTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4 md:px-6 font-semibold">Date</th>
                      <th className="py-3 px-4 md:px-6 font-semibold">{activeTab === "income" ? "Source" : "Description"}</th>
                      <th className="py-3 px-4 md:px-6 font-semibold text-right">Cash (₦)</th>
                      <th className="py-3 px-4 md:px-6 font-semibold text-right">Bank (₦)</th>
                      <th className="py-3 px-4 md:px-6 font-semibold text-right">Total (₦)</th>
                      <th className="py-3 px-4 md:px-6 font-semibold hidden md:table-cell">{activeTab === "income" ? "Recorded By" : "Collected By"}</th>
                      <th className="py-3 px-4 md:px-6 font-semibold text-center hidden lg:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {group.transactions.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 md:px-6 text-sm text-slate-600 whitespace-nowrap">
                          {formatDate(row.date)}
                        </td>
                        <td className="py-3 px-4 md:px-6 text-sm font-medium text-slate-900 max-w-[200px] truncate">
                          {row.source}
                        </td>
                        <td className="py-3 px-4 md:px-6 text-sm text-slate-600 text-right tabular-nums">
                          {row.cash.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 md:px-6 text-sm text-slate-600 text-right tabular-nums">
                          {row.bank.toLocaleString()}
                        </td>
                        <td className={`py-3 px-4 md:px-6 text-sm text-right font-bold tabular-nums ${activeTab === "income" ? "text-emerald-700" : "text-red-600"}`}>
                          {row.total.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 md:px-6 text-sm text-slate-500 hidden md:table-cell">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold mr-2 shrink-0">
                              {row.recordedBy[0]}
                            </div>
                            {row.recordedBy}
                          </div>
                        </td>
                        <td className="py-3 px-4 md:px-6 text-sm text-center hidden lg:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
