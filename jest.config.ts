module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/",
    "/src/components/shadcn",
    "/src/generated/",
  ],
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 99,
      lines: 99,
      statements: 99,
    },
    "./src/db/prisma.ts": {
      branches: 75,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  //  setupFiles: ["react-app-polyfill/jsdom"],
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
    "/node_modules/(?!(@auth|next-auth|oauth4webapi|jose|@panva|preact-render-to-string|preact)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "\\.(scss|sass|css|woff2)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/file-mock.ts",
    "^next/font/google$": "<rootDir>/__mocks__/next/font/google.ts",
    "^next-auth/react$": "<rootDir>/__mocks__/next-auth/react.tsx",
    "^@radix-ui/react-portal$": "<rootDir>/__mocks__/@radix-ui/react-portal.tsx",
    "^@radix-ui/react-presence$": "<rootDir>/__mocks__/@radix-ui/react-presence.tsx",
    "^@radix-ui/react-dropdown-menu$":
      "<rootDir>/__mocks__/@radix-ui/react-dropdown-menu.tsx",
    "^@/auth$": "<rootDir>/__mocks__/@/auth.ts",
    "^@/components/shared/auth$": "<rootDir>/__mocks__/@/components/shared/auth.tsx",
    "@/(.*)$": ["<rootDir>/src/$1"],
    "^@tests(.*)$": "<rootDir>/tests/index$1",
  },
};
