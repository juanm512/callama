export const calculatePromptInputHeight = (
  scrollHeight,
  min = 200,
  max = 600
) => {
  return Math.min(max, Math.max(scrollHeight, min))
}

import cryptoServer from "crypto"
export function getRandomUUID() {
  if (typeof window === "undefined") {
    return cryptoServer.randomBytes(16).toString("hex")
  }
  return crypto.randomUUID()
}

export const scrollToId = (id = "last-message") => {
  const element = document.getElementById(id)
  if (element) element.scrollIntoView()
}

export const copyToClipboard = (text) => {
  if (!navigator.clipboard) {
    const textArea = document.createElement("textarea")
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      const msg = successful ? "successful" : "unsuccessful"
      console.log("Fallback: Copying text command was " + msg)
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err)
    }

    document.body.removeChild(textArea)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!")
    },
    function (err) {
      console.error("Async: Could not copy text: ", err)
    }
  )
}
