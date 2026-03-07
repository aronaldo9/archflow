import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();

  // Project 1 — Hospital de Día Armilla
  const p1 = await prisma.project.create({
    data: {
      id: "p-001",
      name: "Hospital de Día Armilla",
      code: "HDA-2024",
      description:
        "Centro sanitario de día de nueva planta en Armilla con consultas especializadas, área de rehabilitación y urgencias menores. El diseño prioriza la accesibilidad universal y los espacios de luz natural.",
      status: "in_progress",
      phase: "construction",
      location: "Armilla, Granada",
      budget: 8500000,
      spent: 3100000,
      progress: 38,
      startDate: new Date("2024-02-01"),
      endDate: new Date("2026-03-31"),
      clientName: "Junta de Andalucía — Salud",
      clientEmail: "obras@juntasalud.es",
      clientPhone: "+34 958 210 400",
      tags: "Sanitario,Público,Accesibilidad",
      latitude: 37.1284,
      longitude: -3.6245,
      createdAt: new Date("2024-01-15"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p1.id, title: "Aprobación del anteproyecto", dueDate: new Date("2024-04-01"), completed: true },
      { projectId: p1.id, title: "Proyecto básico", dueDate: new Date("2024-07-15"), completed: true },
      { projectId: p1.id, title: "Licencia de obras", dueDate: new Date("2024-10-01"), completed: true },
      { projectId: p1.id, title: "Estructura completada", dueDate: new Date("2025-06-01"), completed: false },
      { projectId: p1.id, title: "Acabados e instalaciones", dueDate: new Date("2025-12-01"), completed: false },
      { projectId: p1.id, title: "Recepción de obra", dueDate: new Date("2026-03-31"), completed: false },
    ],
  });

  // Project 2 — Complejo Residencial Las Acacias
  const p2 = await prisma.project.create({
    data: {
      id: "p-002",
      name: "Complejo Residencial Las Acacias",
      code: "CRA-2025",
      description:
        "Promoción residencial de 120 viviendas de protección oficial en Maracena. El conjunto incorpora zonas ajardinadas comunitarias, aparcamiento subterráneo y cubierta verde en los bloques de mayor altura.",
      status: "planning",
      phase: "concept",
      location: "Maracena, Granada",
      budget: 14200000,
      spent: 420000,
      progress: 6,
      startDate: new Date("2025-03-01"),
      endDate: new Date("2027-09-30"),
      clientName: "Promociones Vega Norte S.L.",
      clientEmail: "info@veganorte.es",
      clientPhone: "+34 958 430 120",
      tags: "Residencial,VPO,Sostenible",
      latitude: 37.2147,
      longitude: -3.6264,
      createdAt: new Date("2025-02-10"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p2.id, title: "Estudio de viabilidad", dueDate: new Date("2025-04-30"), completed: true },
      { projectId: p2.id, title: "Anteproyecto", dueDate: new Date("2025-07-31"), completed: false },
      { projectId: p2.id, title: "Proyecto básico y de ejecución", dueDate: new Date("2025-12-01"), completed: false },
      { projectId: p2.id, title: "Inicio de obra", dueDate: new Date("2026-03-01"), completed: false },
    ],
  });

  // Project 3 — Centro Cultural Albolote
  const p3 = await prisma.project.create({
    data: {
      id: "p-003",
      name: "Centro Cultural Albolote",
      code: "CCA-2023",
      description:
        "Centro cultural municipal con sala de exposiciones, auditorio de 350 butacas, biblioteca pública y talleres de artes. La fachada combina cerámica artesanal y celosías de hormigón que homenajean la tradición nazarí.",
      status: "review",
      phase: "design_development",
      location: "Albolote, Granada",
      budget: 5800000,
      spent: 2950000,
      progress: 62,
      startDate: new Date("2023-09-01"),
      endDate: new Date("2025-11-30"),
      clientName: "Ayuntamiento de Albolote",
      clientEmail: "urbanismo@albolote.es",
      clientPhone: "+34 958 465 800",
      tags: "Cultural,Público,Patrimonio",
      latitude: 37.2390,
      longitude: -3.6431,
      createdAt: new Date("2023-08-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p3.id, title: "Concurso de ideas", dueDate: new Date("2023-11-01"), completed: true },
      { projectId: p3.id, title: "Anteproyecto aprobado", dueDate: new Date("2024-02-01"), completed: true },
      { projectId: p3.id, title: "Desarrollo de diseño", dueDate: new Date("2024-07-01"), completed: true },
      { projectId: p3.id, title: "Revisión técnica municipal", dueDate: new Date("2025-02-01"), completed: false },
      { projectId: p3.id, title: "Documentos de construcción", dueDate: new Date("2025-06-01"), completed: false },
    ],
  });

  // Project 4 — Edificio de Oficinas Parque Tecnológico
  const p4 = await prisma.project.create({
    data: {
      id: "p-004",
      name: "Edificio de Oficinas Parque Tecnológico",
      code: "OPT-2024",
      description:
        "Edificio de oficinas de 7 plantas en La Zubia, concebido para empresas tecnológicas. Incorpora sistemas de climatización geotérmica, fachada ventilada fotovoltaica y espacios colaborativos en planta baja abiertos al público.",
      status: "in_progress",
      phase: "construction_docs",
      location: "La Zubia, Granada",
      budget: 9200000,
      spent: 4600000,
      progress: 55,
      startDate: new Date("2024-04-01"),
      endDate: new Date("2026-10-31"),
      clientName: "TechVega Inversiones S.A.",
      clientEmail: "proyectos@techvega.es",
      clientPhone: "+34 958 510 300",
      tags: "Oficinas,Tecnología,LEED",
      latitude: 37.1109,
      longitude: -3.5861,
      createdAt: new Date("2024-03-10"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p4.id, title: "Anteproyecto", dueDate: new Date("2024-06-01"), completed: true },
      { projectId: p4.id, title: "Proyecto básico", dueDate: new Date("2024-09-01"), completed: true },
      { projectId: p4.id, title: "Proyecto de ejecución", dueDate: new Date("2025-01-15"), completed: true },
      { projectId: p4.id, title: "Licencia de obras", dueDate: new Date("2025-04-01"), completed: false },
      { projectId: p4.id, title: "Inicio de cimentación", dueDate: new Date("2025-06-01"), completed: false },
      { projectId: p4.id, title: "Entrega de llaves", dueDate: new Date("2026-10-31"), completed: false },
    ],
  });

  // Project 5 — Centro Logístico Sur
  const p5 = await prisma.project.create({
    data: {
      id: "p-005",
      name: "Centro Logístico Sur",
      code: "CLS-2022",
      description:
        "Gran plataforma logística de 45.000 m² en Ogíjares, con naves de almacenamiento de altura libre, muelles de carga automatizados, oficinas annexas y gestión energética por paneles solares en cubierta.",
      status: "completed",
      phase: "post_construction",
      location: "Ogíjares, Granada",
      budget: 18400000,
      spent: 18100000,
      progress: 100,
      startDate: new Date("2022-05-01"),
      endDate: new Date("2024-08-31"),
      clientName: "LogiSur Granada S.A.",
      clientEmail: "construccion@logisur.es",
      clientPhone: "+34 958 580 700",
      tags: "Logística,Industrial,Fotovoltaica",
      latitude: 37.1192,
      longitude: -3.6208,
      createdAt: new Date("2022-04-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p5.id, title: "Proyecto aprobado", dueDate: new Date("2022-07-01"), completed: true },
      { projectId: p5.id, title: "Cimentación y estructura", dueDate: new Date("2023-02-01"), completed: true },
      { projectId: p5.id, title: "Cerramientos e instalaciones", dueDate: new Date("2023-09-01"), completed: true },
      { projectId: p5.id, title: "Urbanización exterior", dueDate: new Date("2024-04-01"), completed: true },
      { projectId: p5.id, title: "Recepción y puesta en marcha", dueDate: new Date("2024-08-31"), completed: true },
    ],
  });

  // Project 6 — Polideportivo Municipal Huétor Vega
  const p6 = await prisma.project.create({
    data: {
      id: "p-006",
      name: "Polideportivo Municipal Huétor Vega",
      code: "PMH-2025",
      description:
        "Nuevo pabellón polideportivo con piscina cubierta, sala de fitness, pista de atletismo interior y gradas para 800 espectadores. La cubierta laminar de madera laminada cruzada (CLT) es la solución estructural principal.",
      status: "planning",
      phase: "schematic",
      location: "Huétor Vega, Granada",
      budget: 6100000,
      spent: 380000,
      progress: 12,
      startDate: new Date("2025-01-15"),
      endDate: new Date("2027-06-30"),
      clientName: "Ayuntamiento de Huétor Vega",
      clientEmail: "deportes@huetorvega.es",
      clientPhone: "+34 958 300 200",
      tags: "Deportivo,Público,CLT",
      latitude: 37.1383,
      longitude: -3.5783,
      createdAt: new Date("2025-01-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p6.id, title: "Estudio previo y programa de necesidades", dueDate: new Date("2025-03-01"), completed: true },
      { projectId: p6.id, title: "Diseño esquemático", dueDate: new Date("2025-06-30"), completed: false },
      { projectId: p6.id, title: "Anteproyecto", dueDate: new Date("2025-10-01"), completed: false },
      { projectId: p6.id, title: "Proyecto de ejecución", dueDate: new Date("2026-04-01"), completed: false },
      { projectId: p6.id, title: "Inicio de obra", dueDate: new Date("2026-07-01"), completed: false },
    ],
  });

  // Project 7 — Residencia de Estudiantes UGR
  const p7 = await prisma.project.create({
    data: {
      id: "p-007",
      name: "Residencia de Estudiantes UGR",
      code: "REU-2024",
      description:
        "Residencia universitaria de 280 habitaciones en el Campus de la Salud de Granada. El edificio se organiza en torno a un patio central bioclimático con zonas de estudio, comedor, sala de reuniones y acceso directo a los centros de salud.",
      status: "in_progress",
      phase: "construction",
      location: "Granada",
      budget: 11300000,
      spent: 6200000,
      progress: 58,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2026-07-31"),
      clientName: "Universidad de Granada",
      clientEmail: "infraestructuras@ugr.es",
      clientPhone: "+34 958 243 000",
      tags: "Universitario,Residencial,Bioclimático",
      latitude: 37.1787,
      longitude: -3.6097,
      createdAt: new Date("2023-11-20"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p7.id, title: "Concurso restringido", dueDate: new Date("2023-12-15"), completed: true },
      { projectId: p7.id, title: "Anteproyecto aprobado", dueDate: new Date("2024-03-01"), completed: true },
      { projectId: p7.id, title: "Licencia de obras concedida", dueDate: new Date("2024-06-01"), completed: true },
      { projectId: p7.id, title: "Estructura y cubierta", dueDate: new Date("2025-03-01"), completed: true },
      { projectId: p7.id, title: "Instalaciones y acabados", dueDate: new Date("2025-12-01"), completed: false },
      { projectId: p7.id, title: "Equipamiento y entrega", dueDate: new Date("2026-07-31"), completed: false },
    ],
  });

  // Project 8 — Casa Consistorial Santa Fe
  const p8 = await prisma.project.create({
    data: {
      id: "p-008",
      name: "Casa Consistorial Santa Fe",
      code: "CSF-2024",
      description:
        "Rehabilitación integral y ampliación del edificio del Ayuntamiento de Santa Fe, declarado Bien de Interés Cultural. El proyecto compatibiliza la restauración de elementos históricos con la inserción de un ala contemporánea de acceso.",
      status: "on_hold",
      phase: "design_development",
      location: "Santa Fe, Granada",
      budget: 4700000,
      spent: 680000,
      progress: 20,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2026-12-31"),
      clientName: "Ayuntamiento de Santa Fe",
      clientEmail: "secretaria@santafe.es",
      clientPhone: "+34 958 440 150",
      tags: "Patrimonio,Rehabilitación,BIC",
      latitude: 37.1859,
      longitude: -3.7208,
      createdAt: new Date("2024-05-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p8.id, title: "Estudio histórico-artístico", dueDate: new Date("2024-08-01"), completed: true },
      { projectId: p8.id, title: "Anteproyecto", dueDate: new Date("2024-10-01"), completed: false },
      { projectId: p8.id, title: "Informe Consejería de Cultura", dueDate: new Date("2025-02-01"), completed: false },
      { projectId: p8.id, title: "Proyecto de ejecución", dueDate: new Date("2025-07-01"), completed: false },
    ],
  });

  // Project 9 — Centro de Salud Churriana de la Vega
  const p9 = await prisma.project.create({
    data: {
      id: "p-009",
      name: "Centro de Salud Churriana de la Vega",
      code: "CSC-2023",
      description:
        "Nuevo centro de salud de atención primaria en Churriana de la Vega para dar servicio a 18.000 habitantes. El programa incluye consultas médicas, pediatría, enfermería, sala de extracciones, fisioterapia y urgencias de guardia.",
      status: "review",
      phase: "construction_docs",
      location: "Churriana de la Vega, Granada",
      budget: 7600000,
      spent: 5200000,
      progress: 72,
      startDate: new Date("2023-11-01"),
      endDate: new Date("2025-09-30"),
      clientName: "Junta de Andalucía — Salud",
      clientEmail: "obras@juntasalud.es",
      clientPhone: "+34 958 210 400",
      tags: "Sanitario,Público,Atención Primaria",
      latitude: 37.1529,
      longitude: -3.6492,
      createdAt: new Date("2023-10-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p9.id, title: "Proyecto básico aprobado", dueDate: new Date("2024-01-15"), completed: true },
      { projectId: p9.id, title: "Proyecto de ejecución", dueDate: new Date("2024-05-01"), completed: true },
      { projectId: p9.id, title: "Licitación de obra", dueDate: new Date("2024-08-01"), completed: true },
      { projectId: p9.id, title: "Revisión técnica de documentos", dueDate: new Date("2025-01-15"), completed: false },
      { projectId: p9.id, title: "Inicio de obra", dueDate: new Date("2025-03-01"), completed: false },
      { projectId: p9.id, title: "Entrega al cliente", dueDate: new Date("2025-09-30"), completed: false },
    ],
  });

  console.log("✓ Base de datos inicializada con 9 proyectos en el área metropolitana de Granada");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
