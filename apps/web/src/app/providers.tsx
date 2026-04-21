"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { PrivyProvider } from "@privy-io/react-auth";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { darkTheme, lightTheme } from "@/theme/tokens";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ThemeProvider>
        <ThemedProviders>{children}</ThemedProviders>
      </ThemeProvider>
    </AntdRegistry>
  );
}

function ThemedProviders({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  const themeConfig = mode === "dark" ? darkTheme : lightTheme;

  const content = PRIVY_APP_ID ? (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["email", "google", "twitter", "wallet"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets"
        },
        appearance: {
          theme: mode,
          accentColor: mode === "dark" ? "#3b82f6" : "#0b5fff"
        }
      }}
    >
      {children}
    </PrivyProvider>
  ) : (
    children
  );

  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      {content}
    </ConfigProvider>
  );
}
