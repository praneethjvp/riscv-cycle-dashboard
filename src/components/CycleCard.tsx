
import React from "react";
import StageItem from "./StageItem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Log {
  stage: string;
  message: string;
}

interface Register {
  reg: string;
  value: string;
}

interface Memory {
  address: string;
  value: string;
}

interface CycleCardProps {
  cycle: number;
  logs: Log[];
  registers?: Register[];
  memory?: Memory[];
}

const CycleCard: React.FC<CycleCardProps> = ({ cycle, logs, registers, memory }) => {
  // Filter for the five main stages (or use default message if not found)
  const getStageMessage = (stageName: string) => {
    const log = logs.find(log => log.stage.toLowerCase() === stageName.toLowerCase());
    return log ? log.message : "No data available";
  };

  return (
    <Card className="animate-scale-in transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center font-semibold">Cycle {cycle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <StageItem stage="Fetch" message={getStageMessage("fetch")} />
          <StageItem stage="Decode" message={getStageMessage("decode")} />
          <StageItem stage="Execute" message={getStageMessage("execute")} />
          <StageItem stage="Memory" message={getStageMessage("memory")} />
          <StageItem stage="WriteBack" message={getStageMessage("writeback")} />
        </div>
        
        {/* Display registers if available */}
        {registers && registers.length > 0 && (
          <div className="mt-4 border border-border/30 rounded-md p-2">
            <h3 className="text-sm font-medium mb-2">Registers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 text-xs">
              {registers.map((reg, index) => (
                <div key={index} className="flex justify-between bg-secondary/20 p-1 rounded">
                  <span className="font-mono mr-1">{reg.reg}:</span>
                  <span className="font-mono truncate">{reg.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Display memory if available */}
        {memory && memory.length > 0 && (
          <div className="mt-4 border border-border/30 rounded-md p-2">
            <h3 className="text-sm font-medium mb-2">Memory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 auto-rows-auto gap-1 text-xs">
              {memory.map((mem, index) => (
                <div key={index} className="flex justify-between bg-secondary/20 p-1 rounded">
                  <span className="font-mono mr-1">{mem.address}:</span>
                  <span className="font-mono truncate">{mem.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CycleCard;
