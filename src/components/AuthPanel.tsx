import React from "react";
import SafeAuthPanel from "components/System/SafeAuthPanel";

type AuthPanelLike = React.ComponentType<any>;

/**
 * Looks for a real AuthPanel injected at runtime, otherwise uses SafeAuthPanel.
 * No dynamic imports or fragile paths, so Vite build cannot break.
 */
function useInjectedAuthPanel(): AuthPanelLike | null {
  const [C, setC] = React.useState<AuthPanelLike | null>(null);
  React.useEffect(() => {
    const w = window as any;
    // If a real panel is attached (e.g., in a feature branch), prefer it.
    if (w && typeof w.AFW_AUTH_PANEL === "function") {
      setC(() => w.AFW_AUTH_PANEL as AuthPanelLike);
    }
  }, []);
  return C;
}

export default function AuthPanel(props: any) {
  const Injected = useInjectedAuthPanel();
  const Panel = Injected ?? SafeAuthPanel;
  return <Panel {...props} />;
}
