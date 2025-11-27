import { redirect } from "react-router";
import { contactRepository } from "~/lib/repositories/contact.repository";
import { getSession } from "~/lib/session.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { format } from "date-fns";
import type { Route } from "./+types/messages";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  
  if (!session.userId) {
    throw redirect("/login");
  }

  const messages = await contactRepository.findAll();
  
  return { messages, user: session };
}

export default function MessagesPage({ loaderData }: Route.ComponentProps) {
  const { messages } = loaderData;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>
            View all contact form submissions (newest first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No messages yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(message.createdAt), "PPpp")}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {message.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
