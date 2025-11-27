import { prisma } from "~/lib/prisma.server";
import type { GP } from "@prisma/client";
import type { PaginatedResult } from "~/schemas/api";

export class GPRepository {
  async findAll(): Promise<GP[]> {
    return await prisma.gP.findMany({
      orderBy: { date: "desc" },
    });
  }

  async getPaginated(page: number, pageSize: number): Promise<PaginatedResult<GP>> {
    const total = await prisma.gP.count();
    const data = await prisma.gP.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: "asc" },
    });
    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findByDate(date: Date): Promise<GP | null> {
    return await prisma.gP.findUnique({
      where: { date },
    });
  }

  async findWithResults(date: Date) {
    return await prisma.gP.findUnique({
      where: { date },
      include: {
        results: {
          include: {
            driver: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }
}

export const gpRepository = new GPRepository();
