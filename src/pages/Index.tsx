
import React, { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import CycleCard from "@/components/CycleCard";

interface Log {
  stage: string;
  message: string;
}

interface CycleData {
  cycle: number;
  logs: Log[];
}

const Index: React.FC = () => {
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/web.txt");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const text = await response.text();
        const data = JSON.parse(text);
        
        setCycleData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load simulation data. Please check if web.txt is properly formatted.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground px-4 sm:px-6 transition-colors duration-300">
      <header className="max-w-6xl mx-auto pt-8 pb-6 flex items-center justify-between">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">RISC-V Cycle Simulator</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Visualizing the execution cycles of RISC-V instructions
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-6xl mx-auto pb-20">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center animate-pulse">
              <p className="text-lg">Loading simulation data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cycleData.map((data) => (
              <CycleCard key={data.cycle} cycle={data.cycle} logs={data.logs} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
