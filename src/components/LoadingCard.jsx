export default function LoadingCard({
  isLoading,
  children,
  height = "auto",
  width = "100%",
  marginLeft = "0",
  className = "",
  waveLines = 2,
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div
      className={`
          relative flex items-center justify-center overflow-hidden
          bg-white
          border border-neutral-200
          rounded-xl shadow-sm ${className}
        `}
      style={{ height, width, marginLeft }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
              absolute inset-0 w-[200%]
              bg-linear-to-r from-transparent via-neutral-300/40 to-transparent
            "
          style={{ animation: "waveMove 3s ease-in-out infinite" }}
        />

        {waveLines >= 2 && (
          <div
            className="
                absolute inset-0 w-[200%]
                bg-linear-to-r from-transparent via-blue-300/30 to-transparent
              "
            style={{
              animation: "waveMove 3s ease-in-out infinite",
              animationDelay: "0.8s",
            }}
          />
        )}

        {waveLines >= 3 && (
          <div
            className="
                absolute inset-0 w-[200%]
                bg-linear-to-r from-transparent via-green-300/30 to-transparent
              "
            style={{
              animation: "waveMove 3s ease-in-out infinite",
              animationDelay: "1.6s",
            }}
          />
        )}
      </div>
    </div>
  );
}