import { prisma } from "~/lib/prisma.server";
import type { Contact } from "@prisma/client";

export class ContactRepository {
  async findAll(): Promise<Contact[]> {
    return await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Omit<Contact, "id" | "createdAt">): Promise<Contact> {
    return await prisma.contact.create({
      data,
    });
  }

  async findById(id: number): Promise<Contact | null> {
    return await prisma.contact.findUnique({
      where: { id },
    });
  }

  async delete(id: number): Promise<Contact> {
    return await prisma.contact.delete({
      where: { id },
    });
  }
}

export const contactRepository = new ContactRepository();
