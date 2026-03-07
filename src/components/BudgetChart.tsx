"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

// ─── types ────────────────────────────────────────────────────────────────────

interface ProjectBudget {
  name: string;
  code: string;
  budget: number;
  spent: number;
  remaining: number;
}

interface Totals {
  budget: number;
  spent: number;
  remaining: number;
}

interface Props {
  projects: ProjectBudget[];
  totals: Totals;
}

// ─── bar chart tooltip ────────────────────────────────────────────────────────

function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const spent = payload.find((p) => p.dataKey === "spent")?.value ?? 0;
  const remaining = payload.find((p) => p.dataKey === "remaining")?.value ?? 0;
  const budget = spent + remaining;
  const utilPct = budget > 0 ? ((spent / budget) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs shadow-2xl min-w-[180px] pointer-events-none">
      <p className="text-zinc-300 font-semibold mb-2.5 text-sm">{label}</p>
      <div className="space-y-1.5">
        <Row dot="bg-amber-400" label="Gastado" value={formatCurrency(spent)} />
        <Row dot="bg-zinc-500" label="Restante" value={formatCurrency(remaining)} />
        <div className="border-t border-zinc-700/60 my-2" />
        <Row dot="bg-zinc-600" label="Total" value={formatCurrency(budget)} />
        <p className="text-zinc-500 pt-0.5">{utilPct}% utilizado</p>
      </div>
    </div>
  );
}

function Row({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="flex items-center gap-1.5 text-zinc-400">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        {label}
      </span>
      <span className="text-zinc-200 font-medium tabular-nums">{value}</span>
    </div>
  );
}

// ─── donut center label ───────────────────────────────────────────────────────

function DonutCenter({
  viewBox,
  utilPct,
}: {
  viewBox?: { cx: number; cy: number };
  utilPct: number;
}) {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize={22}
        fontWeight={600}
        fontFamily="inherit"
      >
        {utilPct}%
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#71717a"
        fontSize={11}
        fontFamily="inherit"
      >
        utilizado
      </text>
    </g>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function BudgetChart({ projects, totals }: Props) {
  const utilPct =
    totals.budget > 0 ? Math.round((totals.spent / totals.budget) * 100) : 0;

  const donutData = [
    { name: "Spent", value: totals.spent },
    { name: "Remaining", value: totals.remaining },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ── Stacked bar chart ── */}
      <div className="flex-1 min-w-0">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-4">
          Presupuesto por Proyecto
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={projects}
            margin={{ top: 4, right: 4, left: 8, bottom: 40 }}
            barSize={28}
          >
            <CartesianGrid
              vertical={false}
              stroke="#27272a"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="code"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
              height={48}
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(v)}
              tick={{ fill: "#52525b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              content={(props) => (
                <BarTooltip
                  active={props.active}
                  payload={props.payload as { value: number; dataKey: string }[]}
                  label={props.label as string}
                />
              )}
              cursor={{ fill: "#ffffff08" }}
            />
            <Bar dataKey="spent" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Spent" />
            <Bar dataKey="remaining" stackId="a" fill="#3f3f46" radius={[3, 3, 0, 0]} name="Remaining" />
          </BarChart>
        </ResponsiveContainer>

        {/* Bar legend */}
        <div className="flex items-center gap-5 mt-1 px-1">
          <LegendDot color="bg-amber-400" label="Gastado" />
          <LegendDot color="bg-zinc-600" label="Restante" />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="hidden lg:block w-px bg-zinc-700/50 self-stretch" />

      {/* ── Donut + summary ── */}
      <div className="lg:w-60 flex flex-col items-center gap-4">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider self-start">
          Asignación Total
        </p>

        {/* Donut */}
        <div className="relative w-full">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={false}
              >
                <Cell fill="#f59e0b" />
                <Cell fill="#27272a" />
                <Label
                  content={(props) => (
                    <DonutCenter
                      viewBox={props.viewBox as { cx: number; cy: number }}
                      utilPct={utilPct}
                    />
                  )}
                  position="center"
                />
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const { name, value } = payload[0];
                  return (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none">
                      <p className="text-zinc-400 mb-0.5">{name}</p>
                      <p className="text-white font-semibold">{formatCurrency(Number(value))}</p>
                    </div>
                  );
                }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary rows */}
        <div className="w-full space-y-2.5 border-t border-zinc-700/50 pt-4">
          <SummaryRow
            dot="bg-amber-400"
            label="Total Gastado"
            value={formatCurrency(totals.spent)}
            valueClass="text-amber-400"
          />
          <SummaryRow
            dot="bg-zinc-600"
            label="Restante"
            value={formatCurrency(totals.remaining)}
            valueClass="text-emerald-400"
          />
          <SummaryRow
            dot="bg-zinc-700 ring-1 ring-zinc-500"
            label="Presupuesto Total"
            value={formatCurrency(totals.budget)}
            valueClass="text-white"
          />
        </div>
      </div>
    </div>
  );
}

// ─── small helpers ────────────────────────────────────────────────────────────

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );
}

function SummaryRow({
  dot,
  label,
  value,
  valueClass,
}: {
  dot: string;
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-zinc-400">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
        {label}
      </span>
      <span className={`font-semibold tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}
