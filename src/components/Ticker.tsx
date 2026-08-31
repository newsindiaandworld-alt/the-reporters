export default function Ticker() {
  return (
    <div className="bg-brand-red text-white font-semibold text-sm px-4 py-2 flex items-center gap-2 tracking-wide">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      <span>BREAKING: Live Updates on National Elections</span>
    </div>
  );
}
