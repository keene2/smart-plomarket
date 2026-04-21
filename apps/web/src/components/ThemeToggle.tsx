"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useTheme } from "@/theme/ThemeContext";
import type { ThemeMode } from "@/theme/tokens";

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <Segmented
      size="small"
      value={mode}
      onChange={(value) => setMode(value as ThemeMode)}
      options={[
        { value: "light", icon: <SunOutlined />, label: "Light" },
        { value: "dark", icon: <MoonOutlined />, label: "Dark" }
      ]}
    />
  );
}
