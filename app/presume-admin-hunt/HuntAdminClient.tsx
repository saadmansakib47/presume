// app/presume-admin-hunt/HuntAdminClient.tsx
"use client";
import { useState } from "react";
import { Compass, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface CatalogEntry {
  id: string;
  name: string;
  author?: string;
  engine?: string;
  isBuiltin: boolean;
  createdAt: string;
}

export default function HuntAdminClient({ secret }: { secret: string }) {
  const [isHunting, setIsHunting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CatalogEntry[] | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  const fetchCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const res = await fetch("/api/hunt");
      const data = await res.json();
      if (data.success) setCatalog(data.catalog);
      else setError(data.error ?? "Failed to load catalog");
    } catch {
      setError("Network error");
    } finally {
      setLoadingCatalog(false);
    }
  };

  const hunt = async () => {
    if (!secret) {
      setError("HUNT_SECRET is not configured on this server. Set it in .env.local.");
      return;
    }
    setIsHunting(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/hunt", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message ?? `Hunted: ${data.template?.name}`);
        fetchCatalog();
      } else {
        setError(data.error ?? data.message ?? "Hunt failed");
      }
    } catch {
      setError("Network error during hunt");
    } finally {
      setIsHunting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-zinc-700" />
            <h1 className="text-xl font-black tracking-tight text-zinc-950 uppercase">
              Presume — Hunt Admin
            </h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            This page is not linked from the app. Keep the URL private. Triggers the
            GitHub template hunter, which downloads and ingests a new open-source
            LaTeX resume into the catalog.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-semibold uppercase tracking-wider pt-1">
            <span className={`w-2 h-2 rounded-full ${secret ? "bg-green-500" : "bg-red-500"}`} />
            <span>{secret ? "Hunt secret configured" : "HUNT_SECRET missing — configure .env.local"}</span>
          </div>
        </div>

        {/* Hunt button */}
        <div className="border border-zinc-200 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800">Hunt Next Template</h2>
          <p className="text-xs text-zinc-500">
            Scans GitHub for the next candidate LaTeX resume from the hunter pool. Downloads, validates license,
            and adds it to <code className="bg-zinc-100 px-1 rounded">templates/catalog.json</code>.
          </p>
          <button
            onClick={hunt}
            disabled={isHunting || !secret}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-[10px] text-sm font-bold transition cursor-pointer disabled:cursor-not-allowed"
          >
            <Compass size={16} className={isHunting ? "animate-spin" : ""} />
            {isHunting ? "Hunting GitHub..." : "Hunt Template"}
          </button>
          {message && (
            <div className="flex items-start gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle size={14} className="mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Catalog viewer */}
        <div className="border border-zinc-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-800">Current Catalog</h2>
            <button
              onClick={fetchCatalog}
              disabled={loadingCatalog}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={loadingCatalog ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          {catalog === null ? (
            <button onClick={fetchCatalog} className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold underline cursor-pointer transition">
              Load catalog
            </button>
          ) : (
            <div className="space-y-2">
              {catalog.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <div>
                    <span className="text-sm font-bold text-zinc-900">{t.name}</span>
                    <span className="ml-2 text-[10px] text-zinc-500 font-semibold">{t.author ?? "—"} · {t.engine}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${t.isBuiltin ? "bg-zinc-100 text-zinc-600" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                    {t.isBuiltin ? "Built-in" : "Hunted"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-zinc-300 font-semibold text-center uppercase tracking-widest">
          Presume Admin · Not for public access
        </p>
      </div>
    </div>
  );
}
