import { redirect } from "react-router";
import { getSession } from "~/lib/session.server";
import { prisma } from "~/lib/prisma.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { Route } from "./+types/admin";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  
  if (!session.userId || session.role !== "ADMIN") {
    throw redirect("/");
  }

  const [userCount, driverCount, gpCount, resultCount, contactCount] = await Promise.all([
    prisma.user.count(),
    prisma.driver.count(),
    prisma.gP.count(),
    prisma.result.count(),
    prisma.contact.count(),
  ]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return {
    stats: {
      users: userCount,
      drivers: driverCount,
      gps: gpCount,
      results: resultCount,
      contacts: contactCount,
    },
    recentUsers: users,
  };
}

export default function AdminPage({ loaderData }: Route.ComponentProps) {
  const { stats, recentUsers } = loaderData;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your application and view statistics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drivers</CardTitle>
            <CardDescription>Total F1 drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.drivers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grand Prix</CardTitle>
            <CardDescription>Total GP events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.gps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Total race results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.results}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>Total messages received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.contacts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Last 10 registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant={user.role === "ADMIN" ? "destructive" : "default"}>
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
