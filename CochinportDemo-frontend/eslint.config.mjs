import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js recommended rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ OPTION 3: Relax rules (WARN instead of ERROR)
  {
    rules: {
      // Allow `any` but only warn
      "@typescript-eslint/no-explicit-any": "warn",

      // React hooks dependency warnings only
      "react-hooks/exhaustive-deps": "warn",

      // Optional: unused vars as warnings
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
