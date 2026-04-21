import type { ThemeConfig } from "antd";

const fontFamily =
  'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const fontFamilyCode =
  'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

// Polysights-inspired "data terminal" palette, light-first.
// Off-white canvas, hairline borders, restrained ink accents, green/red for up/down.
export const lightTheme: ThemeConfig = {
  cssVar: true,
  hashed: false,
  token: {
    colorPrimary: "#0b5fff",
    colorSuccess: "#15803d",
    colorError: "#dc2626",
    colorWarning: "#b45309",
    colorInfo: "#0b5fff",

    colorBgBase: "#f7f7f5",
    colorBgLayout: "#f2f2ef",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",

    colorText: "#0f172a",
    colorTextSecondary: "#475569",
    colorTextTertiary: "#64748b",
    colorTextQuaternary: "#94a3b8",

    colorBorder: "#e5e7eb",
    colorBorderSecondary: "#eef0f2",

    borderRadius: 4,
    borderRadiusLG: 6,
    borderRadiusSM: 2,

    fontFamily,
    fontFamilyCode,
    fontSize: 13,
    lineHeight: 1.5,

    wireframe: false,
    boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
    boxShadowSecondary: "0 1px 2px 0 rgba(15, 23, 42, 0.04)"
  },
  components: {
    Table: {
      headerBg: "#f2f2ef",
      headerColor: "#475569",
      headerSplitColor: "#eef0f2",
      rowHoverBg: "#f7f7f5",
      cellPaddingBlockSM: 6,
      cellPaddingInlineSM: 10,
      borderColor: "#eef0f2"
    },
    Card: {
      colorBorderSecondary: "#eef0f2"
    },
    Button: {
      controlHeight: 32,
      fontWeight: 500
    },
    Layout: {
      headerBg: "#ffffff",
      bodyBg: "#f2f2ef",
      siderBg: "#ffffff"
    },
    Typography: {
      titleMarginBottom: "0.4em",
      titleMarginTop: "1em"
    }
  }
};

// Dark variant uses the same token shape so the switcher can flip without layout shift.
export const darkTheme: ThemeConfig = {
  cssVar: true,
  hashed: false,
  token: {
    colorPrimary: "#3b82f6",
    colorSuccess: "#22c55e",
    colorError: "#ef4444",
    colorWarning: "#f59e0b",
    colorInfo: "#3b82f6",

    colorBgBase: "#0b0d10",
    colorBgLayout: "#0b0d10",
    colorBgContainer: "#111418",
    colorBgElevated: "#141821",

    colorText: "#e6edf3",
    colorTextSecondary: "#9aa4b2",

    colorBorder: "#1f242c",
    colorBorderSecondary: "#171b22",

    borderRadius: 4,
    borderRadiusLG: 6,
    borderRadiusSM: 2,

    fontFamily,
    fontFamilyCode,
    fontSize: 13,
    lineHeight: 1.5,

    wireframe: false
  },
  components: {
    Table: {
      headerBg: "#141821",
      rowHoverBg: "#141821",
      cellPaddingBlockSM: 6,
      cellPaddingInlineSM: 10
    }
  }
};

export type ThemeMode = "light" | "dark";
