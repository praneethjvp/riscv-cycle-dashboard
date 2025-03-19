
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
    <div className={cn(
      "rounded-md p-3 my-2 transition-colors duration-300",
      {
        "bg-fetch-light dark:bg-fetch-dark": normalizedStage === "fetch",
        "bg-decode-light dark:bg-decode-dark": normalizedStage === "decode",
        "bg-execute-light dark:bg-execute-dark": normalizedStage === "execute",
        "bg-memory-light dark:bg-memory-dark": normalizedStage === "memory",
        "bg-writeback-light dark:bg-writeback-dark": normalizedStage === "writeback",
        "bg-secondary/30 dark:bg-secondary/40": !["fetch", "decode", "execute", "memory", "writeback"].includes(normalizedStage)
      }
    )}>
      <div className={cn(
        "text-sm font-medium mb-1",
        {
          "text-fetch-text-light dark:text-fetch-text-dark": normalizedStage === "fetch",
          "text-decode-text-light dark:text-decode-text-dark": normalizedStage === "decode",
          "text-execute-text-light dark:text-execute-text-dark": normalizedStage === "execute",
          "text-memory-text-light dark:text-memory-text-dark": normalizedStage === "memory",
          "text-writeback-text-light dark:text-writeback-text-dark": normalizedStage === "writeback"
        }
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
