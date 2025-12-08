"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { Suspense } from "react"

function ForcedThemeHandler() {
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()
  
  React.useEffect(() => {
    const forcedTheme = searchParams.get("theme")
    if (forcedTheme === "light" || forcedTheme === "dark" || forcedTheme === "system") {
      setTheme(forcedTheme)
    }
  }, [searchParams, setTheme])

  return null
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props} defaultTheme="light">
      {/* Este subcomponente aplica el theme forzado si existe en la URL */}
      <Suspense>
        <ForcedThemeHandler />
      </Suspense>
      {children}
    </NextThemesProvider>
  )
}
