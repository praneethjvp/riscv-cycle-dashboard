
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PipelineStage {
  stage: string;
  instruction: number;
  message: string;
}

interface CyclePipeline {
  cycle: number;
  stages: PipelineStage[];
}

const PipelineSimulation: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<CyclePipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxInstructions, setMaxInstructions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("../web2.txt");
        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }
        
        const text = await response.text();
        const data = JSON.parse(text);
        setPipelineData(data);
        
        // Find the highest instruction number
        const maxInst = data.reduce((max: number, cycle: CyclePipeline) => {
          const cycleMax = cycle.stages.reduce((cMax: number, stage: PipelineStage) => 
            Math.max(cMax, stage.instruction), 0);
          return Math.max(max, cycleMax);
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

  const getStageForInstruction = (instruction: number, stage: string) => {
    for (const cycle of pipelineData) {
      const matchingStage = cycle.stages.find(
        s => s.instruction === instruction && s.stage.toLowerCase() === stage.toLowerCase()
      );
      if (matchingStage) {
        return matchingStage.message;
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border/30 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Pipeline Simulation
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Instruction Pipeline View
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
              Traverse Cycles
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
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
                  <TableHead className="w-24">Instruction</TableHead>
                  <TableHead>Fetch</TableHead>
                  <TableHead>Decode</TableHead>
                  <TableHead>Execute</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>WriteBack</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: maxInstructions }, (_, i) => i + 1).map((instruction) => (
                  <TableRow key={instruction}>
                    <TableCell className="font-medium">I{instruction}</TableCell>
                    <TableCell className="text-stage-fetch">
                      {getStageForInstruction(instruction, 'Fetch')}
                    </TableCell>
                    <TableCell className="text-stage-decode">
                      {getStageForInstruction(instruction, 'Decode')}
                    </TableCell>
                    <TableCell className="text-stage-execute">
                      {getStageForInstruction(instruction, 'Execute')}
                    </TableCell>
                    <TableCell className="text-stage-memory">
                      {getStageForInstruction(instruction, 'Memory')}
                    </TableCell>
                    <TableCell className="text-stage-writeback">
                      {getStageForInstruction(instruction, 'WriteBack')}
                    </TableCell>
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
