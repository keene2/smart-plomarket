"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { PrivyProvider } from "@privy-io/react-auth";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    return (
      <AntdRegistry>
        <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
          {children}
        </ConfigProvider>
      </AntdRegistry>
    );
  }

  return (
    <AntdRegistry>
      <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
        <PrivyProvider
          appId={PRIVY_APP_ID}
          config={{
            loginMethods: ["email", "google", "twitter", "wallet"],
            embeddedWallets: {
              createOnLogin: "users-without-wallets"
            },
            appearance: {
              theme: "dark",
              accentColor: "#00B96B"
            }
          }}
        >
          {children}
        </PrivyProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
