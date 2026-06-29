import { useEffect, useState } from "react";
import { fetchSafetyStatus } from "../api/safety";

export function SafetyBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSafetyStatus()
      .then((s) => setMessage(s.message))
      .catch(() => {
        setMessage(
          "Permission engine loading… File tools disabled until LB-OS-005+.",
        );
      });
  }, []);

  return (
    <div className="safety-banner" role="status">
      {message ??
        "Permission engine active (LB-OS-003). File tools still disabled until LB-OS-005+."}
    </div>
  );
}
