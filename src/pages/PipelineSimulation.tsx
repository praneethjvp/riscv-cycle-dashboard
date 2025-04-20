import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
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
      <Navigation />
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
