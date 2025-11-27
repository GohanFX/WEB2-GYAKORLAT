import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Formula 1 Hub - Your Racing Portal" },
    { name: "description", content: "Explore Formula 1 data, results, and more!" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white rounded-lg shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="mb-4 px-4 py-2 text-sm" variant="secondary">
              🏎️ Formula 1 Data Hub
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-300">
              Experience the Speed of Data
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Your comprehensive platform for Formula 1 statistics, race results, driver information, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/database">Explore Database</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Link to="/chart">View Charts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to explore the world of Formula 1
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle>Database Explorer</CardTitle>
                <CardDescription>
                  Browse through comprehensive F1 data including drivers, races, and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/database">Explore →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <CardTitle>Interactive Charts</CardTitle>
                <CardDescription>
                  Visualize racing statistics with beautiful, interactive charts and graphs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/chart">View Charts →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">✏️</span>
                </div>
                <CardTitle>CRUD Operations</CardTitle>
                <CardDescription>
                  Create, read, update, and delete data with our intuitive interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/crud">Manage Data →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  View and manage all contact messages and communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/messages">View Messages →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                  Get in touch with us for questions, feedback, or support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/contact">Contact →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Access administrative features and manage the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0">
                  <Link to="/admin">Admin →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Dive In?
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Start exploring Formula 1 data today and discover insights about your favorite drivers and races.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/database">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white text-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}
