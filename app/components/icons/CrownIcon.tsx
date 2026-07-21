import * as React from "react";

// Hand-drawn to match the Heroicons 24x24 solid style (single currentColor
// fill, no internal detail beyond the silhouette) since Heroicons has no
// crown icon in any variant.
export function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      data-slot="icon"
      {...props}
    >
      <path d="M4 17 5 9 8.5 14 12 6 15.5 14 19 9 20 17 Z" />
      <rect x="4" y="17" width="16" height="3.5" rx="1" />
      <circle cx="5" cy="9" r="1.3" />
      <circle cx="12" cy="6" r="1.3" />
      <circle cx="19" cy="9" r="1.3" />
    </svg>
  );
}
