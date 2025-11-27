import type { Route } from "./+types/login";
import { prisma } from "~/lib/prisma.server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession } from "~/lib/session.server";

const loginSchema = z.object({
  username: z.string().min(1, "Username/email is required"), // We'll treat this as email
  password: z.string().min(1, "Password is required"),
});

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Find user by email (username field is used as email)
    const user = await prisma.user.findUnique({
      where: { email: validatedData.username },
    });

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);

    if (!isValidPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const sessionResponse = await createSession(request, user.id, user.email, user.role);

    // Get session cookies from the response
    const setCookieHeader = sessionResponse.headers.get("Set-Cookie");

    // Return success with session cookie
    return Response.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      {
        headers: setCookieHeader ? { "Set-Cookie": setCookieHeader } : {},
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }

    console.error("Login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
