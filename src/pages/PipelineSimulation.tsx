
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PipelineStage {
  instruction: number;
  stage: string;
  message: string;
}

interface CycleData {
  cycle: number;
}

type SimulationData = (CycleData | PipelineStage | { event: string, pipelining: string })[];

const PipelineSimulation: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<SimulationData>([]);
  const [cycles, setCycles] = useState<number[]>([]);
  const [maxInstructions, setMaxInstructions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("../web2.txt");
        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }
        
        const text = await response.text();
        const data: SimulationData = JSON.parse(text);
        setPipelineData(data);
        
        // Extract cycle numbers
        const cycleEntries = data.filter(entry => 'cycle' in entry) as CycleData[];
        setCycles(cycleEntries.map(entry => entry.cycle));
        
        // Find the highest instruction number
        const maxInst = data.reduce((max, entry) => {
          if ('instruction' in entry && 'stage' in entry) {
            return Math.max(max, entry.instruction);
          }
          return max;
        }, 0);
        
        setMaxInstructions(maxInst);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pipeline data:", err);
        setError("Failed to load pipeline simulation data. Please check if web2.txt is properly formatted.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStageForCycleAndInstruction = (cycle: number, instruction: number, stageName: string) => {
    // Find index of the cycle entry
    const cycleIndex = pipelineData.findIndex(entry => 'cycle' in entry && entry.cycle === cycle);
    
    if (cycleIndex === -1) return null;
    
    // Look for the stage entry after this cycle entry
    for (let i = cycleIndex + 1; i < pipelineData.length; i++) {
      const entry = pipelineData[i];
      
      // Stop if we hit the next cycle
      if ('cycle' in entry) break;
      
      // Check if this is the stage we're looking for
      if ('instruction' in entry && 'stage' in entry && 
          entry.instruction === instruction && 
          entry.stage.toLowerCase() === stageName.toLowerCase()) {
        return entry;
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pipeline Simulation</h2>
          <p className="text-muted-foreground mb-6">
            Visualizing the five-stage pipeline (Fetch, Decode, Execute, Memory, WriteBack) for RISC-V instructions.
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center animate-pulse">
              <p className="text-lg">Loading pipeline data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Cycle</TableHead>
                  <TableHead>Fetch</TableHead>
                  <TableHead>Decode</TableHead>
                  <TableHead>Execute</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>WriteBack</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cycles.map((cycle) => (
                  <TableRow key={cycle}>
                    <TableCell className="font-semibold">Cycle {cycle}</TableCell>
                    
                    {['fetch', 'decode', 'execute', 'memory', 'writeback'].map((stageName) => {
                      // For each instruction, check if it's in this stage at this cycle
                      const stagesInThisCycle = [];
                      
                      for (let i = 0; i <= maxInstructions; i++) {
                        const stageEntry = getStageForCycleAndInstruction(cycle, i, stageName);
                        if (stageEntry) {
                          stagesInThisCycle.push(stageEntry);
                        }
                      }
                      
                      return (
                        <TableCell key={stageName} className="p-0">
                          <div className="space-y-1 p-2">
                            {stagesInThisCycle.map((entry, idx) => (
                              <div 
                                key={idx}
                                className={cn(
                                  "rounded p-2 text-sm block-fix", 
                                  entry.instruction === 0 
                                    ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                    : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                )}
                              >
                                <div className="font-medium">Instruction: {entry.instruction}</div>
                                <div className="text-xs break-words">{entry.message}</div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      );
                    })}
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

export default PipelineSimulation;

