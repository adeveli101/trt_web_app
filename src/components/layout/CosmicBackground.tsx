export default function CosmicBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[url('/images/bg_stars.svg')] bg-repeat opacity-60" />
      <div className="absolute inset-0 bg-[url('/images/noise.png')] bg-repeat opacity-20" />
      {/* İsterseniz nebula overlay de ekleyebilirsiniz */}
      {/* <div className="absolute inset-0 bg-[url('/images/nebula_overlay.png')] bg-repeat opacity-30" /> */}
    </div>
  );
} 