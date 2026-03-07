"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// ─── types ────────────────────────────────────────────────────────────────────

interface MapProject {
  id: string;
  name: string;
  code: string;
  status: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface Props {
  projects: MapProject[];
}

// ─── status colours ───────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  planning: "#71717a",
  in_progress: "#f59e0b",
  review: "#3b82f6",
  completed: "#10b981",
  on_hold: "#f97316",
};

const statusLabel: Record<string, string> = {
  planning: "Planificación",
  in_progress: "En progreso",
  review: "Revisión",
  completed: "Completado",
  on_hold: "En pausa",
};

// ─── custom div icon ──────────────────────────────────────────────────────────

function makeIcon(status: string) {
  const color = statusColor[status] ?? "#71717a";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z"
        fill="${color}" fill-opacity="0.9"/>
      <circle cx="16" cy="16" r="7" fill="white" fill-opacity="0.25"/>
      <circle cx="16" cy="16" r="4" fill="white"/>
    </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

// ─── fit bounds on mount ──────────────────────────────────────────────────────

function FitBounds({ projects }: { projects: MapProject[] }) {
  const map = useMap();
  useEffect(() => {
    const pts = projects
      .filter((p) => p.latitude != null && p.longitude != null)
      .map((p) => [p.latitude!, p.longitude!] as [number, number]);
    if (pts.length > 1) {
      map.fitBounds(pts, { padding: [60, 60] });
    } else if (pts.length === 1) {
      map.setView(pts[0], 12);
    }
  }, [map, projects]);
  return null;
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ProjectMap({ projects }: Props) {
  const validProjects = projects.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  return (
    <MapContainer
      center={[37.1773, -3.5986]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      <FitBounds projects={validProjects} />

      {validProjects.map((project) => (
        <Marker
          key={project.id}
          position={[project.latitude!, project.longitude!]}
          icon={makeIcon(project.status)}
        >
          <Popup minWidth={220}>
            <div className="p-3">
              <p className="text-[10px] text-zinc-400 font-mono mb-1">{project.code}</p>
              <p className="text-white font-semibold text-sm leading-snug mb-1">{project.name}</p>
              {project.location && (
                <p className="text-zinc-400 text-xs mb-2">{project.location}</p>
              )}
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: statusColor[project.status] ?? "#71717a",
                    background: (statusColor[project.status] ?? "#71717a") + "22",
                  }}
                >
                  {statusLabel[project.status] ?? project.status}
                </span>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  Ver →
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
