import { prisma } from "~/lib/prisma.server";
import type { Result } from "@prisma/client";
import type { PaginatedResult } from "~/schemas/api";

export class ResultRepository {
  async findAll() {
    return await prisma.result.findMany({
      include: {
        driver: true,
        gp: true,
      },
      orderBy: {
        gpDate: "desc",
      },
    });
  }

  async getPaginated(page: number, pageSize: number): Promise<PaginatedResult<any>> {
    const total = await prisma.result.count();
    const data = await prisma.result.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        driver: true,
        gp: true,
      },
      orderBy: { gpDate: "asc" },
    });
    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findByDriver(driverId: number) {
    return await prisma.result.findMany({
      where: { driverId },
      include: {
        gp: true,
      },
      orderBy: {
        gpDate: "desc",
      },
    });
  }

  async findByGP(gpDate: Date) {
    return await prisma.result.findMany({
      where: { gpDate },
      include: {
        driver: true,
      },
      orderBy: {
        position: "asc",
      },
    });
  }
}

export const resultRepository = new ResultRepository();
