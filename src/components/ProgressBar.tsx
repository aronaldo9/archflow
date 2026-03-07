export default function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-zinc-800 rounded-full h-1.5 ${className}`}>
      <div
        className="bg-zinc-300 h-1.5 rounded-full transition-all"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}
