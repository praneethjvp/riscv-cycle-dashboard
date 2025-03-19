
import React from "react";
import StageItem from "./StageItem";

interface Log {
  stage: string;
  message: string;
}

interface CycleCardProps {
  cycle: number;
  logs: Log[];
}

const CycleCard: React.FC<CycleCardProps> = ({ cycle, logs }) => {
  return (
    <div className="glass-card rounded-xl p-4 backdrop-blur-sm shadow-sm animate-scale-in hover:shadow-md transition-shadow duration-300">
      <div className="mb-3 pb-2 border-b border-border">
        <h3 className="text-lg font-semibold">Cycle {cycle}</h3>
      </div>
      <div className="space-y-2 divide-y divide-border/50">
        {logs.map((log, index) => (
          <StageItem key={index} stage={log.stage} message={log.message} />
        ))}
      </div>
    </div>
  );
};

export default CycleCard;
