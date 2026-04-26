"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PrivyWrapper>{children}</PrivyWrapper>
    </ThemeProvider>
  );
}

function PrivyWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();

  if (!PRIVY_APP_ID) return <>{children}</>;

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "twitter", "wallet"],
        embeddedWallets: { createOnLogin: "users-without-wallets" },
        appearance: { theme: mode },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
