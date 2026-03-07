import { prisma } from "./prisma";

export async function getAllProjects() {
  return prisma.project.findMany({
    include: { milestones: { orderBy: { dueDate: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { milestones: { orderBy: { dueDate: "asc" } } },
  });
}

export async function getDocumentsByProject(projectId: string) {
  return prisma.$queryRaw<
    { id: string; name: string; fileUrl: string; uploadedAt: string; projectId: string }[]
  >`SELECT id, name, fileUrl, uploadedAt, projectId FROM "Document" WHERE projectId = ${projectId} ORDER BY uploadedAt DESC`;
}

export async function getProjectStats() {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    total,
    active,
    completed,
    finishingSoon,
    budgetAgg,
    totalMilestones,
    completedMilestones,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({
      where: { status: { in: ["in_progress", "review"] } },
    }),
    prisma.project.count({ where: { status: "completed" } }),
    prisma.project.count({
      where: {
        endDate: { gte: now, lte: in30Days },
        status: { notIn: ["completed", "on_hold"] },
      },
    }),
    prisma.project.aggregate({
      _avg: { budget: true },
      _sum: { budget: true, spent: true },
    }),
    prisma.milestone.count(),
    prisma.milestone.count({ where: { completed: true } }),
  ]);

  return {
    total,
    active,
    completed,
    finishingSoon,
    avgBudget: budgetAgg._avg.budget ?? 0,
    totalBudget: budgetAgg._sum.budget ?? 0,
    totalSpent: budgetAgg._sum.spent ?? 0,
    milestoneCompletionPct:
      totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0,
    completedMilestones,
    totalMilestones,
  };
}

export async function getBudgetAnalytics() {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true, code: true, budget: true, spent: true },
    orderBy: { budget: "desc" },
  });

  const totals = projects.reduce(
    (acc, p) => ({ budget: acc.budget + p.budget, spent: acc.spent + p.spent }),
    { budget: 0, spent: 0 }
  );

  return {
    projects: projects.map((p) => ({
      name: p.name,
      code: p.code,
      budget: p.budget,
      spent: p.spent,
      remaining: p.budget - p.spent,
    })),
    totals: {
      budget: totals.budget,
      spent: totals.spent,
      remaining: totals.budget - totals.spent,
    },
  };
}

export async function getProjectsForMap() {
  const projects = await prisma.$queryRaw<
    { id: string; name: string; code: string; status: string; location: string | null; latitude: number | null; longitude: number | null }[]
  >`SELECT id, name, code, status, location, latitude, longitude FROM "Project" WHERE latitude IS NOT NULL AND longitude IS NOT NULL`;
  return projects;
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    location?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
    clientName?: string;
    status?: string;
    phase?: string;
  }
) {
  return prisma.project.update({
    where: { id },
    data: {
      ...data,
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
    },
  });
}

export async function calculateProjectProgress(projectId: string): Promise<number> {
  const milestones = await prisma.milestone.findMany({ where: { projectId } });
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.completed).length;
  return Math.round((completed / milestones.length) * 100);
}

export async function createMilestone(
  projectId: string,
  data: { title: string; dueDate: string }
) {
  const milestone = await prisma.milestone.create({
    data: { title: data.title, dueDate: new Date(data.dueDate), projectId },
  });
  const progress = await calculateProjectProgress(projectId);
  await prisma.project.update({ where: { id: projectId }, data: { progress } });
  return milestone;
}

export async function updateMilestone(
  id: string,
  data: { title?: string; dueDate?: string; completed?: boolean }
) {
  const milestone = await prisma.milestone.update({
    where: { id },
    data: {
      ...data,
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
    },
  });
  const progress = await calculateProjectProgress(milestone.projectId);
  await prisma.project.update({ where: { id: milestone.projectId }, data: { progress } });
  return milestone;
}

export async function deleteMilestone(id: string) {
  const milestone = await prisma.milestone.delete({ where: { id } });
  const progress = await calculateProjectProgress(milestone.projectId);
  await prisma.project.update({ where: { id: milestone.projectId }, data: { progress } });
  return milestone;
}

export async function createDocument(
  projectId: string,
  data: { name: string; fileUrl: string }
) {
  // Use raw SQL — Prisma client may not yet include Document after migration
  const id = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const uploadedAt = new Date().toISOString();
  await prisma.$executeRaw`
    INSERT INTO "Document" (id, name, fileUrl, uploadedAt, projectId)
    VALUES (${id}, ${data.name}, ${data.fileUrl}, ${uploadedAt}, ${projectId})
  `;
  return { id, name: data.name, fileUrl: data.fileUrl, uploadedAt, projectId };
}

export async function deleteDocument(id: string) {
  await prisma.$executeRaw`DELETE FROM "Document" WHERE id = ${id}`;
}

export async function findDocumentById(id: string) {
  const rows = await prisma.$queryRaw<
    { id: string; name: string; fileUrl: string; uploadedAt: string; projectId: string }[]
  >`SELECT id, name, fileUrl, uploadedAt, projectId FROM "Document" WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

export async function getExpensesByProject(projectId: string) {
  return prisma.$queryRaw<
    { id: string; description: string; amount: number; category: string; date: string; createdAt: string; projectId: string }[]
  >`SELECT id, description, amount, category, date, createdAt, projectId FROM "Expense" WHERE projectId = ${projectId} ORDER BY date DESC`;
}

export async function createExpense(
  projectId: string,
  data: { description: string; amount: number; category: string; date: string }
) {
  const id = `exp${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const createdAt = new Date().toISOString();
  const date = new Date(data.date).toISOString();
  await prisma.$executeRaw`
    INSERT INTO "Expense" (id, description, amount, category, date, createdAt, projectId)
    VALUES (${id}, ${data.description}, ${data.amount}, ${data.category}, ${date}, ${createdAt}, ${projectId})
  `;
  return { id, description: data.description, amount: data.amount, category: data.category, date, createdAt, projectId };
}

export async function deleteExpense(id: string) {
  await prisma.$executeRaw`DELETE FROM "Expense" WHERE id = ${id}`;
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export async function logActivity(projectId: string, type: string, description: string) {
  try {
    const id = `act${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
    const createdAt = new Date().toISOString();
    await prisma.$executeRaw`
      INSERT INTO "ActivityLog" (id, type, description, createdAt, projectId)
      VALUES (${id}, ${type}, ${description}, ${createdAt}, ${projectId})
    `;
  } catch {
    // Non-blocking — log failures must never break main operations
  }
}

export async function getActivityByProject(projectId: string, limit = 20) {
  const rows = await prisma.$queryRaw<
    { id: string; type: string; description: string; createdAt: string; projectId: string }[]
  >`SELECT id, type, description, createdAt, projectId FROM "ActivityLog" WHERE projectId = ${projectId} ORDER BY createdAt DESC`;
  return rows.slice(0, limit);
}

export async function getRecentActivity(limit = 12) {
  const rows = await prisma.$queryRaw<
    { id: string; type: string; description: string; createdAt: string; projectId: string; projectName: string; projectCode: string }[]
  >`SELECT a.id, a.type, a.description, a.createdAt, a.projectId,
           p.name as projectName, p.code as projectCode
    FROM "ActivityLog" a JOIN "Project" p ON p.id = a.projectId
    ORDER BY a.createdAt DESC`;
  return rows.slice(0, limit);
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export async function getTeamByProject(projectId: string) {
  return prisma.$queryRaw<
    { id: string; name: string; role: string; email: string | null; phone: string | null; createdAt: string; projectId: string }[]
  >`SELECT id, name, role, email, phone, createdAt, projectId FROM "TeamMember" WHERE projectId = ${projectId} ORDER BY createdAt ASC`;
}

export async function createTeamMember(
  projectId: string,
  data: { name: string; role: string; email?: string; phone?: string }
) {
  const id = `tm${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const createdAt = new Date().toISOString();
  const email = data.email ?? null;
  const phone = data.phone ?? null;
  await prisma.$executeRaw`
    INSERT INTO "TeamMember" (id, name, role, email, phone, createdAt, projectId)
    VALUES (${id}, ${data.name}, ${data.role}, ${email}, ${phone}, ${createdAt}, ${projectId})
  `;
  return { id, name: data.name, role: data.role, email, phone, createdAt, projectId };
}

export async function deleteTeamMember(id: string) {
  await prisma.$executeRaw`DELETE FROM "TeamMember" WHERE id = ${id}`;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export async function getAllMilestonesForCalendar() {
  const milestones = await prisma.milestone.findMany({
    include: { project: { select: { name: true, code: true, status: true } } },
    orderBy: { dueDate: "asc" },
  });
  return milestones.map((m) => ({
    id: m.id,
    title: m.title,
    dueDate: m.dueDate.toISOString(),
    completed: m.completed,
    projectId: m.projectId,
    projectName: m.project.name,
    projectCode: m.project.code,
    projectStatus: m.project.status,
  }));
}

export async function createProject(data: {
  name: string;
  code: string;
  description?: string;
  status: string;
  phase: string;
  location?: string;
  budget: number;
  startDate: string;
  endDate: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  tags?: string;
}) {
  return prisma.project.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
}
