import baseConfig from "@repo/ui/tailwind.config";

export default {
  ...baseConfig,
  content: [
    "../../packages/ui/src/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
};
