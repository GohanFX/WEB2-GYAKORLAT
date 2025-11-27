import { z } from "zod";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFetcher } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import type { Driver } from "~/generated/prisma";
import { useEffect } from "react";
import { toast } from "sonner";
import type { CRUDActionData } from "~/routes/crud";

const driverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sex: z.enum(["M", "F"], { message: "Sex must be M or F" }),
  birthDate: z.string().min(1, "Birth date is required"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

type DriverFormData = z.infer<typeof driverSchema>;


function DriverForm({ 
  driver, 
  onSuccess 
}: { 
  driver?: Driver; 
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: driver ? {
      name: driver.name,
      sex: driver.sex as "M" | "F",
      birthDate: format(new Date(driver.birthDate), "yyyy-MM-dd"),
      country: driver.country,
    } : undefined,
  });

  const fetcher = useFetcher<CRUDActionData>();

  const onSubmit = async (data: DriverFormData) => {
    const formData = new FormData();
    formData.append("intent", driver ? "update" : "create");
    if (driver) formData.append("id", driver.id.toString());
    formData.append("name", data.name);
    formData.append("sex", data.sex);
    formData.append("birthDate", data.birthDate);
    formData.append("country", data.country);

    await fetcher.submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message || (driver ? "Driver updated successfully" : "Driver created successfully"));
      onSuccess();
    } else if (fetcher.data?.success === false) {
      if (fetcher.data.errors) {
        Object.values(fetcher.data.errors).forEach((errorMessages) => {
          errorMessages?.forEach((message) => {
            toast.error(message);
          }
          );
        });
      };
    }
  }, [fetcher.data, onSuccess, driver]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <FieldDescription className="text-destructive">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="sex">Sex</FieldLabel>
          <Input id="sex" placeholder="M or F" {...register("sex")} />
          {errors.sex && (
            <FieldDescription className="text-destructive">
              {errors.sex.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="birthDate">Birth Date</FieldLabel>
          <Input id="birthDate" type="date" {...register("birthDate")} />
          {errors.birthDate && (
            <FieldDescription className="text-destructive">
              {errors.birthDate.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="country">Country</FieldLabel>
          <Input id="country" {...register("country")} />
          {errors.country && (
            <FieldDescription className="text-destructive">
              {errors.country.message}
            </FieldDescription>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : driver ? "Update Driver" : "Create Driver"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export { DriverForm, driverSchema, type DriverFormData };