// Replace with a simple implementation without the Radix UI dependency
import React from "react";
import { cn } from "@/lib/utils";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{
          ...style,
          paddingBottom: `${(1 / ratio) * 100}%`,
        }}
        {...props}
      >
        <div className="absolute inset-0 h-full w-full">{props.children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };

