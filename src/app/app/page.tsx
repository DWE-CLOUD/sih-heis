"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Gauge,
  Layers,
  Map,
  ShieldCheck,
  Zap,
  Clock,
  Train,
  Check,
  AlertCircle,
  BarChart,
} from "lucide-react";

type KPI = {
  onTimePercent: number;
  averageDelaySec: number;
  throughputTrainsPerHour: number;
};

type StateResponse = {
  trains: any[];
  stations: any[];
  segments: any[];
  kpi: KPI;
};

type Conflict = {
  id: string;
  ruleType: string;
  severity: string;
  trains: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AppHome() {
  const [state, setState] = useState<StateResponse | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      try {
        const [s, c] = await Promise.all([
          fetch(`${API_BASE}/state`).then((r) => r.json()),
          fetch(`${API_BASE}/conflicts`).then((r) => r.json()),
        ]);
        if (!active) return;
        setState(s);
        setConflicts(c);
      } catch (e) {
        // ignore for MVP
      }
    };
    fetchAll();
    const id = setInterval(fetchAll, 3000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen brand-gradient text-brand-900">
      <header className="sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-brand-700/80 rounded-lg flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-brand-100 rounded-sm opacity-90"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-900">
                CHIMERA CORE
              </h1>
              <p className="text-sm text-brand-800 font-medium">Railway Operations Control</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-brand-800 font-medium">Live Demo</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          <section className="xl:col-span-3 space-y-12">
            <KPIBar kpi={state?.kpi} />
            <ScenarioCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Placeholder 
                title="Live Network Map" 
                subtitle="Real-time railway network overview"
                icon={Map}
              />
              <Placeholder 
                title="Schedule Gantt Chart" 
                subtitle="Train schedules and timeline view"
                icon={Clock}
              />
            </div>
          </section>
          <aside className="xl:col-span-1">
            <ConflictsPanel
              conflicts={conflicts}
              onResolve={async (conflictId, plan) => {
                try {
                  setBusy(conflictId + plan);
                  await fetch(`${API_BASE}/resolve`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ conflictId, plan, actor: "controller" }),
                  }).then((r) => r.json());
                } finally {
                  setBusy(null);
                }
              }}
              busyKey={busy}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

function KPIBar({ kpi }: { kpi: KPI | undefined }) {
  const cards = useMemo(
    () => [
      {
        label: "On-Time Performance",
        value: kpi ? `${kpi.onTimePercent.toFixed(1)}%` : "--",
        icon: Clock,
      },
      {
        label: "Average Delay",
        value: kpi ? `${kpi.averageDelaySec}s` : "--",
        icon: AlertTriangle,
      },
      {
        label: "Throughput Rate",
        value: kpi ? `${kpi.throughputTrainsPerHour}/hour` : "--",
        icon: Gauge,
      },
    ],
    [kpi]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map((card) => (
        <div key={card.label} className="glass p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <card.icon className="w-6 h-6 text-brand-700" />
                <p className="text-sm font-semibold text-brand-800 uppercase tracking-wide">{card.label}</p>
              </div>
              <p className="text-3xl font-bold text-brand-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScenarioCards() {
  const scenarios = [
    {
      title: "Situational Awareness",
      description: "Live map, Gantt, KPIs with instant updates.",
      icon: BarChart,
    },
    {
      title: "Proactive Resolution",
      description: "Conflict chips with Plan A/B and ripple preview.",
      icon: AlertCircle,
    },
    {
      title: "Safety First",
      description: "Hard-rule checks on platforms, blocks, signals.",
      icon: ShieldCheck,
    },
    {
      title: "Scenario Sandbox",
      description: "Run what-ifs and promote the winning plan.",
      icon: Layers,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {scenarios.map((scenario, index) => (
        <div key={index} className="glass p-6 group cursor-pointer h-full">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-grow">
              <div className="w-12 h-12 rounded-lg bg-brand-800/20 flex items-center justify-center mb-4">
                <scenario.icon className="w-6 h-6 text-brand-700" />
              </div>
              <h3 className="text-lg font-bold text-brand-900 mb-2">{scenario.title}</h3>
            </div>
            <p className="text-sm text-brand-800 leading-relaxed">{scenario.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Placeholder({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ElementType }) {
  return (
    <div className="glass aspect-video p-8 flex flex-col justify-between group cursor-pointer">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-brand-800/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-700" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-800 uppercase tracking-wide">{subtitle}</p>
        </div>
      </div>
      <div className="mt-auto">
        <h3 className="text-2xl font-bold text-brand-900">{title}</h3>
        <div className="mt-2 w-16 h-1 bg-brand-700 rounded-full"></div>
      </div>
    </div>
  );
}

function ConflictsPanel({ conflicts, onResolve, busyKey }: { conflicts: Conflict[]; onResolve: (id: string, plan: "A" | "B") => Promise<void>; busyKey: string | null }) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="glass overflow-hidden h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-brand-800/20 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-900">Active Conflicts</h2>
            <p className="text-sm text-brand-800">{conflicts.length} detected issues</p>
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-auto border-t border-brand-700/10">
        {conflicts.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-800/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-brand-700" />
            </div>
            <p className="text-brand-800 font-medium">All systems operational</p>
            <p className="text-sm text-brand-700 mt-1">No conflicts detected</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="surface p-5 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(conflict.severity)}`}></div>
                      <div className="text-xs font-bold text-brand-800 uppercase tracking-wider">
                        {conflict.severity}
                      </div>
                    </div>
                    <h4 className="font-bold text-brand-900 mb-1">{conflict.ruleType}</h4>
                    <div className="flex items-center space-x-2 text-xs text-brand-800">
                      <Train className="w-3 h-3" />
                      <span>Trains: {conflict.trains.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onResolve(conflict.id, "A")}
                    disabled={busyKey === conflict.id + "A"}
                    className="uv-action-button"
                  >
                    {busyKey === conflict.id + "A" ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-brand-800 border-t-transparent rounded-full animate-spin"></div>
                        <span>Solving...</span>
                      </div>
                    ) : (
                      <span>Resolve with Plan A</span>
                    )}
                  </button>
                  <button
                    onClick={() => onResolve(conflict.id, "B")}
                    disabled={busyKey === conflict.id + "B"}
                    className="uv-action-button"
                  >
                    {busyKey === conflict.id + "B" ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-brand-800 border-t-transparent rounded-full animate-spin"></div>
                        <span>Solving...</span>
                      </div>
                    ) : (
                      <span>Resolve with Plan B</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}