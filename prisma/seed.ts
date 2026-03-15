import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();

  // Clear users (raw SQL — model added after initial generate)
  try {
    await prisma.$executeRaw`DELETE FROM "User"`;
  } catch {
    // Table may not exist on first run before migration
  }

  // Project 1 — Hospital de Día Armilla
  const p1 = await prisma.project.create({
    data: {
      id: "p-001",
      name: "Hospital de Día Armilla",
      code: "HDA-2024",
      description:
        "Centro sanitario de día de nueva planta en Armilla con consultas especializadas, área de rehabilitación y urgencias menores. El diseño prioriza la accesibilidad universal y los espacios de luz natural.",
      type: "administrative",
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
      type: "personal",
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
      type: "administrative",
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
      type: "administrative",
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
      type: "administrative",
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
      type: "administrative",
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
      type: "personal",
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
      type: "administrative",
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
      type: "administrative",
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

  // Project 10 — Vivienda Unifamiliar Cenes de la Vega
  const p10 = await prisma.project.create({
    data: {
      id: "p-010",
      name: "Vivienda Unifamiliar Cenes de la Vega",
      code: "VUC-2025",
      description:
        "Vivienda unifamiliar aislada de 280 m² en parcela de 800 m² con orientación sur. El programa incluye planta baja con zonas de día, planta primera con tres dormitorios y suite principal, y cubierta transitable con pérgola bioclimática. Materiales nobles: piedra caliza local, madera de roble y hormigón visto.",
      type: "personal",
      status: "in_progress",
      phase: "construction_docs",
      location: "Cenes de la Vega, Granada",
      budget: 520000,
      spent: 148000,
      progress: 35,
      startDate: new Date("2025-01-10"),
      endDate: new Date("2026-06-30"),
      clientName: "Familia Morales Ruiz",
      clientEmail: "jmorales@gmail.com",
      clientPhone: "+34 630 452 187",
      tags: "Residencial,Unifamiliar,Bioclimático",
      latitude: 37.1560,
      longitude: -3.5490,
      createdAt: new Date("2024-12-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p10.id, title: "Anteproyecto aprobado por el cliente", dueDate: new Date("2025-03-01"), completed: true },
      { projectId: p10.id, title: "Proyecto básico", dueDate: new Date("2025-05-15"), completed: true },
      { projectId: p10.id, title: "Licencia de obras", dueDate: new Date("2025-08-01"), completed: false },
      { projectId: p10.id, title: "Inicio de obra", dueDate: new Date("2025-10-01"), completed: false },
      { projectId: p10.id, title: "Estructura y cubierta", dueDate: new Date("2026-02-01"), completed: false },
      { projectId: p10.id, title: "Entrega de llaves", dueDate: new Date("2026-06-30"), completed: false },
    ],
  });

  // Project 11 — Rehabilitación Chalet La Zubia
  const p11 = await prisma.project.create({
    data: {
      id: "p-011",
      name: "Rehabilitación Chalet La Zubia",
      code: "RCZ-2024",
      description:
        "Rehabilitación integral de chalet adosado de los años 90 con 180 m² construidos. Intervención en fachada (SATE y nueva carpintería de aluminio con RPT), redistribución interior para ampliar cocina y salón, renovación de instalaciones (aerotermia + suelo radiante) y diseño de jardín trasero con piscina de 6×3 m.",
      type: "personal",
      status: "completed",
      phase: "post_construction",
      location: "La Zubia, Granada",
      budget: 185000,
      spent: 181500,
      progress: 100,
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-12-20"),
      clientName: "Dña. Carmen Vílchez Soto",
      clientEmail: "cvilchez@hotmail.com",
      clientPhone: "+34 655 321 098",
      tags: "Rehabilitación,Residencial,Eficiencia Energética",
      latitude: 37.1089,
      longitude: -3.5821,
      createdAt: new Date("2024-02-10"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p11.id, title: "Diagnosis y proyecto de rehabilitación", dueDate: new Date("2024-04-15"), completed: true },
      { projectId: p11.id, title: "Licencia de obras menores", dueDate: new Date("2024-05-20"), completed: true },
      { projectId: p11.id, title: "Demoliciones y estructura", dueDate: new Date("2024-07-01"), completed: true },
      { projectId: p11.id, title: "Instalaciones y acabados interiores", dueDate: new Date("2024-10-01"), completed: true },
      { projectId: p11.id, title: "Fachada y jardín", dueDate: new Date("2024-12-01"), completed: true },
      { projectId: p11.id, title: "Recepción y entrega", dueDate: new Date("2024-12-20"), completed: true },
    ],
  });

  // Project 12 — Casa en el Campo Iznalloz
  const p12 = await prisma.project.create({
    data: {
      id: "p-012",
      name: "Casa en el Campo Iznalloz",
      code: "CCI-2025",
      description:
        "Vivienda rural de nueva planta en parcela agrícola de 4.500 m² en el entorno de Iznalloz. Diseño de bajo impacto visual integrado en el paisaje: cubierta plana ajardinada, muros de mampostería de piedra local y grandes ventanales hacia la Sierra de Harana. Autosuficiencia energética mediante paneles solares y cisterna de aguas pluviales.",
      type: "personal",
      status: "planning",
      phase: "schematic",
      location: "Iznalloz, Granada",
      budget: 390000,
      spent: 22000,
      progress: 10,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2027-03-31"),
      clientName: "D. Andrés Castillo Peña",
      clientEmail: "acastillo@outlook.es",
      clientPhone: "+34 617 890 234",
      tags: "Residencial,Rural,Autosuficiente,Sostenible",
      latitude: 37.3892,
      longitude: -3.5312,
      createdAt: new Date("2025-05-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { projectId: p12.id, title: "Estudio de viabilidad urbanística", dueDate: new Date("2025-07-15"), completed: true },
      { projectId: p12.id, title: "Diseño esquemático", dueDate: new Date("2025-10-01"), completed: false },
      { projectId: p12.id, title: "Proyecto básico", dueDate: new Date("2026-02-01"), completed: false },
      { projectId: p12.id, title: "Licencia de obras", dueDate: new Date("2026-06-01"), completed: false },
      { projectId: p12.id, title: "Inicio de construcción", dueDate: new Date("2026-09-01"), completed: false },
      { projectId: p12.id, title: "Entrega", dueDate: new Date("2027-03-31"), completed: false },
    ],
  });

  // ── Project images ──────────────────────────────────────────────────────────
  // Stored as Document records with image extension so ProjectGallery picks them up.
  // Unsplash CDN — images.unsplash.com with specific photo IDs, cropped to 800×600.
  const U = (id: string) => `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&q=80&auto=format`;

  type Img = { id: string; name: string; fileUrl: string; projectId: string; uploadedAt: string };
  const imgs: Img[] = [
    // p-001 Hospital de Día Armilla
    { id: "img-p001-1", projectId: "p-001", name: "Render exterior fachada principal.jpg",  fileUrl: U("photo-1519494026892-80bbd2d6fd0d"), uploadedAt: "2024-06-01T10:00:00Z" },
    { id: "img-p001-2", projectId: "p-001", name: "Vista aérea del conjunto.jpg",           fileUrl: U("photo-1586773860418-d37222d8fce3"), uploadedAt: "2024-06-01T10:01:00Z" },
    { id: "img-p001-3", projectId: "p-001", name: "Interior vestíbulo de acceso.jpg",       fileUrl: U("photo-1504439904031-93ded9f93e4e"), uploadedAt: "2024-06-01T10:02:00Z" },
    { id: "img-p001-4", projectId: "p-001", name: "Avance de obra - estructura.jpg",        fileUrl: U("photo-1504307651254-35680f356dfd"), uploadedAt: "2024-09-15T08:30:00Z" },
    { id: "img-p001-5", projectId: "p-001", name: "Render zonas de rehabilitación.jpg",     fileUrl: U("photo-1538108149393-dbbd9eee4f6a"), uploadedAt: "2024-06-01T10:04:00Z" },

    // p-002 Complejo Residencial Las Acacias
    { id: "img-p002-1", projectId: "p-002", name: "Render del conjunto residencial.jpg",    fileUrl: U("photo-1545324418-cc1a3fa10c00"), uploadedAt: "2025-03-01T09:00:00Z" },
    { id: "img-p002-2", projectId: "p-002", name: "Vista de las zonas ajardinadas.jpg",     fileUrl: U("photo-1558618666-fcd25c85cd64"), uploadedAt: "2025-03-01T09:01:00Z" },
    { id: "img-p002-3", projectId: "p-002", name: "Render interior tipo vivienda.jpg",      fileUrl: U("photo-1555041469-a586c61ea9bc"), uploadedAt: "2025-03-01T09:02:00Z" },
    { id: "img-p002-4", projectId: "p-002", name: "Detalle fachada y balcones.jpg",         fileUrl: U("photo-1600607687939-ce8a6c25118c"), uploadedAt: "2025-03-01T09:03:00Z" },

    // p-003 Centro Cultural Albolote
    { id: "img-p003-1", projectId: "p-003", name: "Render exterior fachada cerámica.jpg",   fileUrl: U("photo-1580587771525-78b9dba3b914"), uploadedAt: "2024-03-01T09:00:00Z" },
    { id: "img-p003-2", projectId: "p-003", name: "Vista interior del auditorio.jpg",       fileUrl: U("photo-1518998053901-5348d3961a04"), uploadedAt: "2024-03-01T09:01:00Z" },
    { id: "img-p003-3", projectId: "p-003", name: "Sala de exposiciones.jpg",               fileUrl: U("photo-1536924940846-227afb31e2a5"), uploadedAt: "2024-03-01T09:02:00Z" },
    { id: "img-p003-4", projectId: "p-003", name: "Detalle celosías de hormigón.jpg",       fileUrl: U("photo-1487958449943-2429e8be8625"), uploadedAt: "2024-03-01T09:03:00Z" },
    { id: "img-p003-5", projectId: "p-003", name: "Render nocturno del edificio.jpg",       fileUrl: U("photo-1470229722913-7c0e2dbbafd3"), uploadedAt: "2024-03-01T09:04:00Z" },

    // p-004 Edificio de Oficinas Parque Tecnológico
    { id: "img-p004-1", projectId: "p-004", name: "Render exterior fachada ventilada.jpg",  fileUrl: U("photo-1486325212027-8081e485255e"), uploadedAt: "2024-07-01T09:00:00Z" },
    { id: "img-p004-2", projectId: "p-004", name: "Planta baja espacios colaborativos.jpg", fileUrl: U("photo-1497366216548-37526070297c"), uploadedAt: "2024-07-01T09:01:00Z" },
    { id: "img-p004-3", projectId: "p-004", name: "Detalle fachada fotovoltaica.jpg",       fileUrl: U("photo-1509391366360-2e959784a276"), uploadedAt: "2024-07-01T09:02:00Z" },
    { id: "img-p004-4", projectId: "p-004", name: "Vista desde el parque tecnológico.jpg",  fileUrl: U("photo-1464938050520-ef2270bb8ce8"), uploadedAt: "2024-07-01T09:03:00Z" },
    { id: "img-p004-5", projectId: "p-004", name: "Avance de obra - cimentación.jpg",       fileUrl: U("photo-1503387762-592deb58ef4e"), uploadedAt: "2025-01-20T08:00:00Z" },

    // p-005 Centro Logístico Sur
    { id: "img-p005-1", projectId: "p-005", name: "Vista aérea del centro logístico.jpg",   fileUrl: U("photo-1586528116311-ad8dd3c8310d"), uploadedAt: "2023-05-01T09:00:00Z" },
    { id: "img-p005-2", projectId: "p-005", name: "Interior nave de almacenamiento.jpg",    fileUrl: U("photo-1553413077-190dd305871c"), uploadedAt: "2023-05-01T09:01:00Z" },
    { id: "img-p005-3", projectId: "p-005", name: "Cubierta solar fotovoltaica.jpg",        fileUrl: U("photo-1509391366360-2e959784a276"), uploadedAt: "2023-05-01T09:02:00Z" },
    { id: "img-p005-4", projectId: "p-005", name: "Muelles de carga automatizados.jpg",     fileUrl: U("photo-1565793979946-06c9dcd7a7b5"), uploadedAt: "2023-05-01T09:03:00Z" },
    { id: "img-p005-5", projectId: "p-005", name: "Fachada principal del complejo.jpg",     fileUrl: U("photo-1515263487990-61b07816b324"), uploadedAt: "2023-05-01T09:04:00Z" },
    { id: "img-p005-6", projectId: "p-005", name: "Urbanización exterior.jpg",              fileUrl: U("photo-1504307651254-35680f356dfd"), uploadedAt: "2024-09-01T08:00:00Z" },

    // p-006 Polideportivo Municipal Huétor Vega
    { id: "img-p006-1", projectId: "p-006", name: "Render exterior pabellón deportivo.jpg", fileUrl: U("photo-1546519638-68e109498ffc"), uploadedAt: "2025-02-01T09:00:00Z" },
    { id: "img-p006-2", projectId: "p-006", name: "Estructura de cubierta en CLT.jpg",      fileUrl: U("photo-1505761671935-60b3a7427bad"), uploadedAt: "2025-02-01T09:01:00Z" },
    { id: "img-p006-3", projectId: "p-006", name: "Render piscina cubierta interior.jpg",   fileUrl: U("photo-1576013551627-0cc20b96c2a7"), uploadedAt: "2025-02-01T09:02:00Z" },
    { id: "img-p006-4", projectId: "p-006", name: "Render sala de fitness.jpg",             fileUrl: U("photo-1534438327276-14e5300c3a48"), uploadedAt: "2025-02-01T09:03:00Z" },

    // p-007 Residencia de Estudiantes UGR
    { id: "img-p007-1", projectId: "p-007", name: "Render del conjunto residencial.jpg",    fileUrl: U("photo-1564013799919-ab600027ffc6"), uploadedAt: "2024-03-01T09:00:00Z" },
    { id: "img-p007-2", projectId: "p-007", name: "Patio central bioclimático.jpg",         fileUrl: U("photo-1512917774080-9991f1c4c750"), uploadedAt: "2024-03-01T09:01:00Z" },
    { id: "img-p007-3", projectId: "p-007", name: "Interior habitación tipo.jpg",           fileUrl: U("photo-1540518614846-7eded433c457"), uploadedAt: "2024-03-01T09:02:00Z" },
    { id: "img-p007-4", projectId: "p-007", name: "Avance de obra - estructura.jpg",        fileUrl: U("photo-1503387762-592deb58ef4e"), uploadedAt: "2025-04-01T08:00:00Z" },
    { id: "img-p007-5", projectId: "p-007", name: "Render comedor universitario.jpg",       fileUrl: U("photo-1567521464027-f127ff144326"), uploadedAt: "2024-03-01T09:04:00Z" },

    // p-008 Casa Consistorial Santa Fe
    { id: "img-p008-1", projectId: "p-008", name: "Fachada histórica del edificio.jpg",     fileUrl: U("photo-1477959858617-67f85cf4f1df"), uploadedAt: "2024-07-01T09:00:00Z" },
    { id: "img-p008-2", projectId: "p-008", name: "Interior sala de plenos.jpg",            fileUrl: U("photo-1541888946425-d81bb19240f5"), uploadedAt: "2024-07-01T09:01:00Z" },
    { id: "img-p008-3", projectId: "p-008", name: "Detalle elementos históricos.jpg",       fileUrl: U("photo-1558618666-fcd25c85cd64"), uploadedAt: "2024-07-01T09:02:00Z" },
    { id: "img-p008-4", projectId: "p-008", name: "Render ala contemporánea.jpg",           fileUrl: U("photo-1487958449943-2429e8be8625"), uploadedAt: "2024-07-01T09:03:00Z" },

    // p-009 Centro de Salud Churriana de la Vega
    { id: "img-p009-1", projectId: "p-009", name: "Render exterior centro de salud.jpg",    fileUrl: U("photo-1586773860418-d37222d8fce3"), uploadedAt: "2024-01-20T09:00:00Z" },
    { id: "img-p009-2", projectId: "p-009", name: "Interior sala de espera.jpg",            fileUrl: U("photo-1538108149393-dbbd9eee4f6a"), uploadedAt: "2024-01-20T09:01:00Z" },
    { id: "img-p009-3", projectId: "p-009", name: "Vista fachada principal.jpg",            fileUrl: U("photo-1519494026892-80bbd2d6fd0d"), uploadedAt: "2024-01-20T09:02:00Z" },
    { id: "img-p009-4", projectId: "p-009", name: "Zona consultas médicas.jpg",             fileUrl: U("photo-1504439904031-93ded9f93e4e"), uploadedAt: "2024-01-20T09:03:00Z" },

    // p-010 Vivienda Unifamiliar Cenes de la Vega
    { id: "img-p010-1", projectId: "p-010", name: "Render exterior vivienda.jpg",           fileUrl: U("photo-1600585154340-be6161a56a0c"), uploadedAt: "2025-02-01T09:00:00Z" },
    { id: "img-p010-2", projectId: "p-010", name: "Fachada sur con terraza.jpg",            fileUrl: U("photo-1560185007-cde436f6a4d0"), uploadedAt: "2025-02-01T09:01:00Z" },
    { id: "img-p010-3", projectId: "p-010", name: "Interior salón con vistas.jpg",          fileUrl: U("photo-1600210492493-0946911123ea"), uploadedAt: "2025-02-01T09:02:00Z" },
    { id: "img-p010-4", projectId: "p-010", name: "Render cocina.jpg",                      fileUrl: U("photo-1556909114-f6e7ad7d3136"), uploadedAt: "2025-02-01T09:03:00Z" },
    { id: "img-p010-5", projectId: "p-010", name: "Cubierta transitable con pérgola.jpg",   fileUrl: U("photo-1600566753086-00f18fb6b3ea"), uploadedAt: "2025-02-01T09:04:00Z" },
    { id: "img-p010-6", projectId: "p-010", name: "Vista del jardín trasero.jpg",           fileUrl: U("photo-1558618666-fcd25c85cd64"), uploadedAt: "2025-02-01T09:05:00Z" },

    // p-011 Rehabilitación Chalet La Zubia
    { id: "img-p011-1", projectId: "p-011", name: "Fachada antes de la rehabilitación.jpg", fileUrl: U("photo-1484154218962-a197022b5858"), uploadedAt: "2024-03-05T08:00:00Z" },
    { id: "img-p011-2", projectId: "p-011", name: "Fachada tras la rehabilitación.jpg",     fileUrl: U("photo-1600585154340-be6161a56a0c"), uploadedAt: "2024-12-22T10:00:00Z" },
    { id: "img-p011-3", projectId: "p-011", name: "Interior cocina reformada.jpg",          fileUrl: U("photo-1556909114-f6e7ad7d3136"), uploadedAt: "2024-12-22T10:01:00Z" },
    { id: "img-p011-4", projectId: "p-011", name: "Jardín trasero con piscina.jpg",         fileUrl: U("photo-1576013551627-0cc20b96c2a7"), uploadedAt: "2024-12-22T10:02:00Z" },
    { id: "img-p011-5", projectId: "p-011", name: "Detalle carpintería nueva.jpg",          fileUrl: U("photo-1600210492493-0946911123ea"), uploadedAt: "2024-12-22T10:03:00Z" },

    // p-012 Casa en el Campo Iznalloz
    { id: "img-p012-1", projectId: "p-012", name: "Render exterior casa rural.jpg",         fileUrl: U("photo-1500534314209-a157d0ea4e39"), uploadedAt: "2025-06-15T09:00:00Z" },
    { id: "img-p012-2", projectId: "p-012", name: "Vista integración en el paisaje.jpg",    fileUrl: U("photo-1464822759023-fed622ff2c3b"), uploadedAt: "2025-06-15T09:01:00Z" },
    { id: "img-p012-3", projectId: "p-012", name: "Render interior zona de día.jpg",        fileUrl: U("photo-1600210492493-0946911123ea"), uploadedAt: "2025-06-15T09:02:00Z" },
    { id: "img-p012-4", projectId: "p-012", name: "Cubierta ajardinada.jpg",                fileUrl: U("photo-1416879595882-3373a0480b5b"), uploadedAt: "2025-06-15T09:03:00Z" },
    { id: "img-p012-5", projectId: "p-012", name: "Render terraza hacia la sierra.jpg",     fileUrl: U("photo-1506905925346-21bda4d32df4"), uploadedAt: "2025-06-15T09:04:00Z" },
  ];

  for (const img of imgs) {
    await prisma.$executeRaw`
      INSERT INTO "Document" (id, name, fileUrl, uploadedAt, projectId)
      VALUES (${img.id}, ${img.name}, ${img.fileUrl}, ${img.uploadedAt}, ${img.projectId})
    `;
  }

  console.log(`✓ ${imgs.length} imágenes de proyecto insertadas`);

  // ── Users ────────────────────────────────────────────────────────────────────
  const SALT_ROUNDS = 12;
  const clientPass = await bcrypt.hash("Cliente1234!", SALT_ROUNDS);

  const users = [
    // ── Admin ──
    {
      id: "user-admin-001",
      email: "admin@archflow.es",
      password: await bcrypt.hash("Admin1234!", SALT_ROUNDS),
      name: "Administrador",
      role: "admin",
      projectId: null,
    },
    // ── Demo ──
    {
      id: "user-normal-001",
      email: "visita@archflow.es",
      password: await bcrypt.hash("Visita1234!", SALT_ROUNDS),
      name: "Usuario Demo",
      role: "normal",
      projectId: null,
    },
    // ── Clientes (uno por proyecto) ──
    { id: "user-client-001", email: "hda@juntasalud.es",         password: clientPass, name: "Junta de Andalucía — Salud (HDA)",   role: "client", projectId: "p-001" },
    { id: "user-client-002", email: "info@veganorte.es",          password: clientPass, name: "Promociones Vega Norte S.L.",         role: "client", projectId: "p-002" },
    { id: "user-client-003", email: "urbanismo@albolote.es",      password: clientPass, name: "Ayuntamiento de Albolote",            role: "client", projectId: "p-003" },
    { id: "user-client-004", email: "proyectos@techvega.es",      password: clientPass, name: "TechVega Inversiones S.A.",           role: "client", projectId: "p-004" },
    { id: "user-client-005", email: "construccion@logisur.es",    password: clientPass, name: "LogiSur Granada S.A.",                role: "client", projectId: "p-005" },
    { id: "user-client-006", email: "deportes@huetorvega.es",     password: clientPass, name: "Ayuntamiento de Huétor Vega",         role: "client", projectId: "p-006" },
    { id: "user-client-007", email: "infraestructuras@ugr.es",    password: clientPass, name: "Universidad de Granada",              role: "client", projectId: "p-007" },
    { id: "user-client-008", email: "secretaria@santafe.es",      password: clientPass, name: "Ayuntamiento de Santa Fe",           role: "client", projectId: "p-008" },
    { id: "user-client-009", email: "csc@juntasalud.es",          password: clientPass, name: "Junta de Andalucía — Salud (CSC)",   role: "client", projectId: "p-009" },
    { id: "user-client-010", email: "jmorales@gmail.com",         password: clientPass, name: "Familia Morales Ruiz",                role: "client", projectId: "p-010" },
    { id: "user-client-011", email: "cvilchez@hotmail.com",       password: clientPass, name: "Dña. Carmen Vílchez Soto",           role: "client", projectId: "p-011" },
    { id: "user-client-012", email: "acastillo@outlook.es",       password: clientPass, name: "D. Andrés Castillo Peña",            role: "client", projectId: "p-012" },
  ];

  for (const u of users) {
    await prisma.$executeRaw`
      INSERT INTO "User" (id, email, password, name, role, projectId, createdAt, updatedAt)
      VALUES (${u.id}, ${u.email}, ${u.password}, ${u.name}, ${u.role}, ${u.projectId}, datetime('now'), datetime('now'))
    `;
  }

  const clientUsers = users.filter((u) => u.role === "client");
  console.log(`✓ ${users.length} usuarios creados (1 admin + 1 demo + ${clientUsers.length} clientes)`);
  console.log("");
  console.log("  ADMIN:");
  console.log("    admin@archflow.es         →  Admin1234!");
  console.log("");
  console.log("  CLIENTES (todos usan: Cliente1234!):");
  for (const u of clientUsers) {
    console.log(`    ${u.email.padEnd(32)} →  p-${u.projectId?.split("-")[1]} · ${u.name}`);
  }
  console.log("");
  console.log("✓ Base de datos inicializada con 12 proyectos en el área metropolitana de Granada");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
