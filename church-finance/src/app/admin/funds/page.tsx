"use client";
import React from "react";
import extraData from "@/data/extra_data.json";

function parseExcelDate(serial: number): string {
  const utc_days = Math.floor(serial - 25569);
  const d = new Date(utc_days * 86400 * 1000);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const healthRows = ((extraData as any).healthFund || []).filter((r:any) => typeof r[0] === "number");
const diasporaRows = ((extraData as any).diaspora || []).filter((r:any) => typeof r[0] === "number");

const funds = [
  { name: "Health Fund Account", description: "Health and welfare support fund for members", balance: healthRows.length > 0 ? (healthRows[0][2] || 0) : 0, status: "Active", color: "emerald" },
  { name: "Diaspora Inflow Fund", description: "Funds received from members abroad", balance: diasporaRows.reduce((a:number,r:any)=>a+(r[4]||0),0), status: "Active", color: "blue" },
  { name: "Church Building Fund", description: "Reserved for church building and renovation", balance: 0, status: "Active", color: "amber" },
  { name: "Benevolence Fund", description: "Support for members in need", balance: 0, status: "Active", color: "purple" },
  { name: "Emergency Fund", description: "For unexpected urgent needs", balance: 0, status: "Active", color: "red" },
];

export default function FundsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Special Funds</h1>
          <p className="text-slate-500 text-sm">Track and manage restricted and special church funds.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors self-start">Create Fund</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund,i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 ${fund.color === "emerald" ? "bg-emerald-500" : fund.color === "blue" ? "bg-blue-500" : fund.color === "amber" ? "bg-amber-500" : fund.color === "purple" ? "bg-purple-500" : "bg-red-500"}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-900">{fund.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">{fund.status}</span>
              </div>
              <p className="text-sm text-slate-500 mb-4">{fund.description}</p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-slate-900">₦{fund.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
