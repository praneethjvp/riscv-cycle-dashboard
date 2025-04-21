import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MemoryEntry {
  address: string;
  value: string;
}

const Memory: React.FC = () => {
  const [memoryData, setMemoryData] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("../data.mc");
        if (!response.ok) {
          throw new Error("Failed to fetch memory data");
        }
        
        const text = await response.text();
        const entries = text.trim().split('\n').map(line => {
          const [address, value] = line.split(' ');
          return { address, value };
        });
        
        setMemoryData(entries);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching memory data:", err);
        setError("Failed to load memory data. Please check if data.mc file exists and is properly formatted.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Memory Contents</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Displaying memory values from the RISC-V processor's memory space.
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center animate-pulse">
              <p className="text-lg">Loading memory data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center min-h-[30vh]">
            <h3 className="text-lg font-medium text-muted-foreground">Memory visualization is removed as requested.</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default Memory;
