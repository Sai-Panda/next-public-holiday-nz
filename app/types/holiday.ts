export type Holiday = {
  name: string;
  dates: string[];
  // Required so every holiday has a "Learn more about" link (see issue #11).
  infoUrl: string;
  // The app counts down to observed dates. When an observation is moved from
  // the holiday's calendar date, retain that actual date for clear display.
  actualDateByObservedDate?: Record<string, string>;
  theme?: HolidayTheme;
  emoji?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type HolidayTheme = {
  // Signature color (hex) for lightweight per-holiday accents, e.g. the
  // upcoming-holidays list row. Every tint/shade is derived from this one
  // value via CSS color-mix so a new holiday only needs to set this.
  accentColor?: string;
};

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};
