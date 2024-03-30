"use client"
import Image from "next/image"
import { useState, useEffect } from "react"

import {
  allSysInfo,
  batteries,
  totalMemory,
  usedMemory,
  totalSwap,
  usedSwap,
  memoryInfo,
  hostname,
  name,
  kernelVersion,
  osVersion,
  staticInfo,
  components,
  cpus,
  cpuCount,
  cpuInfo,
  disks,
  networks,
  processes,
  refreshAll,
  refreshMemory,
  refreshCpu,
  refreshProcesses,
  debugCommand,
  AllSystemInfo,
  StaticInfo,
  MemoryInfo,
  CpuInfo,
  Batteries
} from "tauri-plugin-system-info-api"

export default function Home() {
  const [command, setCommand] = useState()

  // Import Command and save it inside the state for later usage
  async function setupCommand() {
    const Command = await (await import("@tauri-apps/api/shell")).Command
    setCommand(new Command("get-ollama-version"))
  }

  useEffect(() => {
    setupCommand()
  }, [])

  const getOllamaV = async () => {
    const output = await command.execute()
    console.log(output)
  }

  async function showSpecs() {
    console.log("------\n\n\n\n")

    console.log("----\n\n\n\n")
    // console.log(MemoryInfo.parse(await memoryInfo()))
    // console.log(StaticInfo.parse(await staticInfo()))
    // console.log(CpuInfo.parse(await cpuInfo()))
    // console.log(await disks())
    // console.log(await processes())
  }

  return (
    <main className="flex flex-row min-h-screen max-h-screen w-full bg-neutral-800">
      {/* <button onClick={getOllamaV}>know ollama version</button>
      <button onClick={showSpecs}>showSpects</button> */}
    </main>
  )
}
