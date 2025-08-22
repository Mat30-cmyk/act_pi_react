"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

interface CardContextType {
  rotateX: MotionValue<number> | undefined;
  rotateY: MotionValue<number> | undefined;
}

export const CardContext = React.createContext<CardContextType>({
  rotateX: undefined,
  rotateY: undefined,
});

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContainer = ({ children, className }: CardContainerProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [0, 1], [0.5, -0.5]), {
    stiffness: 50,
    damping: 10,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-0.5, 0.5]), {
    stiffness: 50,
    damping: 10,
  });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const xVal = (e.clientX - rect.left) / rect.width;
    const yVal = (e.clientY - rect.top) / rect.height;
    x.set(xVal);
    y.set(yVal);
  }

  return (
    <CardContext.Provider value={{ rotateX, rotateY }}>
      <motion.div
        ref={ref}
        className={cn("relative cursor-pointer", className)}
        style={{
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          x.set(0.5);
          y.set(0.5);
        }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </CardContext.Provider>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardItemProps {
  children: React.ReactNode;
  translateZ?: string;
  className?: string;
}

export const CardItem = ({
  children,
  className,
  translateZ,
}: CardItemProps) => {
  const { rotateX, rotateY } = React.useContext(CardContext);

  const style = {
    transform: `translateZ(${translateZ})`,
    rotateX: rotateX,
    rotateY: rotateY,
  };

  return (
    <motion.div
      style={style}
      className={cn("w-fit", className)}
    >
      {children}
    </motion.div>
  );
};