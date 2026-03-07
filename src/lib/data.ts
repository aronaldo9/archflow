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
