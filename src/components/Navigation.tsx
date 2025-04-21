
import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// Collapsible group component for better navigation grouping
const NavGroup: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <div className="uppercase tracking-wider text-xs font-semibold text-muted-foreground opacity-70 px-2 mt-2">
      {title}
    </div>
    <div className="flex flex-col gap-1 px-2">{children}</div>
  </div>
);

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-border/30 backdrop-blur-sm sticky top-0 z-10 bg-background/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-accent bg-clip-text text-transparent">
            RISC-V Cycle Simulator
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {location.pathname === "/" && "Cycles Overview"}
            {location.pathname === "/traverse" && "Traverse execution cycles"}
            {location.pathname === "/pipeline" && "Pipeline Simulation"}
            {location.pathname === "/memory" && "Memory View"}
            {location.pathname === "/statistics" && "Performance Analysis"}
          </p>
        </div>
        <nav className="flex gap-6">
          <div className="flex flex-col gap-2">
            <NavGroup title="Phase 2">
              <Link
                to="/"
                className={`transition-colors rounded text-sm px-3 py-2 ${
                  isActive("/")
                    ? "bg-primary/20 text-primary font-semibold"
                    : "hover:bg-accent/15 text-foreground/70"
                }`}
              >
                Overview
              </Link>
              <Link
                to="/traverse"
                className={`transition-colors rounded text-sm px-3 py-2 ${
                  isActive("/traverse")
                    ? "bg-primary/20 text-primary font-semibold"
                    : "hover:bg-accent/15 text-foreground/70"
                }`}
              >
                Traverse
              </Link>
            </NavGroup>
            <NavGroup title="Phase 3">
              <Link
                to="/statistics"
                className={`transition-colors rounded text-sm px-3 py-2 ${
                  isActive("/statistics")
                    ? "bg-primary/20 text-primary font-semibold"
                    : "hover:bg-accent/15 text-foreground/70"
                }`}
              >
                Statistics
              </Link>
              <Link
                to="/pipeline"
                className={`transition-colors rounded text-sm px-3 py-2 ${
                  isActive("/pipeline")
                    ? "bg-primary/20 text-primary font-semibold"
                    : "hover:bg-accent/15 text-foreground/70"
                }`}
              >
                Pipeline Simulation
              </Link>
              <Link
                to="/memory"
                className={`transition-colors rounded text-sm px-3 py-2 ${
                  isActive("/memory")
                    ? "bg-primary/20 text-primary font-semibold"
                    : "hover:bg-accent/15 text-foreground/70"
                }`}
              >
                Memory
              </Link>
            </NavGroup>
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
