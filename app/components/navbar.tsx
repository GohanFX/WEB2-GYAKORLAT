import React from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import AuthService from "~/lib/services/auth";
import { toast } from "sonner";
import { useAuth } from "~/lib/auth-context";

const links = [
  { to: "/", label: "Home" },
  { to: "/database", label: "Database" },
  { to: "/contact", label: "Contact" },
  { to: "/messages", label: "Messages", protected: true },
  { to: "/chart", label: "Chart" },
  { to: "/crud", label: "CRUD" },
  { to: "/admin", label: "Admin", role: "ADMIN" },
];



const Navbar = () => {
  const { user, isLoading, logout: contextLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      contextLogout();
      toast.success("Logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="flex items-center border-b border-b-zinc-200 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            Cini Web2 Gyak
          </Link>
          
          <div className="flex items-center gap-6">
            {links.map((link) => {
              if (link.protected && !user) return null;
              if (link.role && user?.role !== link.role) return null;
              return (
                <Button
                  key={link.to}
                  asChild
                  variant="ghost"
                  size="sm"
                >
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {user.email} ({user.role})
                    </span>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
