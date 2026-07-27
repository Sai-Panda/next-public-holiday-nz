type PhotoCreditProps = {
  photographer: string;
  href: string;
};

// Subtle, unobtrusive attribution overlay for background photos (e.g. Pixabay images),
// positioned to sit over the hero's bottom gradient so it stays legible without
// competing with the countdown content above it.
export const PhotoCredit = ({ photographer, href }: PhotoCreditProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="absolute bottom-2 right-2 z-20 rounded-full bg-black/30 px-2 py-1 text-[0.6rem] font-normal text-white/60 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white/90 lg:bottom-3 lg:right-3 lg:px-2.5 lg:text-[0.65rem]"
  >
    Photo by {photographer} on Pixabay
  </a>
);
