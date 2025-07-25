const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
  size = "232px",
  color = "rgba(41,120,181,0.3)",
}) => {
  return (
    <div
      className="absolute -z-50 rounded-full blur-3xl"
      style={{
        top,
        left,
        right,
        bottom,
        height: size,
        width: size,
        backgroundColor: color,
      }}
    />
  );
};

export default BlurCircle;
