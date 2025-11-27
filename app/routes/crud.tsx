import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { driverRepository } from "~/lib/repositories/driver.repository";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { Route } from "./+types/crud";
import { format } from "date-fns";
import type { Driver } from "@prisma/client";
import { useFetcher, useSearchParams } from "react-router";
import { DriverForm } from "~/components/driver-form";

const driverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sex: z.enum(["M", "F"], { message: "Sex must be M or F" }),
  birthDate: z.string().min(1, "Birth date is required"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});


export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const sp = url.searchParams;
  const page = parseInt(sp.get("page") ?? "1");
  const pageSize = parseInt(sp.get("pageSize") ?? "10");

  const drivers = await driverRepository.getPaginated(page, pageSize);
  return { drivers };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const data = {
      name: formData.get("name") as string,
      sex: formData.get("sex") as string,
      birthDate: new Date(formData.get("birthDate") as string),
      country: formData.get("country") as string,
    };

    const result = driverSchema.safeParse({ ...data, birthDate: formData.get("birthDate") as string });
    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }

    await driverRepository.create(data);
    return { success: true, message: "Driver created successfully" };
  }

  if (intent === "update") {
    const id = parseInt(formData.get("id") as string);
    const data = {
      name: formData.get("name") as string,
      sex: formData.get("sex") as string,
      birthDate: new Date(formData.get("birthDate") as string),
      country: formData.get("country") as string,
    };

    const result = driverSchema.safeParse({ ...data, birthDate: formData.get("birthDate") as string });
    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }

    await driverRepository.update(id, data);
    return { success: true, message: "Driver updated successfully" };
  }

  if (intent === "delete") {
    const id = parseInt(formData.get("id") as string);
    await driverRepository.delete(id);
    return { success: true, message: "Driver deleted successfully" };
  }

  return { success: false, message: "Invalid action" };
}

export type CRUDActionData = Awaited<ReturnType<typeof action>>;

export default function CRUDPage({ loaderData }: Route.ComponentProps) {
  const { drivers } = loaderData;
  const [open, setOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = drivers.page ?? 1;
  const pageSize = drivers.pageSize ?? 10;
  const total = drivers.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("id", id.toString());

    const response = await fetch("/crud", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Driver Management (CRUD)</CardTitle>
              <CardDescription>
                Create, Read, Update, and Delete driver records
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingDriver(undefined)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Driver
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingDriver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
                  <DialogDescription>
                    {editingDriver ? "Update driver information" : "Enter new driver details"}
                  </DialogDescription>
                </DialogHeader>
                <DriverForm driver={editingDriver} onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.data.map((driver: Driver) => (
                <TableRow key={driver.id}>
                  <TableCell>{driver.id}</TableCell>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.sex}</TableCell>
                  <TableCell>{format(new Date(driver.birthDate), "PPP")}</TableCell>
                  <TableCell>{driver.country}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDriver(driver);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(driver.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages} — {total} drivers
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  searchParams.set("page", String(next));
                  searchParams.set("pageSize", String(pageSize));
                  setSearchParams(searchParams);
                }}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const next = Math.min(totalPages, page + 1);
                  searchParams.set("page", String(next));
                  searchParams.set("pageSize", String(pageSize));
                  setSearchParams(searchParams);
                }}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
