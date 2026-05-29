module.exports = {
   roots: ["<rootDir>/src"],
   coverageReporters: ["lcov", "json-summary"],
   collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
   coveragePathIgnorePatterns: [
      "/node_modules/",
      "/tests/",
      "/src/components/shadcn",
      "/src/generated/",
   ],
   coverageThreshold: {
      global: {
         lines: 99.8,
         statements: 99.8,
         branches: 99.4,
         functions: 99.4,
      },
   },
   setupFilesAfterEnv: [
      "<rootDir>/tests/jest.setup.ts",
      "<rootDir>/tests/jest.setup.env.ts",
   ],
   testMatch: [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
   ],
   testPathIgnorePatterns: ["node_modules", ".next", "<rootDir>.*/public"],
   testEnvironment: "jsdom",
   transform: {
      "^.+\\.[jt]sx?$": "<rootDir>/config/jest/jest-preprocess.mjs",
      "^.+\\.(png|jpg|jpeg|svg)$": "jest-transform-stub",
   },
   transformIgnorePatterns: [
      "/node_modules/(?!(@auth|next-auth|oauth4webapi|jose|@panva|preact-render-to-string|preact|uuid|nuqs|unist-util-visit|unist-util-visit-parents|unist-util-is|@azure|@typespec)/)",
      "^.+\\.module\\.(css|sass|scss)$",
   ],
   moduleNameMapper: {
      "\\.(scss|sass|css|woff2)$": "identity-obj-proxy",
      "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/file-mock.ts",
      "^next/link$": "<rootDir>/__mocks__/next/link.tsx",
      "^next/navigation$": "<rootDir>/__mocks__/next/navigation.tsx",
      "^next/font/google$": "<rootDir>/__mocks__/next/font/google.ts",
      "^next-auth/react$": "<rootDir>/__mocks__/next-auth/react.tsx",
      "^react-markdown$": "<rootDir>/__mocks__/react-markdown.tsx",
      "^remark$": "<rootDir>/__mocks__/remark.ts",
      "^strip-markdown$": "<rootDir>/__mocks__/strip-markdown.ts",
      "^rehype-raw$": "<rootDir>/__mocks__/rehype-raw.ts",
      "^remark-gfm$": "<rootDir>/__mocks__/remark-gfm.ts",
      "^@/auth$": "<rootDir>/__mocks__/@/auth.ts",
      "^@radix-ui/react-alert-dialog$":
         "<rootDir>/__mocks__/@radix-ui/react-alert-dialog.tsx",
      "^@radix-ui/react-dialog$":
         "<rootDir>/__mocks__/@radix-ui/react-dialog.tsx",
      "^@radix-ui/react-dropdown-menu$":
         "<rootDir>/__mocks__/@radix-ui/react-dropdown-menu.tsx",
      "^@radix-ui/react-popover$":
         "<rootDir>/__mocks__/@radix-ui/react-popover.tsx",
      "^@radix-ui/react-portal$":
         "<rootDir>/__mocks__/@radix-ui/react-portal.tsx",
      "^@radix-ui/react-presence$":
         "<rootDir>/__mocks__/@radix-ui/react-presence.tsx",
      "^@radix-ui/react-sheet$":
         "<rootDir>/__mocks__/@radix-ui/react-sheet.tsx",
      "^@radix-ui/react-tabs$": "<rootDir>/__mocks__/@radix-ui/react-tabs.tsx",
      "^@radix-ui/react-tooltip$":
         "<rootDir>/__mocks__/@radix-ui/react-tooltip.tsx",
      "^@tiptap/react$": "<rootDir>/__mocks__/@tiptap/react.tsx",
      "@/(.*)$": ["<rootDir>/src/$1"],
      "^@tests(.*)$": "<rootDir>/tests/index$1",
   },
};
