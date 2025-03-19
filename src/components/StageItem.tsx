
import React from "react";
import { cn } from "@/lib/utils";

interface StageItemProps {
  stage: string;
  message: string;
}

const StageItem: React.FC<StageItemProps> = ({ stage, message }) => {
  // Normalize stage name for CSS class (lowercase, remove spaces)
  const normalizedStage = stage.toLowerCase().replace(/\s+/g, "");
  
  return (
    <div className="flex flex-col space-y-1 animate-fade-in-up py-2 px-1">
      <div className={cn(
        "text-sm font-medium",
        `stage-${normalizedStage}`
      )}>
        {stage}
      </div>
      <div className="text-sm text-foreground/90 font-light">
        {message}
      </div>
    </div>
  );
};

export default StageItem;
