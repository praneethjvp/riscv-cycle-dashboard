
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface StatisticsData {
  totalCycles: number;
  totalInstructions: number;
  cpi: number;
  dataTransfer: number;
  aluInstructions: number;
  controlInstructions: number;
  totalStalls: number;
  dataHazards: number;
  controlHazards: number;
  branchMispredictions: number;
  stallsDataHazards: number;
  stallsControlHazards: number;
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("../web3.txt");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics data");
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center animate-pulse">
          <p className="text-lg">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p>{error || "Failed to load statistics"}</p>
        </div>
      </div>
    );
  }

  const instructionTypeData = [
    { name: "Data Transfer", value: stats.dataTransfer },
    { name: "ALU", value: stats.aluInstructions },
    { name: "Control", value: stats.controlInstructions },
  ];

  const hazardData = [
    { name: "Data Hazards", value: stats.dataHazards },
    { name: "Control Hazards", value: stats.controlHazards },
    { name: "Branch Mispredictions", value: stats.branchMispredictions },
  ];

  const stallsData = [
    { name: "Data Hazards", value: stats.stallsDataHazards },
    { name: "Control Hazards", value: stats.stallsControlHazards },
  ];

  const COLORS = ["#1DCD9F", "#169976", "#222222"];

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border/30 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Pipeline Statistics
            </h1>
            <p className="text-muted-foreground mt-2">
              Performance Analysis and Metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Overview
            </Link>
            <Link 
              to="/traverse" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Traverse
            </Link>
            <Link 
              to="/pipeline" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pipeline
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Instruction Types</h2>
            <ChartContainer config={{}} className="w-full aspect-square">
              <PieChart>
                <Pie
                  data={instructionTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {instructionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Hazards Distribution</h2>
            <ChartContainer config={{}} className="w-full aspect-square">
              <BarChart data={hazardData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1DCD9F" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-primary/10">
              <h3 className="text-sm font-medium text-muted-foreground">Total Cycles</h3>
              <p className="text-2xl font-bold">{stats.totalCycles}</p>
            </div>
            <div className="p-4 rounded-md bg-primary/10">
              <h3 className="text-sm font-medium text-muted-foreground">Instructions Executed</h3>
              <p className="text-2xl font-bold">{stats.totalInstructions}</p>
            </div>
            <div className="p-4 rounded-md bg-primary/10">
              <h3 className="text-sm font-medium text-muted-foreground">CPI</h3>
              <p className="text-2xl font-bold">{stats.cpi}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground">
          <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Total Cycles:</span> {stats.totalCycles}</p>
            <p><span className="text-muted-foreground">Total Instructions Executed:</span> {stats.totalInstructions}</p>
            <p><span className="text-muted-foreground">Cycles Per Instruction (CPI):</span> {stats.cpi}</p>
            <p><span className="text-muted-foreground">Data-transfer Instructions:</span> {stats.dataTransfer}</p>
            <p><span className="text-muted-foreground">ALU Instructions:</span> {stats.aluInstructions}</p>
            <p><span className="text-muted-foreground">Control Instructions:</span> {stats.controlInstructions}</p>
            <p><span className="text-muted-foreground">Total Stalls/Bubbles:</span> {stats.totalStalls}</p>
            <p><span className="text-muted-foreground">Data Hazards:</span> {stats.dataHazards}</p>
            <p><span className="text-muted-foreground">Control Hazards:</span> {stats.controlHazards}</p>
            <p><span className="text-muted-foreground">Branch Mispredictions:</span> {stats.branchMispredictions}</p>
            <p><span className="text-muted-foreground">Stalls due to Data Hazards:</span> {stats.stallsDataHazards}</p>
            <p><span className="text-muted-foreground">Stalls due to Control Hazards:</span> {stats.stallsControlHazards}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
