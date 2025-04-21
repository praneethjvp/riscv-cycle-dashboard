
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ChevronsRight } from "lucide-react";

interface PipelineStage {
  instruction: number;
  stage: string;
  message: string;
}

interface CycleData {
  cycle: number;
}

type SimulationData = (CycleData | PipelineStage | { event: string; pipelining: string })[];

const PipelineSimulation: React.FC = () => {
  const [pipelineData, setPipelineData] = useState<SimulationData>([]);
  const [cycles, setCycles] = useState<number[]>([]);
  const [maxInstructions, setMaxInstructions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCycles, setVisibleCycles] = useState(0);
  const [started, setStarted] = useState(false);

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
          if ("instruction" in entry && "stage" in entry) {
            return Math.max(max, entry.instruction);
          }
          return max;
        }, 0);

        setMaxInstructions(maxInst);
        setLoading(false);
      } catch (err) {
        setError("Failed to load pipeline simulation data. Please check if web2.txt is properly formatted.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStageForCycleAndInstruction = (cycle: number, instruction: number, stageName: string) => {
    // Find index of the cycle entry
    const cycleIndex = pipelineData.findIndex(entry => "cycle" in entry && entry.cycle === cycle);
    if (cycleIndex === -1) return null;
    // Look for the stage entry after this cycle entry
    for (let i = cycleIndex + 1; i < pipelineData.length; i++) {
      const entry = pipelineData[i];
      if ("cycle" in entry) break;
      if ("instruction" in entry && "stage" in entry &&
        entry.instruction === instruction &&
        entry.stage.toLowerCase() === stageName.toLowerCase()) {
        return entry;
      }
    }
    return null;
  };

  // cycle navigation logic
  const handleStart = () => {
    setStarted(true);
    setVisibleCycles(1);
  };
  const handleNext = () => {
    if (visibleCycles < cycles.length) setVisibleCycles(visibleCycles + 1);
  };
  const handlePrev = () => {
    if (visibleCycles > 1) setVisibleCycles(visibleCycles - 1);
  };
  const handleEnd = () => {
    setVisibleCycles(cycles.length);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-end">
          <div>
            <h2 className="text-2xl font-bold mb-2">Pipeline Simulation</h2>
            <p className="text-muted-foreground mb-4">
              Visualizing the five-stage pipeline (Fetch, Decode, Execute, Memory Access, Write Back) for RISC-V instructions.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {!started ? (
              <button
                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-primary/70 transition"
                onClick={handleStart}
              >
                Start Simulation
              </button>
            ) : (
              <>
                <button
                  className={`p-2 rounded-lg transition ${visibleCycles === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/10"}`}
                  disabled={visibleCycles === 1}
                  onClick={handlePrev}
                  aria-label="Previous cycle"
                >
                  <ArrowLeft size={22} />
                </button>
                <button
                  className={`p-2 rounded-lg transition ${visibleCycles >= cycles.length ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/10"}`}
                  onClick={handleNext}
                  disabled={visibleCycles >= cycles.length}
                  aria-label="Next cycle"
                >
                  <ArrowRight size={22} />
                </button>
                <button
                  className={`p-2 rounded-lg transition ${visibleCycles >= cycles.length ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/10"}`}
                  onClick={handleEnd}
                  disabled={visibleCycles >= cycles.length}
                  aria-label="Show all cycles"
                >
                  <ChevronsRight size={22} />
                </button>
              </>
            )}
          </div>
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
          <div>
            {/* Only show table once simulation started */}
            {started &&
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-28">Cycle</TableHead>
                      <TableHead className="w-44">Fetch</TableHead>
                      <TableHead className="w-44">Decode</TableHead>
                      <TableHead className="w-44">Execute</TableHead>
                      <TableHead className="w-44">Memory Access</TableHead>
                      <TableHead className="w-44">Write Back</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(visibleCycles).keys()].map(idx => (
                      <TableRow key={cycles[idx]}>
                        <TableCell className="font-semibold block-fix">Cycle {cycles[idx]}</TableCell>
                        {/* Render columns for 5 stages */}
                        {["fetch", "decode", "execute", "memory", "writeback"].map((stageName) => {
                          const stagesInThisCycle = [];
                          for (let i = 0; i <= maxInstructions; i++) {
                            const stageEntry = getStageForCycleAndInstruction(cycles[idx], i, stageName);
                            if (stageEntry) {
                              stagesInThisCycle.push(stageEntry);
                            }
                          }
                          return (
                            <TableCell key={stageName} className="p-0 block-fix">
                              <div className="space-y-1">
                                {stagesInThisCycle.map((entry, n) => (
                                  <div
                                    key={n}
                                    className={cn(
                                      "rounded p-2 text-sm shadow-sm border transition-all font-mono",
                                      entry.instruction === 0
                                        ? "bg-destructive/20 border-destructive text-destructive"
                                        : "bg-primary/10 border-primary text-primary"
                                    )}
                                  >
                                    <div className="font-semibold">
                                      Instruction: {entry.instruction}
                                    </div>
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
            }
          </div>
        )}
      </main>
    </div>
  );
};

export default PipelineSimulation;
