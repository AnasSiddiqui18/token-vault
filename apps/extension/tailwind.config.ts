import baseConfig from "@repo/ui/tailwind.config";
import { heroui } from "@heroui/react";

export default {
    ...baseConfig,
    content: [
        "../../packages/ui/src/**/*.{ts,tsx,js,jsx,mdx}",
        "./src/**/*.{ts,tsx,js,jsx,mdx}",
        "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [heroui()],
};
