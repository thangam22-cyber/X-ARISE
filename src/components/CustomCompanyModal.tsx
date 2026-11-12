import { useState, FormEvent } from "react";
import { X, Building2, Plus, Sparkles } from "lucide-react";
import { CompanyProfile, IndustrySector } from "../types";

interface CustomCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCompany: (company: CompanyProfile) => void;
}

export function CustomCompanyModal({
  isOpen,
  onClose,
  onSaveCompany
}: CustomCompanyModalProps) {
  const [name, setName] = useState<string>("CyberSphere Defense Systems");
  const [industry, setIndustry] = useState<IndustrySector>("Technology");
  const [revenueMillions, setRevenueMillions] = useState<number>(450);
  const [employeeCount, setEmployeeCount] = useState<number>(3800);
  const [techStackInput, setTechStackInput] = useState<string>("Kubernetes, AWS EKS, PostgreSQL, OAuth2, Terraform, Snowflake");
  const [dataTypesInput, setDataTypesInput] = useState<string>("Customer PII, Source Code, API Tokens, Financial Ledgers");
  const [geography, setGeography] = useState<string>("North America, European Union");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newCompany: CompanyProfile = {
      id: `custom-${Date.now()}`,
      name,
      industry,
      size: employeeCount > 10000 ? "Mega-Corp (10000+)" : employeeCount > 2500 ? "Enterprise (2500-10000)" : "Mid-Market (250-2500)",
      revenue: revenueMillions * 1000000,
      employeeCount,
      techStack: techStackInput.split(",").map((s) => s.trim()),
      dataType: dataTypesInput.split(",").map((s) => s.trim()),
      geography: geography.split(",").map((s) => s.trim()),
      criticalAssetsCount: Math.round(employeeCount * 0.25),
      activeVendorsCount: 38,
      annualSecurityBudget: Math.round(revenueMillions * 1000000 * 0.035)
    };

    onSaveCompany(newCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800/40">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Target Organization Risk Profiler
              </h3>
              <p className="text-xs text-slate-400">
                Define a custom enterprise to run through all 6 AI engines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Company Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Industry Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustrySector)}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Technology">Technology</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Energy">Energy</option>
                <option value="Government">Government</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Annual Revenue ($M)</label>
              <input
                type="number"
                min="1"
                value={revenueMillions}
                onChange={(e) => setRevenueMillions(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Employees</label>
              <input
                type="number"
                min="10"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Geography</label>
              <input
                type="text"
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Tech Stack (comma-separated)</label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Data Types & Classifications</label>
            <input
              type="text"
              value={dataTypesInput}
              onChange={(e) => setDataTypesInput(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles className="h-4 w-4" />
            Profile & Run 6 Connected Engines
          </button>
        </form>
      </div>
    </div>
  );
}
