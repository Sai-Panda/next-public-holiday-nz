export type Holiday = {
  name: string;
  date: string;
  infoUrl?: string;
  theme?: HolidayTheme;
};

export type HolidayTheme = {
  backgroundClassName?: string;
  backgroundStyle?: React.CSSProperties;
  overlays?: React.ReactNode;
  emoji?: string;
  titleClassName?: string;
  titleDropShadow?: string;
  icon?: {
    src: string;
    alt: string;
  };
};

