
import React from "react";
import StageItem from "./StageItem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Log {
  stage: string;
  message: string;
}

interface CycleCardProps {
  cycle: number;
  logs: Log[];
}

const CycleCard: React.FC<CycleCardProps> = ({ cycle, logs }) => {
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
        <StageItem stage="Fetch" message={getStageMessage("fetch")} />
        <StageItem stage="Decode" message={getStageMessage("decode")} />
        <StageItem stage="Execute" message={getStageMessage("execute")} />
        <StageItem stage="Memory" message={getStageMessage("memory")} />
        <StageItem stage="WriteBack" message={getStageMessage("writeback")} />
        
        {/* Display any other stages if present */}
        {logs.filter(log => 
          !["fetch", "decode", "execute", "memory", "writeback"].includes(log.stage.toLowerCase())
        ).map((log, index) => (
          <StageItem key={index} stage={log.stage} message={log.message} />
        ))}
      </CardContent>
    </Card>
  );
};

export default CycleCard;
