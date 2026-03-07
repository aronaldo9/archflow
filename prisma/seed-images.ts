/**
 * Seed script — generates SVG placeholder images (renders, planos, obra) per project.
 * Run: npx tsx prisma/seed-images.ts
 */

import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// ─── Palettes ────────────────────────────────────────────────────────────────

interface Palette {
  sky1: string; sky2: string;
  accent: string; accentDark: string;
  building: string; buildingShade: string;
  ground: string; groundLight: string;
  window: string;
}

const PALETTES: Record<string, Palette> = {
  "p-001": { sky1: "#0f2544", sky2: "#2e6091", accent: "#3b82f6", accentDark: "#1d4ed8", building: "#cdc8c2", buildingShade: "#a8a39d", ground: "#1a2e1a", groundLight: "#2a4a2a", window: "#b8d4f0" },
  "p-002": { sky1: "#2d1400", sky2: "#7a4200", accent: "#f59e0b", accentDark: "#b45309", building: "#e8dfd4", buildingShade: "#c8bfb4", ground: "#1a150a", groundLight: "#2e2414", window: "#fde68a" },
  "p-003": { sky1: "#18103a", sky2: "#3d2880", accent: "#8b5cf6", accentDark: "#6d28d9", building: "#d8d4e8", buildingShade: "#b8b4c8", ground: "#120e20", groundLight: "#201a38", window: "#c4b5fd" },
  "p-004": { sky1: "#0a1f0a", sky2: "#1a4f1a", accent: "#10b981", accentDark: "#059669", building: "#d4e8d4", buildingShade: "#b4c8b4", ground: "#081408", groundLight: "#102810", window: "#6ee7b7" },
  "p-005": { sky1: "#08182a", sky2: "#0f4070", accent: "#0ea5e9", accentDark: "#0369a1", building: "#ccd8e8", buildingShade: "#aabac8", ground: "#081018", groundLight: "#101e2e", window: "#7dd3fc" },
  "p-006": { sky1: "#250808", sky2: "#601a1a", accent: "#ef4444", accentDark: "#b91c1c", building: "#e8d0d0", buildingShade: "#c8b0b0", ground: "#180808", groundLight: "#2a1010", window: "#fca5a5" },
  "p-007": { sky1: "#141414", sky2: "#383838", accent: "#a1a1aa", accentDark: "#71717a", building: "#ddd8d4", buildingShade: "#bdb8b4", ground: "#101010", groundLight: "#242424", window: "#d4d4d8" },
  "p-008": { sky1: "#1c1400", sky2: "#503c00", accent: "#eab308", accentDark: "#a16207", building: "#e8e0cc", buildingShade: "#c8c0ac", ground: "#140e00", groundLight: "#261c00", window: "#fef08a" },
  "p-009": { sky1: "#1e0a00", sky2: "#582400", accent: "#f97316", accentDark: "#c2410c", building: "#f0e8e0", buildingShade: "#d0c8c0", ground: "#140800", groundLight: "#281400", window: "#fed7aa" },
};

const PROJECT_NAMES: Record<string, string> = {
  "p-001": "Hospital de Día Armilla",
  "p-002": "Centro Educativo Maracena",
  "p-003": "Biblioteca Municipal Albolote",
  "p-004": "Residencia La Zubia",
  "p-005": "Parque Empresarial Ogíjares",
  "p-006": "Centro Deportivo Huétor Vega",
  "p-007": "Rehabilitación Casco Histórico Granada",
  "p-008": "Polígono Industrial Santa Fe",
  "p-009": "Vivienda Unifamiliar Churriana",
};

// ─── SVG Generators ──────────────────────────────────────────────────────────

function svgRenderExterior(p: Palette, name: string, variant: number): string {
  const bx = [120, 100, 140][variant % 3];
  const bw = [560, 580, 540][variant % 3];
  const bh = [200, 220, 190][variant % 3];
  const by = 160;
  const cols = [8, 7, 9][variant % 3];
  const rows = [5, 6, 5][variant % 3];
  const ww = 34; const wh = 22;
  const gapX = (bw - 60) / cols;
  const gapY = (bh - 40) / rows;

  const windows = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) =>
      `<rect x="${bx + 30 + c * gapX}" y="${by + 20 + r * gapY}" width="${ww}" height="${wh}" fill="${p.window}" rx="2" opacity="0.85"/>`
    ).join("")
  ).join("");

  const stars = Array.from({ length: 18 }, (_, i) =>
    `<circle cx="${30 + i * 44}" cy="${15 + (i % 5) * 12}" r="1" fill="white" opacity="${0.4 + (i % 3) * 0.2}"/>`
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.sky1}"/>
      <stop offset="70%" stop-color="${p.sky2}"/>
      <stop offset="100%" stop-color="${p.sky2}"/>
    </linearGradient>
    <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.building}"/>
      <stop offset="100%" stop-color="${p.buildingShade}"/>
    </linearGradient>
    <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.groundLight}"/>
      <stop offset="100%" stop-color="${p.ground}"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
  </defs>

  <rect width="800" height="500" fill="url(#sky)"/>
  ${stars}

  <rect x="0" y="${by + bh}" width="800" height="${500 - by - bh}" fill="url(#gnd)"/>

  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#bld)" filter="url(#shadow)"/>
  <rect x="${bx}" y="${by}" width="48" height="${bh}" fill="${p.accent}" opacity="0.75"/>
  <rect x="${bx + bw - 6}" y="${by}" width="6" height="${bh}" fill="${p.accentDark}" opacity="0.6"/>

  ${windows}

  <rect x="${bx}" y="${by + bh - 2}" width="${bw}" height="8" fill="${p.accentDark}" opacity="0.5"/>
  <rect x="${bx - 6}" y="${by + bh}" width="${bw + 12}" height="10" fill="rgba(0,0,0,0.35)"/>

  <ellipse cx="68" cy="${by + bh - 10}" rx="48" ry="48" fill="${p.ground}"/>
  <circle cx="68" cy="${by + bh - 58}" r="48" fill="#1a3a1a" opacity="0.9"/>
  <rect x="64" y="${by + bh - 20}" width="8" height="20" fill="#2a1a08"/>

  <ellipse cx="738" cy="${by + bh - 8}" rx="38" ry="38" fill="${p.ground}"/>
  <circle cx="738" cy="${by + bh - 46}" r="38" fill="#1a3a1a" opacity="0.9"/>
  <rect x="735" y="${by + bh - 16}" width="6" height="16" fill="#2a1a08"/>

  <rect x="0" y="0" width="220" height="38" fill="rgba(0,0,0,0.55)"/>
  <text x="14" y="25" fill="white" font-family="system-ui,ui-sans-serif,sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">RENDER EXTERIOR</text>

  <rect x="0" y="462" width="800" height="38" fill="rgba(0,0,0,0.55)"/>
  <text x="14" y="485" fill="rgba(255,255,255,0.65)" font-family="system-ui,ui-sans-serif,sans-serif" font-size="12">${name}</text>
  <rect x="${800 - 12}" y="462" width="12" height="38" fill="${p.accent}" opacity="0.8"/>
</svg>`;
}

function svgPlantaBaja(p: Palette, name: string, variant: number): string {
  const layouts = [
    // Layout A — cross corridor
    `<rect x="100" y="80" width="600" height="340" fill="none" stroke="#1a1a1a" stroke-width="5"/>
     <line x1="100" y1="260" x2="500" y2="260" stroke="#1a1a1a" stroke-width="4"/>
     <line x1="400" y1="80" x2="400" y2="420" stroke="#1a1a1a" stroke-width="4"/>
     <line x1="400" y1="175" x2="700" y2="175" stroke="#1a1a1a" stroke-width="3"/>
     <rect x="102" y="262" width="296" height="156" fill="${p.accent}" opacity="0.07"/>
     <rect x="402" y="177" width="296" height="96" fill="${p.accentDark}" opacity="0.06"/>
     <path d="M 220 260 A 50 50 0 0 1 220 160" fill="none" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3"/>
     <line x1="100" y1="80" x2="400" y2="80" stroke="#1a1a1a" stroke-width="5"/>
     <rect x="235" y="415" width="80" height="5" fill="${p.accent}"/>`,

    // Layout B — L-shape with central hall
    `<rect x="80" y="100" width="440" height="300" fill="none" stroke="#1a1a1a" stroke-width="5"/>
     <rect x="520" y="180" width="200" height="200" fill="none" stroke="#1a1a1a" stroke-width="5"/>
     <line x1="80" y1="220" x2="520" y2="220" stroke="#1a1a1a" stroke-width="4"/>
     <line x1="240" y1="100" x2="240" y2="400" stroke="#1a1a1a" stroke-width="3"/>
     <rect x="82" y="222" width="156" height="176" fill="${p.accent}" opacity="0.07"/>
     <path d="M 320 220 A 60 60 0 0 1 320 100" fill="none" stroke="#777" stroke-width="1.5" stroke-dasharray="4,3"/>
     <rect x="80" y="380" width="100" height="5" fill="${p.accent}"/>`,

    // Layout C — open plan with core
    `<rect x="90" y="70" width="620" height="360" fill="none" stroke="#1a1a1a" stroke-width="5"/>
     <rect x="300" y="180" width="200" height="130" fill="none" stroke="#1a1a1a" stroke-width="3"/>
     <line x1="90" y1="200" x2="300" y2="200" stroke="#1a1a1a" stroke-width="3"/>
     <line x1="500" y1="200" x2="710" y2="200" stroke="#1a1a1a" stroke-width="3"/>
     <line x1="90" y1="310" x2="300" y2="310" stroke="#1a1a1a" stroke-width="3"/>
     <line x1="500" y1="310" x2="710" y2="310" stroke="#1a1a1a" stroke-width="3"/>
     <rect x="302" y="182" width="196" height="126" fill="${p.accent}" opacity="0.1"/>
     <path d="M 180 200 A 45 45 0 0 1 180 110" fill="none" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3"/>
     <rect x="380" y="65" width="70" height="5" fill="${p.accent}"/>`,
  ];

  const gridLines =
    Array.from({ length: 20 }, (_, i) =>
      `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="500" stroke="#dedad5" stroke-width="0.5"/>`
    ).join("") +
    Array.from({ length: 13 }, (_, i) =>
      `<line x1="0" y1="${i * 40}" x2="800" y2="${i * 40}" stroke="#dedad5" stroke-width="0.5"/>`
    ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#f4f2ed"/>
  ${gridLines}

  ${layouts[variant % 3]}

  <g transform="translate(730,90)">
    <circle cx="0" cy="0" r="28" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M0,-22 L7,12 L0,5 L-7,12 Z" fill="${p.accent}"/>
    <path d="M0,22 L7,-12 L0,-5 L-7,-12 Z" fill="#bbb"/>
    <text x="0" y="-28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#333">N</text>
  </g>

  <rect x="80" y="440" width="260" height="1.5" fill="#555"/>
  <text x="80" y="455" font-family="system-ui,sans-serif" font-size="10" fill="#555">0    5   10   20 m</text>
  <line x1="80" y1="440" x2="80" y2="446" stroke="#555" stroke-width="1.5"/>
  <line x1="130" y1="440" x2="130" y2="444" stroke="#555" stroke-width="1"/>
  <line x1="180" y1="440" x2="180" y2="444" stroke="#555" stroke-width="1"/>
  <line x1="280" y1="440" x2="280" y2="446" stroke="#555" stroke-width="1.5"/>

  <rect x="0" y="0" width="200" height="38" fill="${p.accent}" opacity="0.88"/>
  <text x="14" y="25" fill="white" font-family="system-ui,ui-sans-serif,sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">PLANTA BAJA</text>

  <text x="800" y="490" text-anchor="end" font-family="system-ui,sans-serif" font-size="10" fill="#999">${name}  |  E 1:100</text>
</svg>`;
}

function svgVistaObra(p: Palette, name: string, variant: number): string {
  const offsets = [0, 30, -20][variant % 3];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b8afa0"/>
      <stop offset="100%" stop-color="#8a8070"/>
    </linearGradient>
    <linearGradient id="concrete" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c0b8b0"/>
      <stop offset="100%" stop-color="#989088"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#908880"/>
      <stop offset="100%" stop-color="#706860"/>
    </linearGradient>
    <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>

  <rect width="800" height="280" fill="url(#sky)"/>
  <rect y="280" width="800" height="220" fill="url(#floor)"/>

  <rect x="${80 + offsets}" y="40" width="50" height="400" fill="url(#concrete)" stroke="#888" stroke-width="1"/>
  <rect x="${290 + offsets}" y="40" width="50" height="400" fill="url(#concrete)" stroke="#888" stroke-width="1"/>
  <rect x="${500 + offsets}" y="40" width="50" height="400" fill="url(#concrete)" stroke="#888" stroke-width="1"/>
  <rect x="${680 + offsets}" y="40" width="50" height="400" fill="url(#concrete)" stroke="#888" stroke-width="1"/>

  <rect x="${60 + offsets}" y="120" width="690" height="28" fill="url(#concrete)" stroke="#888" stroke-width="1"/>
  <rect x="${60 + offsets}" y="230" width="690" height="28" fill="url(#concrete)" stroke="#888" stroke-width="1"/>
  <rect x="${60 + offsets}" y="340" width="690" height="28" fill="url(#concrete)" stroke="#888" stroke-width="1"/>

  <line x1="${175 + offsets}" y1="40" x2="${175 + offsets}" y2="440" stroke="#e0a030" stroke-width="3.5" opacity="0.85"/>
  <line x1="${390 + offsets}" y1="40" x2="${390 + offsets}" y2="440" stroke="#e0a030" stroke-width="3.5" opacity="0.85"/>
  <line x1="${600 + offsets}" y1="40" x2="${600 + offsets}" y2="440" stroke="#e0a030" stroke-width="3.5" opacity="0.85"/>

  <line x1="${155 + offsets}" y1="80" x2="${625 + offsets}" y2="80" stroke="#e0a030" stroke-width="2.5" opacity="0.85"/>
  <line x1="${155 + offsets}" y1="190" x2="${625 + offsets}" y2="190" stroke="#e0a030" stroke-width="2.5" opacity="0.85"/>
  <line x1="${155 + offsets}" y1="300" x2="${625 + offsets}" y2="300" stroke="#e0a030" stroke-width="2.5" opacity="0.85"/>

  <ellipse cx="220" cy="445" rx="80" ry="18" fill="#5a5248" opacity="0.7"/>
  <ellipse cx="580" cy="448" rx="65" ry="14" fill="#5a5248" opacity="0.6"/>
  <rect x="150" y="430" width="140" height="15" fill="#4a4640"/>
  <rect x="500" y="435" width="110" height="12" fill="#4a4640"/>

  <rect x="740" y="0" width="14" height="500" fill="${p.accent}" opacity="0.7"/>
  <rect x="720" y="90" width="80" height="10" fill="${p.accent}" opacity="0.7"/>
  <rect x="720" y="200" width="80" height="10" fill="${p.accent}" opacity="0.5"/>
  <rect x="720" y="310" width="80" height="10" fill="${p.accent}" opacity="0.5"/>

  <rect width="800" height="500" fill="rgba(165,148,128,0.12)"/>

  <rect x="0" y="0" width="200" height="38" fill="rgba(0,0,0,0.6)"/>
  <text x="14" y="25" fill="white" font-family="system-ui,ui-sans-serif,sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">VISTA DE OBRA</text>

  <rect x="0" y="462" width="800" height="38" fill="rgba(0,0,0,0.55)"/>
  <text x="14" y="485" fill="rgba(255,255,255,0.65)" font-family="system-ui,ui-sans-serif,sans-serif" font-size="12">${name}</text>
  <rect x="${800 - 12}" y="462" width="12" height="38" fill="${p.accent}" opacity="0.8"/>
</svg>`;
}

function svgAlzado(p: Palette, name: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#f8f6f2"/>

  ${Array.from({ length: 20 }, (_, i) =>
    `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="500" stroke="#e8e4de" stroke-width="0.5"/>`
  ).join("")}
  ${Array.from({ length: 13 }, (_, i) =>
    `<line x1="0" y1="${i * 40}" x2="800" y2="${i * 40}" stroke="#e8e4de" stroke-width="0.5"/>`
  ).join("")}

  <line x1="60" y1="380" x2="740" y2="380" stroke="#333" stroke-width="2"/>

  <rect x="100" y="140" width="600" height="240" fill="#e0dcd6" stroke="#1a1a1a" stroke-width="3"/>
  <rect x="100" y="140" width="60" height="240" fill="${p.accent}" opacity="0.7"/>
  <rect x="640" y="140" width="60" height="240" fill="${p.accentDark}" opacity="0.5"/>

  ${Array.from({ length: 5 }, (_, col) =>
    Array.from({ length: 4 }, (_, row) =>
      `<rect x="${185 + col * 90}" y="${165 + row * 52}" width="52" height="36" fill="${p.window}" rx="2" stroke="${p.accentDark}" stroke-width="1" opacity="0.9"/>`
    ).join("")
  ).join("")}

  <rect x="320" y="310" width="80" height="70" fill="#c8c0b8" stroke="#333" stroke-width="2"/>
  <line x1="360" y1="310" x2="360" y2="380" stroke="#555" stroke-width="1"/>

  <line x1="40" y1="140" x2="60" y2="140" stroke="#555" stroke-width="1.5"/>
  <line x1="40" y1="380" x2="60" y2="380" stroke="#555" stroke-width="1.5"/>
  <line x1="50" y1="140" x2="50" y2="380" stroke="#555" stroke-width="1.5"/>
  <text x="10" y="265" font-family="system-ui,sans-serif" font-size="10" fill="#555" transform="rotate(-90,10,265)">7.50 m</text>

  <line x1="100" y1="400" x2="100" y2="420" stroke="#555" stroke-width="1.5"/>
  <line x1="700" y1="400" x2="700" y2="420" stroke="#555" stroke-width="1.5"/>
  <line x1="100" y1="410" x2="700" y2="410" stroke="#555" stroke-width="1.5"/>
  <text x="370" y="435" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#555">25.00 m</text>

  <rect x="0" y="0" width="220" height="38" fill="${p.accent}" opacity="0.88"/>
  <text x="14" y="25" fill="white" font-family="system-ui,ui-sans-serif,sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">ALZADO PRINCIPAL</text>

  <text x="790" y="490" text-anchor="end" font-family="system-ui,sans-serif" font-size="10" fill="#999">${name}  |  E 1:100</text>
</svg>`;
}

// ─── Project image assignments ────────────────────────────────────────────────

const PROJECT_IMAGES: Record<string, { label: string; fn: (p: Palette, n: string, v: number) => string; variant: number }[]> = {
  "p-001": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 0 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 0 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 0 },
    { label: "Alzado principal",  fn: svgAlzado,         variant: 0 },
  ],
  "p-002": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 1 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 1 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 1 },
  ],
  "p-003": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 2 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 2 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 2 },
    { label: "Alzado principal",  fn: svgAlzado,         variant: 0 },
  ],
  "p-004": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 0 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 0 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 1 },
  ],
  "p-005": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 1 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 1 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 0 },
    { label: "Alzado principal",  fn: svgAlzado,         variant: 0 },
  ],
  "p-006": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 2 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 2 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 2 },
  ],
  "p-007": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 0 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 0 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 1 },
    { label: "Alzado principal",  fn: svgAlzado,         variant: 0 },
  ],
  "p-008": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 1 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 1 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 0 },
  ],
  "p-009": [
    { label: "Render exterior",   fn: svgRenderExterior, variant: 2 },
    { label: "Planta baja",       fn: svgPlantaBaja,     variant: 2 },
    { label: "Vista de obra",     fn: svgVistaObra,      variant: 2 },
    { label: "Alzado principal",  fn: svgAlzado,         variant: 0 },
  ],
};

// Dates staggered to look realistic
const IMAGE_DATES: Record<string, string[]> = {
  "p-001": ["2024-05-10", "2024-05-12", "2024-09-20", "2024-05-15"],
  "p-002": ["2024-02-08", "2024-02-10", "2024-06-18"],
  "p-003": ["2023-10-05", "2023-10-08", "2024-01-14", "2023-10-10"],
  "p-004": ["2023-07-20", "2023-07-22", "2023-11-05"],
  "p-005": ["2024-08-15", "2024-08-18", "2025-01-08", "2024-08-20"],
  "p-006": ["2024-01-10", "2024-01-12", "2024-05-22"],
  "p-007": ["2022-07-05", "2022-07-08", "2022-10-15", "2022-07-10"],
  "p-008": ["2024-10-12", "2024-10-15", "2025-02-10"],
  "p-009": ["2024-12-01", "2024-12-04", "2025-03-05", "2024-12-06"],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Remove only existing image rows (by SVG extension in fileUrl)
  await prisma.$executeRaw`DELETE FROM "Document" WHERE fileUrl LIKE '%.svg'`;
  console.log("Cleared existing SVG image records.");

  let total = 0;

  for (const [projectId, images] of Object.entries(PROJECT_IMAGES)) {
    const palette = PALETTES[projectId];
    const projectName = PROJECT_NAMES[projectId];
    const dates = IMAGE_DATES[projectId];

    for (let i = 0; i < images.length; i++) {
      const { label, fn, variant } = images[i];
      const svg = fn(palette, projectName, variant);

      const safeName = label.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const fileName = `${projectId}-img-${String(i + 1).padStart(2, "0")}-${safeName}.svg`;
      const filePath = path.join(uploadDir, fileName);
      const fileUrl = `/uploads/${fileName}`;
      const docName = `${label}.svg`;
      const uploadedAt = new Date(dates[i]).toISOString();
      const id = `${projectId}-img-${String(i + 1).padStart(2, "0")}`;

      await writeFile(filePath, svg, "utf-8");

      await prisma.$executeRaw`
        INSERT INTO "Document" (id, name, fileUrl, uploadedAt, projectId)
        VALUES (${id}, ${docName}, ${fileUrl}, ${uploadedAt}, ${projectId})
      `;

      total++;
      console.log(`  [${projectId}] ${label}`);
    }
  }

  console.log(`\nDone — ${total} images generated across ${Object.keys(PROJECT_IMAGES).length} projects.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
