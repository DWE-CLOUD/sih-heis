"use client";

export function A11yHeader() {
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 text-sm">
      <div className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-3 py-1.5">
        <button
          onClick={() => document.documentElement.classList.toggle("high-contrast")}
          className="px-2 hover:opacity-80"
          aria-label="Toggle high contrast"
        >
          HC
        </button>
        <button
          onClick={() => {
            const html = document.documentElement;
            const current = parseInt(getComputedStyle(html).fontSize);
            html.style.fontSize = Math.min(current + 1, 20) + "px";
          }}
          className="px-2 hover:opacity-80"
          aria-label="Increase text size"
        >
          A+
        </button>
        <button
          onClick={() => {
            const html = document.documentElement;
            const current = parseInt(getComputedStyle(html).fontSize);
            html.style.fontSize = Math.max(current - 1, 12) + "px";
          }}
          className="px-2 hover:opacity-80"
          aria-label="Decrease text size"
        >
          A-
        </button>
      </div>
    </div>
  );
}



