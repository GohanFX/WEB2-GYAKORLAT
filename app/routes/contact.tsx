import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "sonner";
import { useFetcher, useNavigate } from "react-router";
import { contactRepository } from "~/lib/repositories/contact.repository";
import type { Route } from "./+types/contact";
import { useEffect } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactData = z.infer<typeof contactSchema>;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  // Server-side validation
  const result = contactSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await contactRepository.create(data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: { _form: ["Failed to save contact message"] },
    };
  }
}

type ActionResult = Awaited<ReturnType<typeof action>>;

export default function ContactPage({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const fetcher = useFetcher<typeof action>();
  const isSubmittingForm = fetcher.state === "submitting";

  const onSubmit = (data: ContactData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    fetcher.submit(data, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success("Message sent successfully!");
      reset();
      setTimeout(() => navigate("/"), 2000);
    } else if (fetcher.data?.success === false) {
      if (fetcher.data.errors) {
        Object.values(fetcher.data.errors).forEach((errorMessages) => {
          errorMessages?.forEach((message) => {
            toast.error(message);
          });
        });

      }
    }
  }, [fetcher.data, reset, navigate]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <FieldDescription className="text-destructive">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input
                  id="subject"
                  placeholder="What is this about?"
                  {...register("subject")}
                  aria-invalid={errors.subject ? "true" : "false"}
                />
                {errors.subject && (
                  <FieldDescription className="text-destructive">
                    {errors.subject.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={6}
                  {...register("message")}
                  aria-invalid={errors.message ? "true" : "false"}
                />
                {errors.message && (
                  <FieldDescription className="text-destructive">
                    {errors.message.message}
                  </FieldDescription>
                )}
              </Field>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </FieldGroup>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
