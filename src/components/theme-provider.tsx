"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// biome-ignore lint/style/useImportType: <explanation>
import { type ThemeProviderProps } from "next-themes/dist/types"
 
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}