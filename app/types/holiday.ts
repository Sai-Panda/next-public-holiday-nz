export type Holiday = {
  name: string;
  dates: string[];
  infoUrl?: string;
  theme?: HolidayTheme;
  emoji?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type HolidayTheme = {
  backgroundClassName?: string;
  backgroundStyle?: React.CSSProperties;
  overlays?: React.ReactNode;
  titleClassName?: string;
  titleDropShadow?: string;
  // Signature color (hex) for lightweight per-holiday accents, e.g. the
  // upcoming-holidays list row. Every tint/shade is derived from this one
  // value via CSS color-mix so a new holiday only needs to set this.
  accentColor?: string;
  icon?: {
    src: string;
    alt: string;
  };
};

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};
