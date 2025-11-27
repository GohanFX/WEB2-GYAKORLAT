import { getIronSession, type IronSession } from "iron-session";

export interface SessionData {
  userId?: number;
  email?: string;
  role?: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_for_security",
  cookieName: "web2_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(request: Request): Promise<IronSession<SessionData>> {
  const response = new Response();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  return session;
}

export async function createSession(
  request: Request,
  userId: number,
  email: string,
  role: string
): Promise<Response> {
  const response = new Response();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  
  session.userId = userId;
  session.email = email;
  session.role = role;
  session.isLoggedIn = true;
  
  await session.save();
  
  return response;
}

export async function destroySession(request: Request): Promise<Response> {
  const response = new Response();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  
  session.destroy();
  
  return response;
}

export function requireAuth(session: IronSession<SessionData>) {
  if (!session.isLoggedIn || !session.userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session;
}

export function requireRole(session: IronSession<SessionData>, allowedRoles: string[]) {
  requireAuth(session);
  
  if (!session.role || !allowedRoles.includes(session.role)) {
    throw new Response("Forbidden", { status: 403 });
  }
  
  return session;
}
