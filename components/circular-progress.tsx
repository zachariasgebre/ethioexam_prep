type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export function CircularProgress({ percentage, size = 56, strokeWidth = 5, label = "completed" }: CircularProgressProps) {
  const value = Number.isFinite(percentage) ? Math.min(100, Math.max(0, Math.round(percentage))) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);
  const progressColor = value >= 80 ? "text-emerald-600" : value >= 50 ? "text-cyan-600" : value > 0 ? "text-amber-500" : "text-slate-400";

  return (
    <span className="group/progress relative inline-flex shrink-0 rounded-full transition-transform duration-300 hover:scale-110 focus-within:scale-110">
      <svg
        className={`cursor-help overflow-visible transition-colors duration-300 group-hover/progress:text-fuchsia-600 group-focus-within/progress:text-fuchsia-600 ${progressColor}`}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${value}% ${label}`}
        tabIndex={0}
        title={`${value}% ${label}`}
      >
        <circle className="stroke-slate-200 transition-colors group-hover/progress:stroke-fuchsia-200 group-focus-within/progress:stroke-fuchsia-200" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} />
        <circle
          className="stroke-current transition-[stroke-dashoffset] duration-700 ease-out"
          cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="fill-slate-900 text-[11px] font-semibold">{value}%</text>
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-max max-w-48 translate-y-1 rounded-lg bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition duration-200 group-hover/progress:translate-y-0 group-hover/progress:opacity-100 group-focus-within/progress:translate-y-0 group-focus-within/progress:opacity-100">
        {value}% {label}
      </span>
    </span>
  );
}
