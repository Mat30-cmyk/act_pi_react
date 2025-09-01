"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./DynamicWave.module.css"; 

const DynamicWave = () => {
  const waveRef = useRef<SVGPolylineElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const timeRef = useRef<number>(0);

  const centerY = height / 2;

  const amplitude = Math.max(50, Math.min(150, height * 0.2));

  const pointsCount = Math.floor(width / 10) + 1; 

  const [beats, setBeats] = useState<number[]>(Array(pointsCount).fill(0));

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const animateWave = useCallback(() => {
    const points = [];
    points.push(`0,${centerY}`);

    setBeats((prevBeats) => {
      const newBeats = [...prevBeats];
      for (let i = 1; i < pointsCount - 1; i++) {
        if (Math.random() < 0.05) {
          newBeats[i] = (Math.random() - 0.5) * (1 + Math.random() * 2);
        } else {
          newBeats[i] *= 0.93 + Math.random() * 0.04;
        }
      }
      return newBeats;
    });

    timeRef.current += 1;
    const currentTime = timeRef.current;

    for (let i = 1; i < pointsCount - 1; i++) {
      const x = i * (width / (pointsCount - 1));
      const base =
        0.5 * Math.sin(x * 0.02 + currentTime / 80) +
        0.5 * Math.sin(x * 0.015 + currentTime / 160) + 
        0.3 * Math.sin(x * 0.032 + currentTime / 220) + 
        0.2 * Math.sin(x * 0.007 - currentTime / 90); 
      const burst = base * 0.5 + beats[i] * 0.7;
      const y = centerY + burst * amplitude;
      points.push(`${x},${y}`);
    }

    points.push(`${width},${centerY}`);
    points.push(`${width},${height}`);
    points.push(`0,${height}`);
    points.push(`0,${centerY}`);

    if (waveRef.current) {
      waveRef.current.setAttribute("points", points.join(" "));
    }

    animationFrameId.current = requestAnimationFrame(animateWave);
  }, [width, height, centerY, amplitude, pointsCount, beats]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animateWave);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animateWave]);

  return (
    <svg
      className={styles.miniSvg}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(4,72,124)" />
          <stop offset="50%" stopColor="rgb(39,33,80)" />
          <stop offset="100%" stopColor="rgb(85,19,51)" />
        </linearGradient>
      </defs>
      <polyline
        ref={waveRef}
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="2"
      />
    </svg>
  );
};

export default DynamicWave;