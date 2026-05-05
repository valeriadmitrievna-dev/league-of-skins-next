"use client";
import { FC, PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/shared/cn";

const R = 345;
const SPEED = 3;

const getCCSVariable = (name: string) => {
  return getComputedStyle(document.body).getPropertyValue(name);
};

const BackgroundCanvas: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const CX = width / 2;
    const CY = height / 2;

    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = width;
    bgCanvas.height = height;
    const bgCtx = bgCanvas.getContext("2d")!;
    const grad = bgCtx.createRadialGradient(CX, CY, 0, CX, CY, width * 0.6);
    grad.addColorStop(0, "#0d1a2e");
    grad.addColorStop(1, "#070c14");
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, width, height);

    const drawDiamond = (x: number, y: number) => {
      const s = 4.5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = getCCSVariable("--color-primary");
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = 0.75;
      ctx.strokeRect(-s, -s, s * 2, s * 2);
      ctx.fillStyle = getCCSVariable("--color-primary");
      ctx.globalAlpha = 0.5;
      ctx.fillRect(-1.4, -1.4, 2.8, 2.8);
      ctx.restore();
    };

    const render = (timestamp: number) => {
      const angle = (timestamp * SPEED) / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bgCanvas, 0, 0);

      // Horizontal line
      // ctx.strokeStyle = GOLD;
      // ctx.lineWidth = 0.8;
      // ctx.globalAlpha = 0.45;
      // ctx.beginPath();
      // ctx.moveTo(0, CY);
      // ctx.lineTo(CX - R, CY);
      // ctx.stroke();
      // ctx.beginPath();
      // ctx.moveTo(CX + R, CY);
      // ctx.lineTo(W, CY);
      // ctx.stroke();

      // Main circle
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = getCCSVariable("--color-primary");
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.stroke();

      // Main circle ticks
      const inner = R - 24;
      const outer = R - 8;
      ctx.strokeStyle = getCCSVariable("--color-muted-foreground");
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.25;
      for (let deg = 0; deg < 360; deg += 1) {
        const rad = ((deg + angle) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(CX + inner * Math.cos(rad), CY + inner * Math.sin(rad));
        ctx.lineTo(CX + outer * Math.cos(rad), CY + outer * Math.sin(rad));
        ctx.stroke();
      }

      // Outer ticks
      const ARC_R = width / 2.3;
      const innerO = ARC_R + 600;
      const outerO = ARC_R + 16;
      ctx.strokeStyle = getCCSVariable("--color-muted-foreground");
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.1;
      for (let deg = 0; deg < 360; deg += 1) {
        const rad = ((deg - angle) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(CX + innerO * Math.cos(rad), CY + innerO * Math.sin(rad));
        ctx.lineTo(CX + outerO * Math.cos(rad), CY + outerO * Math.sin(rad));
        ctx.stroke();
      }

      for (let deg = 7.5; deg < 367.5; deg += 15) {
        const rad = ((deg + angle) * Math.PI) / 180;
        drawDiamond(CX + ARC_R * Math.cos(rad), CY + ARC_R * Math.sin(rad));
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height]);

  useLayoutEffect(() => {
    if (!parentRef.current) return;

    const obs = new ResizeObserver(() => {
      setWidth(parentRef.current?.getBoundingClientRect().width ?? 1920);
      setHeight(parentRef.current?.getBoundingClientRect().height ?? 1080);
    });

    obs.observe(parentRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={parentRef} className={cn("size-full relative bg-background", className)}>
      <canvas ref={canvasRef} width={width} height={height} className="size-full object-cover object-center" />
      <div className="absolute-center">{children}</div>
    </div>
  );
};

export default BackgroundCanvas;
