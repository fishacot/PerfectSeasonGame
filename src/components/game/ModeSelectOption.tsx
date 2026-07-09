"use client";

interface ModeSelectOptionProps {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "daily";
}

const VARIANTS = {
  primary: {
    card: "bg-sport text-bg hover:glow-sport",
    title: "text-bg",
    desc: "text-bg/80",
    mobile: "border-sport/40 bg-sport/10",
    mobileTitle: "text-sport",
  },
  secondary: {
    card: "border border-border bg-surface hover:border-sport/50",
    title: "text-text group-hover:text-sport",
    desc: "text-muted",
    mobile: "border-white/10 bg-surface/80",
    mobileTitle: "text-text",
  },
  daily: {
    card: "border border-sport/30 bg-sport/5 hover:border-sport hover:bg-sport/10",
    title: "text-sport",
    desc: "text-sport/70",
    mobile: "border-sport/25 bg-sport/5",
    mobileTitle: "text-sport",
  },
} as const;

/** Mode picker — compact row on phone, broadcast card on tablet+. */
export function ModeSelectOption({
  title,
  description,
  onClick,
  disabled = false,
  variant = "secondary",
}: ModeSelectOptionProps) {
  const v = VARIANTS[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group w-full text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        disabled ? "" : "cursor-pointer"
      }`}
    >
      {/* Mobile */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 sm:hidden ${v.mobile}`}
      >
        <div className="min-w-0 flex-1">
          <span className={`font-display text-xl tracking-wide ${v.mobileTitle}`}>
            {title}
          </span>
          <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        </div>
        <span className="mt-1 text-muted">→</span>
      </div>

      {/* Tablet+ */}
      <div
        className={`relative hidden flex-col items-center justify-center overflow-hidden rounded-xl p-6 transition-colors sm:flex lg:p-8 ${v.card}`}
      >
        {variant === "primary" && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        )}
        <span className={`relative z-10 font-display text-2xl tracking-widest lg:text-3xl ${v.title}`}>
          {title}
        </span>
        <span
          className={`relative z-10 mt-2 max-w-sm text-center text-xs font-medium normal-case leading-relaxed tracking-normal lg:text-sm ${v.desc}`}
        >
          {description}
        </span>
      </div>
    </button>
  );
}
