import { driverRepository } from "~/lib/repositories/driver.repository";
import { gpRepository } from "~/lib/repositories/gp.repository";
import { resultRepository } from "~/lib/repositories/result.repository";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/database";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const sp = url.searchParams;

  const driversPage = parseInt(sp.get("driversPage") ?? "1");
  const gpsPage = parseInt(sp.get("gpsPage") ?? "1");
  const resultsPage = parseInt(sp.get("resultsPage") ?? "1");
  const pageSize = parseInt(sp.get("pageSize") ?? "10");

  const [drivers, gps, results] = await Promise.all([
    driverRepository.getPaginated(driversPage, pageSize),
    gpRepository.getPaginated(gpsPage, pageSize),
    resultRepository.getPaginated(resultsPage, pageSize),
  ]);

  return { drivers, gps, results };
}

export default function DatabasePage({ loaderData }: Route.ComponentProps) {
  const { drivers, gps, results } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "drivers";

  const driversPage = drivers.page ?? 1;
  const gpsPage = gps.page ?? 1;
  const resultsPage = results.page ?? 1;
  const pageSize = drivers.pageSize ?? 10;

  const driversTotalPages = Math.max(1, Math.ceil((drivers.total ?? 0) / pageSize));
  const gpsTotalPages = Math.max(1, Math.ceil((gps.total ?? 0) / pageSize));
  const resultsTotalPages = Math.max(1, Math.ceil((results.total ?? 0) / pageSize));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Database Overview</h1>
        <p className="text-muted-foreground">
          View data from Driver, GP, and Result tables
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="w-full" onValueChange={(e) => {
        setSearchParams((prev) => {
          prev.set("tab", e);
          return prev;
        })
      }} >
        <TabsList className="grid w-full grid-cols-3" >
          <TabsTrigger value="drivers">Drivers ({drivers.total ?? 0})</TabsTrigger>
          <TabsTrigger value="gps">Grand Prix ({gps.total ?? 0})</TabsTrigger>
          <TabsTrigger value="results">Results ({results.total ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Formula 1 Drivers</CardTitle>
              <CardDescription>List of all drivers in the database</CardDescription>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.data.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>{driver.id}</TableCell>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.sex}</TableCell>
                      <TableCell>{format(new Date(driver.birthDate), "PPP")}</TableCell>
                      <TableCell>{driver.country}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {driversPage} of {driversTotalPages} — {drivers.total} drivers
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const next = Math.max(1, driversPage - 1);
                      searchParams.set("driversPage", String(next));
                      searchParams.set("pageSize", String(pageSize));
                      searchParams.set("tab", "drivers");
                      setSearchParams(searchParams);
                    }}
                    disabled={driversPage <= 1}
                  >
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const next = Math.min(driversTotalPages, driversPage + 1);
                      searchParams.set("driversPage", String(next));
                      searchParams.set("pageSize", String(pageSize));
                      searchParams.set("tab", "drivers");
                      setSearchParams(searchParams);
                    }}
                    disabled={driversPage >= driversTotalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Grand Prix Events</CardTitle>
              <CardDescription>List of all GP races in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gps.data.map((gp) => (
                    <TableRow key={gp.date.toString()}>
                      <TableCell>{format(new Date(gp.date), "PPP")}</TableCell>
                      <TableCell className="font-medium">{gp.name}</TableCell>
                      <TableCell>{gp.country}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {gpsPage} of {gpsTotalPages} — {gps.total} GP events
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const next = Math.max(1, gpsPage - 1);
                      searchParams.set("gpsPage", String(next));
                      searchParams.set("pageSize", String(pageSize));
                      searchParams.set("tab", "gps");
                      setSearchParams(searchParams);
                    }}
                    disabled={gpsPage <= 1}
                  >
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const next = Math.min(gpsTotalPages, gpsPage + 1);
                      searchParams.set("gpsPage", String(next));
                      searchParams.set("pageSize", String(pageSize));
                      searchParams.set("tab", "gps");
                      setSearchParams(searchParams);
                    }}
                    disabled={gpsPage >= gpsTotalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Race Results</CardTitle>
              <CardDescription>List of all race results in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>GP</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Engine</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.data.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.gp.name}</TableCell>
                        <TableCell>{format(new Date(result.gpDate), "PP")}</TableCell>
                        <TableCell>{result.driver.name}</TableCell>
                        <TableCell>
                          {result.position ? (
                            <span className="font-semibold">{result.position}</span>
                          ) : (
                            <span className="text-muted-foreground">DNF</span>
                          )}
                        </TableCell>
                        <TableCell>{result.team || "-"}</TableCell>
                        <TableCell>{result.engine || "-"}</TableCell>
                        <TableCell>{result.type || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {resultsPage} of {resultsTotalPages} — {results.total} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const next = Math.max(1, resultsPage - 1);
                        searchParams.set("resultsPage", String(next));
                        searchParams.set("pageSize", String(pageSize));
                        searchParams.set("tab", "results");
                        setSearchParams(searchParams);
                      }}
                      disabled={resultsPage <= 1}
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        const next = Math.min(resultsTotalPages, resultsPage + 1);
                        searchParams.set("resultsPage", String(next));
                        searchParams.set("pageSize", String(pageSize));
                        searchParams.set("tab", "results");
                        setSearchParams(searchParams);
                      }}
                      disabled={resultsPage >= resultsTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
