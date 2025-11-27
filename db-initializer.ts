import * as fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BATCH_SIZE = 100;

function readAndParseCSV(filePath: string): string[][] {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const rows = data.split("\n").map((line) => line.split("\t"));
    // Filter out empty rows
    return rows.filter((row) => row.some((cell) => cell.trim() !== ""));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}


function cleanString(value: string | undefined): string {
  return (value ?? "").replace(/\r/g, "").trim();
}

function parseDate(dateString: string | undefined, fallback: string = "1970-01-01"): Date {
  if (!dateString || dateString.trim() === "") {
    return new Date(fallback);
  }
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date(fallback) : date;
}


function parseIntSafe(value: string | undefined): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}


async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processor(batch);
    console.log(`  Processed ${Math.min(i + batchSize, items.length)}/${items.length} records`);
  }
}

class Seeder {

  async loadGPData(dropData: boolean = false): Promise<void> {
    console.log("Loading GP data...");
    
    if (dropData) {
      console.log("  Dropping existing GP data...");
      await prisma.gP.deleteMany();
    }

    const count = await prisma.gP.count();
    if (count > 0 && !dropData) {
      console.log(`  Skipping: ${count} GPs already exist`);
      return;
    }

    const csvData = readAndParseCSV("prisma/seed-data/gp.csv");
    const [_header, ...rows] = csvData;

    const gps = rows.map((row) => ({
      date: parseDate(row[0]),
      name: cleanString(row[1]),
      country: cleanString(row[2]),
    }));

    await prisma.gP.createMany({
      data: gps,
      skipDuplicates: true,
    });

    console.log(`  ✓ Loaded ${gps.length} GPs`);
  }

  /**
   * Load Driver data from CSV
   */
  async loadDriverData(dropData: boolean = false): Promise<void> {
    console.log("Loading Driver data...");

    if (dropData) {
      console.log("  Dropping existing Driver data...");
      await prisma.driver.deleteMany();
    }

    const count = await prisma.driver.count();
    if (count > 0 && !dropData) {
      console.log(`  Skipping: ${count} Drivers already exist`);
      return;
    }

    const csvData = readAndParseCSV("prisma/seed-data/pilota.csv");
    const [_header, ...rows] = csvData;

    const drivers = rows.map((row) => ({
      id: parseIntSafe(row[0]) ?? 0,
      name: cleanString(row[1]),
      sex: cleanString(row[2]),
      birthDate: parseDate(row[3]),
      country: cleanString(row[4]),
    }));

    // Use createMany for better performance
    await prisma.driver.createMany({
      data: drivers,
      skipDuplicates: true,
    });

    console.log(`  ✓ Loaded ${drivers.length} Drivers`);
  }

  /**
   * Load Result data from CSV
   */
  async loadResultData(dropData: boolean = false): Promise<void> {
    console.log("Loading Result data...");

    if (dropData) {
      console.log("  Dropping existing Result data...");
      await prisma.result.deleteMany();
    }

    const count = await prisma.result.count();
    if (count > 0 && !dropData) {
      console.log(`  Skipping: ${count} Results already exist`);
      return;
    }

    const csvData = readAndParseCSV("prisma/seed-data/eredmeny.csv");
    const [_header, ...rows] = csvData;

    const results = rows.map((row) => ({
      gpDate: parseDate(row[0]),
      driverId: parseIntSafe(row[1]) ?? 0,
      position: parseIntSafe(row[2]),
      mistake: cleanString(row[3]) || null,
      team: cleanString(row[4]) || null,
      type: cleanString(row[5]) || null,
      engine: cleanString(row[6]) || null,
    }));

    await processBatch(results, BATCH_SIZE, async (batch) => {
      await prisma.result.createMany({
        data: batch,
        skipDuplicates: true,
      });
    });

    console.log(`  ✓ Loaded ${results.length} Results`);
  }

  async seedAll(dropData: boolean = false): Promise<void> {
    console.log("Seeding all data...\n");
    
    await this.loadGPData(dropData);
    await this.loadDriverData(dropData);
    await this.loadResultData(dropData);
    
    console.log("\n✓ All seeding completed successfully!");
  }
}

async function main() {
  const seeder = new Seeder();
  const args = process.argv.slice(2);

  try {

    const shouldDropData = args.includes("--drop-data");
    const loadGPs = args.includes("--load-gps");
    const loadDrivers = args.includes("--load-drivers");
    const loadResults = args.includes("--load-results");
    const loadAll = args.includes("--all") || args.length === 0;

    if (loadAll) {
      await seeder.seedAll(shouldDropData);
    } else {
      if (loadGPs) {
        await seeder.loadGPData(shouldDropData);
      }
      if (loadDrivers) {
        await seeder.loadDriverData(shouldDropData);
      }
      if (loadResults) {
        await seeder.loadResultData(shouldDropData);
      }
    }

    console.log("\n✓ Seeding process completed successfully");
  } catch (error) {
    console.error("\n✗ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}



main();
