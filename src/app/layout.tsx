import InitialCheck from "@/components/InitialCheck"
import "./globals.css"

import { exec } from "child_process"
import os from "node:os"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log(os.platform())

  //   // Mac OS:
  // system_profiler | grep GeForce

  // // Windows:
  // wmic path win32_VideoController get name

  // // Linux:
  // sudo lshw -C display
  exec(
    "wmic path win32_VideoController get AdapterRam",
    (error, stdout, stderr) => {
      // exec("wmic path win32_VideoController get name", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      // Normalise the result here to get the GPU name
      console.log(`stdout: ${stdout}`)
    }
  )

  return (
    <html lang="en">
      <body className={""}>
        <InitialCheck />
        {/* {children} */}
      </body>
    </html>
  )
}
