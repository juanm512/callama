// @ts-nocheck
const OLLAMA_API_BASE_URL = "http://localhost:11434"
const TITLE_TEMPLATE =
  "ORDER FOR GENERATION = Create a concise, 3-5 word phrase as a header for the prompt the user write.\nStrictly adhering to the 3-7 word limit.\nAvoiding the use of the word 'title'.\nOnly respond with the title you generate, not include text about the generation of the title. \n\n PROMPT TO USE = {{prompt}}"

export const generateTitle = async (model, prompt) => {
  let error = null

  const template = TITLE_TEMPLATE.replace(/{{prompt}}/g, prompt)
  console.log(template)

  const res = await fetch(`${OLLAMA_API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      prompt: template,
      stream: false
    })
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json()
      return res.json()
    })
    .catch((err) => {
      console.log(err)
      if ("detail" in err) {
        error = err.detail
      }
      return null
    })

  if (error) {
    throw error
  }

  return res?.response ?? "New Chat"
}

export const generateChatCompletion = async (body, controllerSignal) => {
  let error = null

  let res = await fetch(`${OLLAMA_API_BASE_URL}/api/chat`, {
    signal: controllerSignal,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).catch((err) => {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request was aborted (likely by user action).")
      // Handle cancellation gracefully (e.g., display a message)
    } else {
      console.error("Other error occurred:", error)
      // Handle other errors
    }
    error = err
  })

  console.log("devolviendo: ", res, error)

  return { res, error }
}
