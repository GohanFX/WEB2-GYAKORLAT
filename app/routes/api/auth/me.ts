import type { Route } from "./+types/me";
import { getSession } from "~/lib/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (!session.isLoggedIn || !session.userId) {
    return Response.json({ isLoggedIn: false, user: null });
  }

  return Response.json({
    isLoggedIn: true,
    user: {
      id: session.userId,
      email: session.email,
      role: session.role,
    },
  });
}
