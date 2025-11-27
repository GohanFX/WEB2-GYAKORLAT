import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { resultRepository } from "~/lib/repositories/result.repository";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/chart";

Chart.register(...registerables);

export async function loader({}: Route.LoaderArgs) {
  const results = await resultRepository.findAll();
  
  // Count wins per driver (position 1)
  const wins: Record<string, number> = {};
  results.forEach((result) => {
    if (result.position === 1) {
      wins[result.driver.name] = (wins[result.driver.name] || 0) + 1;
    }
  });

  // Get top 10 drivers by wins
  const topDrivers = Object.entries(wins)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, wins: count }));

  return { topDrivers };
}

export default function ChartPage({ loaderData }: Route.ComponentProps) {
  const { topDrivers } = loaderData;
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: topDrivers.map((d) => d.name),
        datasets: [
          {
            label: "Number of Wins",
            data: topDrivers.map((d) => d.wins),
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          title: {
            display: true,
            text: "Top 10 Drivers by Race Wins",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [topDrivers]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Driver Statistics</CardTitle>
          <CardDescription>
            Visualizing race wins by drivers using Chart.js
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <canvas ref={chartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {topDrivers.map((driver, index) => (
          <Card key={driver.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                #{index + 1} {driver.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driver.wins} wins</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
