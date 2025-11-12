"use client";

export default function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-(--space-1)">
      {items.map((item, index) => (
        <details
          key={index}
          className="group relative bg-[#111] rounded-xl overflow-hidden transition-all duration-300 ease-(--ease-golden) hover:bg-[#151515] open:bg-[#151515] cursor-pointer"
          onClick={(e) => {
            const dlg = e.currentTarget as HTMLDetailsElement;
            const summary = dlg.querySelector("summary");
            if (dlg.open && summary && !summary.contains(e.target as Node)) {
              dlg.open = false;
            }
          }}
        >
          <summary className="relative z-10 flex items-center gap-2 font-medium text-gray-200 select-none list-none text-left px-5 py-3 after:absolute after:inset-0 after:content-['']">
            <span className="transition-transform duration-300 group-open:rotate-90">▶</span>
            {item.q}
          </summary>
          <p className="text-gray-400 mt-1 text-left px-8 pb-4">{item.a}</p>
        </details>
      ))}
    </div>
  );
}