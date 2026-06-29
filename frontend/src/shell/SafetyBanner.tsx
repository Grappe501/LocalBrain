export function SafetyBanner() {
  return (
    <div className="safety-banner" role="status">
      Filesystem tools not enabled until LB-OS-003+. No file scanning or writes in
      this slice.
    </div>
  );
}
