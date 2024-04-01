"use client"
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  CircleSlash,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import { use, useEffect, useState } from "react"
import { generateChatCompletion, generateTitle } from "@/lib/utils/ollama"

export default function InitialCheck() {
  return (
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  )
}

export function Dashboard() {
  const {
    chatsMessages,
    currentChatId,
    changeCurrentChatId,
    setChatTitle,
    addChat,
    addMsg,
    updateMsg
  } = useChatStore() as ChatStoreType

  const { prompt, changePrompt, changeLastPrompt } =
    usePromptStore() as PromptStoreType
  const {
    status,
    abortFlag,
    controller: contr,
    changeStatus,
    setController,
    changeAbortFlag
  } = useBasicStore() as BasicStoreType

  useEffect(() => {
    try {
      console.log(abortFlag, contr)
      if (abortFlag && contr != null) contr.abort("User aborted request!")
    } catch (error) {
      console.error(error, abortFlag, contr)
    }
  }, [abortFlag, contr])

  //////////////////////////
  // Ollama functions
  //////////////////////////
  const submitPrompt = async (userPrompt: string) => {
    changeAbortFlag(false)
    console.log("submitPrompt", currentChatId)
    changeLastPrompt(userPrompt)
    changePrompt("")
    changeStatus("REQUESTING")
    const messages = chatsMessages[currentChatId]?.messages || []
    const lastMsg: Message | undefined = messages.at(-1)

    // console.log(messages)
    if (
      messages.length != 0 &&
      status === 1 &&
      lastMsg != undefined &&
      lastMsg.done != true &&
      lastMsg.error == false
    ) {
      // Response not done
      console.log("wait, a message is pending or have an error")
    } else {
      // Create new chat if only one message in messages
      let chatId = messages.length == 0 ? getRandomUUID() : currentChatId
      const model = "gemma:2b"
      if (messages.length == 0) {
        const newChat = {
          id: chatId,
          title: "New Chat",
          model,
          // system: $settings.system ?? undefined,
          // options: {
          //   ...($settings.options ?? {})
          // },
          created_at: Date.now()
        }
        // console.log("new chat created: ", newChat)
        addChat(newChat)
        changeCurrentChatId(chatId)
      }

      // Create user message
      let userMessageId = getRandomUUID()
      let userMessage: Message = {
        id: userMessageId,
        chatId: chatId,
        role: "user",
        content: userPrompt,
        done: true,
        error: false,
        created_at: Math.floor(Date.now() / 1000) // Unix epoch
      }
      // Add message to chatId messages
      addMsg(chatId, userMessage)

      // Create response message
      let responseMessageId = getRandomUUID()
      let responseMessage: Message = {
        id: responseMessageId,
        chatId: chatId,
        role: "assistant",
        content: "",
        done: false,
        error: false,
        created_at: Math.floor(Date.now() / 1000) // Unix epoch
      }
      addMsg(chatId, responseMessage)

      await sendPromptOllama(prompt, responseMessageId, chatId, model)
    }
  }

  const sendPromptOllama = async (
    userPrompt: string,
    responseMessageId: string,
    _chatId: string,
    _model: string
  ) => {
    const messages = chatsMessages[_chatId]?.messages
    const responseMessageIndex = messages.findIndex(
      (m) => m.id == responseMessageId
    )
    let responseMessage = chatsMessages[_chatId]?.messages[responseMessageIndex]
    let controller = new AbortController()
    setController(controller)

    // Scroll down
    scrollToId()

    const messagesBody = [
      // $settings.system
      // 	? {
      // 			role: 'system',
      // 			content: $settings.system
      // 	  }
      // 	: undefined,
      ...messages
    ].slice(0, -1)

    const { res, error } = (await generateChatCompletion(
      {
        model: _model,
        messages: messagesBody
        // options: {
        //   ...($settings.options ?? {})
        // }
      },
      controller.signal
    )) as {
      res: Response | void
      controller: AbortController
      error: Error | null
    }

    // @ts-ignore
    if (res && res.ok && error == null) {
      // @ts-ignore
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
      while (true) {
        try {
          const { value, done } = await reader.read()
          console.log(abortFlag, controller)
          if (
            done ||
            abortFlag ||
            (currentChatId !== "" && _chatId !== currentChatId)
          ) {
            responseMessage.done = true
            // if (abortFlag) {
            //   // @ts-ignore
            //   controller.abort("User: Stop Response")
            //   console.log(
            //     "SendPromptOllama ->>> controller.abort('User: Stop Response');"
            //   )
            // }
            updateMsg(_chatId, responseMessage.id, responseMessage) //i think this is for save the chat into the current chat
            break
          }
          let data = JSON.parse(
            "[" + value.replaceAll("}\n{", "},{").replace("}\n", "}") + "]"
          )
          console.log(value, data)
          data.forEach((element: any) => {
            if (element.done == false) {
              // update messages data of the response
              responseMessage.content += element.message.content
              updateMsg(_chatId, responseMessage.id, responseMessage)
            } else {
              // responseMessage.done = true

              if (responseMessage.content == "") {
                responseMessage.error = true
                responseMessage.content =
                  "Oops! No text generated from Ollama, Please try again."
              }

              responseMessage.context = element.context ?? null
              responseMessage.info = {
                total_duration: element.total_duration,
                load_duration: element.load_duration,
                sample_count: element.sample_count,
                sample_duration: element.sample_duration,
                prompt_eval_count: element.prompt_eval_count,
                prompt_eval_duration: element.prompt_eval_duration,
                eval_count: element.eval_count,
                eval_duration: element.eval_duration
              }
              updateMsg(_chatId, responseMessage.id, responseMessage)

              // if ($settings.responseAutoCopy) {
              //   copyToClipboard(responseMessage.content)
              // }
            }
          })
        } catch (error) {
          console.log(error)
          // @ts-ignore
          responseMessage.context = error.message
          responseMessage.error = true
          responseMessage.done = true
          messages[
            responseMessageIndex
          ].content = `Uh-oh! There was an issue connecting to Ollama.`
          updateMsg(_chatId, responseMessage.id, responseMessage)
          break
        }
      }

      updateMsg(_chatId, responseMessage.id, responseMessage)
    } else {
      if (res !== null && error) {
        console.error(error.message)
        responseMessage.context = error.message
      } else {
        console.error(res)
        messages[
          responseMessageIndex
        ].content = `Uh-oh! There was an issue connecting to Ollama.`
      }

      responseMessage.error = true
      messages[
        responseMessageIndex
      ].content = `Uh-oh! There was an issue connecting to Ollama.`
      responseMessage.done = true
      updateMsg(_chatId, responseMessage.id, responseMessage)
    }

    setController(null)
    changeAbortFlag(false)
    changeStatus("IDLE")
    scrollToId()

    const firstMsg = messages.at(1) // this line and the check for firstMsg is only a TS thing
    if (
      messages.length == 2 &&
      firstMsg &&
      firstMsg.content !== "" &&
      !firstMsg.error
    ) {
      await generateChatTitle(_chatId, _model, userPrompt)
    }
  }

  // const regenerateResponse = async () => {
  //   console.log("regenerateResponse")
  //   if (
  //     messages.length != 0
  //     // && messages.at(-1).done == true
  //   ) {
  //     messages.splice(messages.length - 1, 1)

  //     const userMessage = messages.at(-1)
  //     const userPrompt = userMessage.content

  //     await sendPrompt(userPrompt)
  //   }
  // }

  const generateChatTitle = async (
    _chatId: string,
    model: string,
    userPrompt: string
  ) => {
    const title = await generateTitle(model, userPrompt)

    if (title) {
      setChatTitle(_chatId, title)
    } else {
      setChatTitle(_chatId, `${userPrompt}`)
    }
  }

  return (
    <div className="grid h-screen w-full pl-[56px]">
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Home"
          >
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>

        <nav className="grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-muted"
                aria-label="Playground"
              >
                <SquareTerminal className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={5}
            >
              Playground
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Models"
              >
                <Bot className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={5}
            >
              Models
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="API"
              >
                <Code2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={5}
            >
              API
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Documentation"
              >
                <Book className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={5}
            >
              Documentation
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Settings"
              >
                <Settings2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={5}
            >
              Settings
            </TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Help"
              >
                <LifeBuoy className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={5}
            >
              Help
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
              >
                <SquareUser className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              sideOffset={5}
            >
              Account
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Playground</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Configuration</DrawerTitle>
                <DrawerDescription>
                  Configure the settings for the model and messages.
                </DrawerDescription>
              </DrawerHeader>
              <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Model</Label>
                    <Select>
                      <SelectTrigger
                        id="model"
                        className="items-start [&_[data-description]]:hidden"
                      >
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genesis">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Rabbit className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Genesis
                                </span>
                              </p>
                              <p
                                className="text-xs"
                                data-description
                              >
                                Our fastest model for general use cases.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="explorer">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Bird className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Explorer
                                </span>
                              </p>
                              <p
                                className="text-xs"
                                data-description
                              >
                                Performance and speed for efficiency.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="quantum">
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <Turtle className="size-5" />
                            <div className="grid gap-0.5">
                              <p>
                                Neural{" "}
                                <span className="font-medium text-foreground">
                                  Quantum
                                </span>
                              </p>
                              <p
                                className="text-xs"
                                data-description
                              >
                                The most powerful model for complex
                                computations.
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="0.4"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input
                      id="top-p"
                      type="number"
                      placeholder="0.7"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input
                      id="top-k"
                      type="number"
                      placeholder="0.0"
                    />
                  </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Messages
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="You are a..."
                    />
                  </div>
                </fieldset>
              </form>
            </DrawerContent>
          </Drawer>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-1 lg:grid-cols-3">
          {/* <div className="relative hidden flex-col items-start gap-8 md:flex">
            <form className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Settings
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="model">Model</Label>
                  <Select>
                    <SelectTrigger
                      id="model"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genesis">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Rabbit className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Genesis
                              </span>
                            </p>
                            <p
                              className="text-xs"
                              data-description
                            >
                              Our fastest model for general use cases.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="explorer">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Bird className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Explorer
                              </span>
                            </p>
                            <p
                              className="text-xs"
                              data-description
                            >
                              Performance and speed for efficiency.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="quantum">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Turtle className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Quantum
                              </span>
                            </p>
                            <p
                              className="text-xs"
                              data-description
                            >
                              The most powerful model for complex computations.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="0.4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input
                      id="top-p"
                      type="number"
                      placeholder="0.7"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input
                      id="top-k"
                      type="number"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Messages
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="You are a..."
                    className="min-h-[9.5rem]"
                  />
                </div>
              </fieldset>
            </form>
          </div> */}
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2">
            <Badge
              variant="outline"
              className="fixed right-8 top-16"
            >
              abortFlag: {JSON.stringify(abortFlag)}
            </Badge>
            <div className="flex-1 flex flex-col gap-16 pb-64">
              <Messages />
            </div>
            <Prompt submitPrompt={submitPrompt} />
          </div>
        </main>
      </div>
    </div>
  )
}

import {
  // useMessageStore,
  // MessageStoreType,
  useBasicStore,
  BasicStoreType,
  Message,
  useChatStore,
  ChatStoreType
} from "@/lib/store/chat"
function Messages() {
  const { currentChatId, chatsMessages } = useChatStore() as ChatStoreType
  const messages = chatsMessages[currentChatId]?.messages

  if (!messages || messages?.length == 0) return <p>No hay mensajes aun</p>
  return messages.map((msg, index) => {
    if (messages.length - 1 == index)
      return (
        <p
          id="last-message"
          key={msg.id}
        >
          {msg.content}
        </p>
      )
    else return <p key={msg.id}>{msg.content}</p>
  })
}

function Prompt({ submitPrompt }) {
  return (
    <div className="fixed ml-9 bottom-2 left-1/2 -translate-x-[50%] min-w-[10rem] sm:min-w-[30rem] md:min-w-[40rem] lg:min-w-[60rem] max-w-screen-lg">
      <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
        <PromptArea submitPrompt={submitPrompt} />
        <div className="flex items-center p-3 pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled
                variant="ghost"
                size="icon"
              >
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled
                variant="ghost"
                size="icon"
              >
                <Mic className="size-4" />
                <span className="sr-only">Use Microphone</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Use Microphone</TooltipContent>
          </Tooltip>
          <SendPromptButton submitPrompt={submitPrompt} />
        </div>
      </div>
    </div>
  )
}

import {
  calculatePromptInputHeight,
  getRandomUUID,
  scrollToId
} from "@/lib/utils/common"
import { PromptStoreType, usePromptStore } from "@/lib/store/chat"

function PromptArea({ submitPrompt }) {
  const [minH, setMinH] = useState(100)

  const { prompt, lastPrompt, changePrompt } =
    usePromptStore() as PromptStoreType

  const { status, controller, setController } =
    useBasicStore() as BasicStoreType

  return (
    <>
      <Label
        htmlFor="message"
        className="sr-only"
      >
        Message
      </Label>
      <Textarea
        value={prompt}
        onChange={(e) => {
          // setPrompt(e.currentTarget.value)
          changePrompt(e.currentTarget.value)

          setMinH(calculatePromptInputHeight(e.currentTarget.scrollHeight, 100))
        }}
        onPaste={(e) => {
          const clipboardData = e.clipboardData || window.Clipboard
          console.log("clipboard", clipboardData, clipboardData.getData("text"))
        }}
        onKeyDown={async (e) => {
          const isCtrlPressed = e.ctrlKey || e.metaKey // metaKey is for Cmd key on Mac
          const isAltPressed = e.altKey
          const isShiftPressed = e.shiftKey

          // Check if Ctrl + Enter is pressed
          if (
            prompt !== "" &&
            status === 0 &&
            e.key.toLowerCase() === "enter" &&
            !isShiftPressed &&
            !isAltPressed &&
            isCtrlPressed
          ) {
            submitPrompt(prompt)
            console.log("send prompt")
          }

          // Check if Ctrl + R is pressed
          if (
            prompt === "" &&
            status === 0 &&
            isCtrlPressed &&
            e.key.toLowerCase() === "r"
          ) {
            e.preventDefault()

            console.log("regenerate")
          }

          if (
            prompt === "" &&
            status === 1 &&
            isCtrlPressed &&
            isShiftPressed &&
            (e.key.toLowerCase() === "backspace" ||
              e.key.toLowerCase() === "delete")
          ) {
            e.preventDefault()
            controller.abort()
            setController(null)
            console.log("cancel the request")
          }

          if (
            prompt === "" &&
            lastPrompt !== "" &&
            e.key.toLowerCase() == "arrowup"
          ) {
            e.preventDefault()

            changePrompt(lastPrompt)

            console.log("get last user prompt")
          }

          // if (['/', '#', '@'].includes(prompt.charAt(0)) && e.key === 'ArrowUp') {
          // 	e.preventDefault();

          // 	(promptsElement || documentsElement || modelsElement).selectUp();

          // 	const commandOptionButton = [
          // 		...document.getElementsByClassName('selected-command-option-button')
          // 	]?.at(-1);
          // 	commandOptionButton.scrollIntoView({ block: 'center' });
          // }

          // if (['/', '#', '@'].includes(prompt.charAt(0)) && e.key === 'ArrowDown') {
          // 	e.preventDefault();

          // 	(promptsElement || documentsElement || modelsElement).selectDown();

          // 	const commandOptionButton = [
          // 		...document.getElementsByClassName('selected-command-option-button')
          // 	]?.at(-1);
          // 	commandOptionButton.scrollIntoView({ block: 'center' });
          // }

          // if (['/', '#', '@'].includes(prompt.charAt(0)) && e.key === 'Enter') {
          // 	e.preventDefault();

          // 	const commandOptionButton = [
          // 		...document.getElementsByClassName('selected-command-option-button')
          // 	]?.at(-1);

          // 	commandOptionButton?.click();
          // }

          // if (['/', '#', '@'].includes(prompt.charAt(0)) && e.key === 'Tab') {
          // 	e.preventDefault();

          // 	const commandOptionButton = [
          // 		...document.getElementsByClassName('selected-command-option-button')
          // 	]?.at(-1);

          // 	commandOptionButton?.click();
          // } else if (e.key === 'Tab') {

          // }
        }}
        style={{
          minHeight: prompt !== "" ? minH + "px" : "100px"
        }}
        id="message"
        placeholder="Type your message here..."
        className="resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      />
    </>
  )
}

function SendPromptButton({ submitPrompt }) {
  const { status, changeAbortFlag } = useBasicStore() as BasicStoreType

  const { prompt } = usePromptStore() as PromptStoreType

  const { currentChatId, chatsMessages } = useChatStore() as ChatStoreType
  const lastMsg = chatsMessages[currentChatId]?.messages.at(-1)

  const stopResponse = () => {
    changeAbortFlag(true)
  }

  if (
    (status === 0 && chatsMessages[currentChatId]?.messages.length == 0) ||
    !lastMsg ||
    (lastMsg && lastMsg.done == true)
  )
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            className="ml-auto gap-1.5"
            disabled={prompt === ""}
            onClick={() => submitPrompt(prompt)}
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm text-muted-foreground">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 ml-1 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>Enter
            </kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    )
  // else if (abortFlag === null)
  //   return (
  //     <Button
  //       size="sm"
  //       variant="ghost"
  //       className="ml-auto gap-1.5"
  //     >
  //       Loading cancel
  //       <CircleSlash className="size-3.5" />
  //     </Button>
  //   )
  else
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="ml-auto gap-1.5"
            onClick={() => stopResponse()}
          >
            Stop response
            <CircleSlash className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm text-muted-foreground">
            Press
            <kbd className="pointer-events-none inline-flex h-5 ml-1 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span> + Shift + Del
            </kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    )
}
