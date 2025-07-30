export default function isoTimeFormat(timeString) {
  if (!timeString) return "Invalid Time";
  const [hour, minute] = timeString.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return "Invalid Time";

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
