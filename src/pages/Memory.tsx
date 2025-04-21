
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
          const [address, value] = line.split(" ");
          return { address, value };
        });
        setMemoryData(entries);
        setLoading(false);
      } catch (err) {
        setError("Failed to load memory data. Please check if data.mc file exists and is properly formatted.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Memory Contents</h2>
          <p className="text-muted-foreground mb-6">
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
          <div className="rounded-2xl border shadow-lg bg-card text-card-foreground px-4 py-6 artistic-shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2 font-bold text-lg">Memory Address</TableHead>
                  <TableHead className="w-1/2 font-bold text-lg">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memoryData.map((entry, index) => (
                  <TableRow key={index} className="hover:bg-primary/5 transition">
                    <TableCell className="font-mono text-base text-primary">{entry.address}</TableCell>
                    <TableCell className="font-mono text-base text-accent">{entry.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Memory;
