"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Alert, Button, Descriptions, Flex, Space, Typography } from "antd";
import { ThemeToggle } from "@/components/ThemeToggle";

const { Title, Paragraph } = Typography;

const hasPrivy = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
        <Title level={2} style={{ margin: 0 }}>
          Smart Polymarket
        </Title>
        <ThemeToggle />
      </Flex>
      <Paragraph type="secondary">
        Polymarket 聪明钱数据层。当前是骨架版本，登录后会自动创建 Privy 嵌入式钱包。
      </Paragraph>

      {hasPrivy ? <LoginPanel /> : <PrivyMissingNotice />}
    </main>
  );
}

function PrivyMissingNotice() {
  return (
    <Alert
      type="warning"
      showIcon
      message="未配置 NEXT_PUBLIC_PRIVY_APP_ID"
      description={
        <span>
          把 <code>.env.example</code> 复制为 <code>.env.local</code>，填入 Privy Dashboard 的 App ID 后重启 dev server。
        </span>
      }
    />
  );
}

function LoginPanel() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return <Paragraph>加载 Privy…</Paragraph>;
  }

  if (!authenticated) {
    return (
      <Space>
        <Button type="primary" size="large" onClick={login}>
          登录 / 注册
        </Button>
      </Space>
    );
  }

  const wallet = user?.wallet?.address;
  const email = user?.email?.address;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Descriptions title="已登录" column={1} bordered size="small">
        <Descriptions.Item label="Privy ID">{user?.id}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{email ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="嵌入式钱包">
          {wallet ? <code>{wallet}</code> : "未创建"}
        </Descriptions.Item>
      </Descriptions>
      <Button onClick={logout}>退出</Button>
    </Space>
  );
}
