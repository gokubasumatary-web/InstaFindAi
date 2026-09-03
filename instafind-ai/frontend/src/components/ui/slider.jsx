import React, { useRef } from "react";

export const Slider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className,
}) => {
  const progressRef = useRef(null);

  const handleDrag = (e) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const val = min + percentage * (max - min);
    const stepped = Math.round(val / step) * step;
    onChange(Math.min(Math.max(stepped, min), max));
  };

  const percent = Math.max(0, Math.min(1, (value - min) / (max - min))) * 100;

  return (
    <div
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(max, value + step));
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(min, value - step));
      }}
      className={`relative cursor-pointer select-none touch-manipulation focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      onMouseDown={(e) => {
        e.preventDefault();
        const move = (ev) => handleDrag(ev);
        const up = () => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
      }}
    >
      <div ref={progressRef} className="h-2 rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="relative mt-2 text-xs">{value}</div>
    </div>
  );
};
