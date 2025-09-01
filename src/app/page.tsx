import React from "react";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Soundwave from "../components/Soundwave/Soundwave";
import DynamicWave from "../components/DynamicWave/DynamicWave";

export default function Home() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(135deg, #0a1026 0%, #1a0033 100%)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <DynamicWave />
      </div>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <DynamicWave />
      </div>
      <div
        style={{
          position: "relative",
          width: "900px",
          height: "900px",
          margin: "0 auto",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Soundwave width="750px" height="750px">
          <Image
            src="/Logo-Definitivo.png"
            alt="Logo"
            width={800}
            height={800}
            style={{ objectFit: "contain" }}
          />
        </Soundwave>
      </div>
    </>
  );
}