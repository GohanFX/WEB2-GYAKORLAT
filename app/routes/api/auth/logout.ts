import type { Route } from "./+types/logout";
import { destroySession } from "~/lib/session.server";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const sessionResponse = await destroySession(request);
    const setCookieHeader = sessionResponse.headers.get("Set-Cookie");

    return Response.json(
      { success: true },
      {
        headers: setCookieHeader ? { "Set-Cookie": setCookieHeader } : {},
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Logout failed" }, { status: 500 });
  }
}
