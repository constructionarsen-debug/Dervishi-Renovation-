export default function FeatureGateOverlay({ enabled, title = 'Së shpejti', message = 'Kjo veçori do të jetë e disponueshme shumë shpejt.', children }) {
  if (enabled) return children;

  return (
    <div className="relative">
      {/* keep existing UI intact, but visually disabled */}
      <div className="pointer-events-none select-none opacity-60 grayscale">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-[2rem] border border-black/10 bg-white/90 p-6 text-center shadow-xl backdrop-blur dark:border-white/10 dark:bg-gray-900/90">
          <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">{title}</div>
          <div className="mt-2 text-2xl font-extrabold">Kjo faqe do të jetë e aksesueshme së shpejti</div>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  );
}
