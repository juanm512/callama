"use client"
import "./globals.css"
import "@mantine/core/styles.css"

import { MantineProvider } from "@mantine/core"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={""}>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  )
}
