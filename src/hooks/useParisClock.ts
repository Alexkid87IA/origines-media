import { useEffect, useState } from "react";

export function useParisClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
