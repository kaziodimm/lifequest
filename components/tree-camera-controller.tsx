"use client";

import { useEffect } from "react";
import { LocateFixed, Minus, Plus } from "lucide-react";

type CameraControlProps = {
  className?: string;
};

function dispatchZoom(stage: HTMLElement, deltaY: number, clientX?: number, clientY?: number) {
  const rect = stage.getBoundingClientRect();
  const event = new WheelEvent("wheel", {
    bubbles: true,
    cancelable: true,
    deltaY,
    clientX: clientX ?? rect.left + rect.width / 2,
    clientY: clientY ?? rect.top + rect.height / 2
  });

  stage.dispatchEvent(event);
}

function dispatchCenter(stage: HTMLElement) {
  const centerButton = stage.parentElement?.querySelector<HTMLButtonElement>(".tree-tool-button");
  centerButton?.click();
}

export function TreeCameraController({ className }: CameraControlProps) {
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(".life-tree-stage");
    if (!stage) return;

    const pointers = new Map<number, PointerEvent>();
    let lastPinchDistance: number | null = null;
    let lastPinchAt = 0;

    function getPinchDistance() {
      const activePointers = Array.from(pointers.values());
      if (activePointers.length < 2) return null;

      const [first, second] = activePointers;
      return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
    }

    function getPinchCenter() {
      const activePointers = Array.from(pointers.values());
      const [first, second] = activePointers;
      return {
        x: (first.clientX + second.clientX) / 2,
        y: (first.clientY + second.clientY) / 2
      };
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType !== "touch") return;
      pointers.set(event.pointerId, event);
      if (pointers.size >= 2) {
        lastPinchDistance = getPinchDistance();
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "touch" || !pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, event);
      if (pointers.size < 2) return;

      const nextDistance = getPinchDistance();
      if (!nextDistance || !lastPinchDistance) return;

      const now = window.performance.now();
      const distanceDelta = nextDistance - lastPinchDistance;

      if (Math.abs(distanceDelta) > 7 && now - lastPinchAt > 24) {
        const center = getPinchCenter();
        dispatchZoom(stage, distanceDelta > 0 ? -70 : 70, center.x, center.y);
        lastPinchAt = now;
      }

      lastPinchDistance = nextDistance;
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function handlePointerEnd(event: PointerEvent) {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) lastPinchDistance = null;
    }

    stage.addEventListener("pointerdown", handlePointerDown, { capture: true, passive: false });
    stage.addEventListener("pointermove", handlePointerMove, { capture: true, passive: false });
    stage.addEventListener("pointerup", handlePointerEnd, { capture: true });
    stage.addEventListener("pointercancel", handlePointerEnd, { capture: true });
    stage.addEventListener("pointerleave", handlePointerEnd, { capture: true });

    return () => {
      stage.removeEventListener("pointerdown", handlePointerDown, { capture: true });
      stage.removeEventListener("pointermove", handlePointerMove, { capture: true });
      stage.removeEventListener("pointerup", handlePointerEnd, { capture: true });
      stage.removeEventListener("pointercancel", handlePointerEnd, { capture: true });
      stage.removeEventListener("pointerleave", handlePointerEnd, { capture: true });
    };
  }, []);

  function controlZoom(deltaY: number) {
    const stage = document.querySelector<HTMLElement>(".life-tree-stage");
    if (stage) dispatchZoom(stage, deltaY);
  }

  function centerTree() {
    const stage = document.querySelector<HTMLElement>(".life-tree-stage");
    if (stage) dispatchCenter(stage);
  }

  return (
    <div className={className} aria-label="Tree camera controls">
      <button type="button" aria-label="Zoom in" onClick={() => controlZoom(-120)}>
        <Plus size={16} />
      </button>
      <button type="button" aria-label="Center tree" onClick={centerTree}>
        <LocateFixed size={16} />
      </button>
      <button type="button" aria-label="Zoom out" onClick={() => controlZoom(120)}>
        <Minus size={16} />
      </button>
    </div>
  );
}
