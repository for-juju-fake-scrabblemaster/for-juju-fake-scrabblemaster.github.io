import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? ""
  const isGhActions = process.env.GITHUB_ACTIONS === "true"
  const isUserOrOrgPages = repoName.endsWith(".github.io")

  return {
    // Build the correct asset base for GitHub Pages project vs user/org pages.
    base: isGhActions ? (isUserOrOrgPages ? "/" : `/${repoName}/`) : "/",
    plugins: [command === "serve" ? inspectAttr() : null, react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
