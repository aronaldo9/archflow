/**
 * Seed script — adds sample documents to existing projects.
 * Uses raw SQL because the Prisma client may not yet include the Document model
 * (known issue: prisma generate blocked by DLL lock when dev server is running).
 * Run: npx tsx prisma/seed-documents.ts
 */

import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Minimal valid PDF (~220 bytes) — just enough for a real PDF header
const PLACEHOLDER_PDF = Buffer.from(
  "%PDF-1.0\n" +
  "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
  "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
  "3 0 obj<</Type/Page/MediaBox[0 0 595 842]>>endobj\n" +
  "xref\n0 4\n" +
  "0000000000 65535 f \n" +
  "0000000009 00000 n \n" +
  "0000000058 00000 n \n" +
  "0000000115 00000 n \n" +
  "trailer<</Size 4/Root 1 0 R>>\n" +
  "startxref\n195\n%%EOF\n"
);

// Documents per project: 3–5 entries, realistic architecture document names
const PROJECT_DOCS: Record<string, { name: string; date: string }[]> = {
  "p-001": [
    { name: "Memoria descriptiva.pdf",        date: "2024-03-10" },
    { name: "Planos de ejecución.pdf",         date: "2024-04-22" },
    { name: "Presupuesto detallado.pdf",       date: "2024-05-15" },
    { name: "Estudio geotécnico.pdf",          date: "2024-06-01" },
  ],
  "p-002": [
    { name: "Memoria descriptiva.pdf",         date: "2024-01-18" },
    { name: "Planos de ejecución.pdf",         date: "2024-02-05" },
    { name: "Licencia de obra.pdf",            date: "2024-03-12" },
    { name: "Pliego de condiciones.pdf",       date: "2024-03-30" },
    { name: "Estudio de seguridad y salud.pdf",date: "2024-04-08" },
  ],
  "p-003": [
    { name: "Memoria descriptiva.pdf",         date: "2023-09-05" },
    { name: "Mediciones y presupuesto.pdf",    date: "2023-10-14" },
    { name: "Estudio de seguridad y salud.pdf",date: "2023-11-22" },
  ],
  "p-004": [
    { name: "Memoria descriptiva.pdf",         date: "2023-06-01" },
    { name: "Planos de ejecución.pdf",         date: "2023-07-15" },
    { name: "Mediciones y presupuesto.pdf",    date: "2023-08-20" },
    { name: "Estudio geotécnico.pdf",          date: "2023-09-03" },
    { name: "Pliego de condiciones.pdf",       date: "2023-09-18" },
  ],
  "p-005": [
    { name: "Memoria descriptiva.pdf",         date: "2024-07-10" },
    { name: "Planos de ejecución.pdf",         date: "2024-08-01" },
    { name: "Presupuesto detallado.pdf",       date: "2024-08-25" },
  ],
  "p-006": [
    { name: "Memoria descriptiva.pdf",         date: "2023-11-05" },
    { name: "Planos de ejecución.pdf",         date: "2023-12-10" },
    { name: "Licencia de obra.pdf",            date: "2024-01-20" },
    { name: "Estudio de seguridad y salud.pdf",date: "2024-02-14" },
  ],
  "p-007": [
    { name: "Memoria descriptiva.pdf",         date: "2022-05-12" },
    { name: "Planos de ejecución.pdf",         date: "2022-06-30" },
    { name: "Mediciones y presupuesto.pdf",    date: "2022-08-05" },
    { name: "Pliego de condiciones.pdf",       date: "2022-09-01" },
  ],
  "p-008": [
    { name: "Memoria descriptiva.pdf",         date: "2024-09-15" },
    { name: "Presupuesto detallado.pdf",       date: "2024-10-02" },
    { name: "Estudio geotécnico.pdf",          date: "2024-10-20" },
    { name: "Estudio de seguridad y salud.pdf",date: "2024-11-08" },
  ],
  "p-009": [
    { name: "Memoria descriptiva.pdf",         date: "2024-11-01" },
    { name: "Planos de ejecución.pdf",         date: "2024-11-20" },
    { name: "Licencia de obra.pdf",            date: "2024-12-05" },
    { name: "Estudio de seguridad y salud.pdf",date: "2025-01-10" },
  ],
};

function makeId(projectId: string, index: number): string {
  const base = `${projectId}-doc-${String(index).padStart(2, "0")}`;
  return base;
}

async function main() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Clear existing documents first to avoid duplicates on re-run
  await prisma.$executeRaw`DELETE FROM "Document"`;
  console.log("Cleared existing documents.");

  let total = 0;

  for (const [projectId, docs] of Object.entries(PROJECT_DOCS)) {
    for (let i = 0; i < docs.length; i++) {
      const { name, date } = docs[i];
      const id = makeId(projectId, i + 1);
      const safeName = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const fileName = `${projectId}-${String(i + 1).padStart(2, "0")}-${safeName}`;
      const filePath = path.join(uploadDir, fileName);
      const fileUrl = `/uploads/${fileName}`;
      const uploadedAt = new Date(date).toISOString();

      // Write the placeholder PDF file
      await writeFile(filePath, PLACEHOLDER_PDF);

      // Insert the Document row via raw SQL
      await prisma.$executeRaw`
        INSERT INTO "Document" (id, name, fileUrl, uploadedAt, projectId)
        VALUES (${id}, ${name}, ${fileUrl}, ${uploadedAt}, ${projectId})
      `;

      total++;
      console.log(`  [${projectId}] ${name}`);
    }
  }

  console.log(`\nDone — ${total} documents seeded across ${Object.keys(PROJECT_DOCS).length} projects.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
