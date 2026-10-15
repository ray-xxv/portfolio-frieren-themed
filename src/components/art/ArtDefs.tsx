/**
 * Shared SVG gradients, rendered once. Every inline SVG on the page can reference these ids,
 * so dozens of flowers don't each carry their own <defs>.
 */
export function ArtDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
      <defs>
        {/* Blue-Moon Weed petal: pale centre fading out to royal edges */}
        <radialGradient id="bmw-day" cx="0" cy="0" r="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FBF8F0" />
          <stop offset="0.3" stopColor="#E4F0FB" />
          <stop offset="0.58" stopColor="#8EC3EE" />
          <stop offset="0.86" stopColor="#4E84E6" />
          <stop offset="1" stopColor="#2645D8" />
        </radialGradient>
        <radialGradient id="bmw-deep" cx="0" cy="0" r="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E4F0FB" />
          <stop offset="0.35" stopColor="#8EC3EE" />
          <stop offset="0.7" stopColor="#2F55E0" />
          <stop offset="1" stopColor="#12238A" />
        </radialGradient>
        <radialGradient id="bmw-night" cx="0" cy="0" r="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#CFE6F8" />
          <stop offset="0.75" stopColor="#8EC3EE" />
          <stop offset="1" stopColor="#5F9BE6" />
        </radialGradient>
        <linearGradient id="leaf-royal" x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0" stopColor="#12238A" />
          <stop offset="0.6" stopColor="#1F3BD6" />
          <stop offset="1" stopColor="#5F9BE6" />
        </linearGradient>
        <linearGradient id="leaf-sky" x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0" stopColor="#5F9BE6" />
          <stop offset="1" stopColor="#CFE6F8" />
        </linearGradient>
        <radialGradient id="ray" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
