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
import { useEffect, useRef, useState } from "react"

export default function InitialCheck() {
  return (
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  )
}

export function Dashboard() {
  // 	//////////////////////////
  // // Ollama functions
  // //////////////////////////

  // const submitPrompt = async (userPrompt) => {
  // 	console.log('submitPrompt', chatId);
  // 	processing = "requesting"

  // 	if (messages.length != 0 && (messages.at(-1).done != true && messages.at(-1).error == false ) ) {
  // 		// Response not done
  // 		console.log('wait');
  // 	} else {
  // 		// Reset chat message textarea height
  // 		document.getElementById('chat-textarea').style.height = '';

  // 		// Create user message
  // 		let userMessageId = uuidv4();
  // 		let userMessage = {
  // 			id: userMessageId,
  // 			role: 'user',
  // 			content: userPrompt,
  // 			timestamp: Math.floor(Date.now() / 1000) // Unix epoch
  // 		};

  // 		// Add message to chatId messages
  // 		messages.push(userMessage);

  // 		// Wait until messages have been updated
  // 		await tick();

  // 		// Create new chat if only one message in messages
  // 		if (messages.length == 1) {
  // 			const newChatId = uuidv4()
  // 			chat = {
  // 				id: newChatId,
  // 				title: 'New Chat',
  // 				model: "gemma:7b",
  // 				system: $settings.system ?? undefined,
  // 				options: {
  // 					...($settings.options ?? {})
  // 				},
  // 				messages: messages,
  // 				timestamp: Date.now()
  // 			};
  // 			chatId = newChatId;
  // 			await tick();
  // 		}

  // 		// Reset chat input textarea
  // 		prompt = '';

  // 		// Send prompt
  // 		await sendPrompt(userPrompt, chatId);
  // 	}
  // };

  // const sendPrompt = async (prompt, _chatId) => {
  // 	// Create response message
  // 	let responseMessageId = uuidv4();
  // 	let responseMessage = {
  // 		id: responseMessageId,
  // 		role: 'assistant',
  // 		content: '',
  // 		error: false,
  // 		timestamp: Math.floor(Date.now() / 1000) // Unix epoch
  // 	};
  // 	messages.push(responseMessage);

  // 	await sendPromptOllama(prompt, responseMessageId, _chatId);
  // };

  // const sendPromptOllama = async (userPrompt, responseMessageId, _chatId) => {
  // 	const responseMessageIndex = messages.findIndex(m => m.id == responseMessageId)
  // 	// Wait until history/message have been updated
  // 	await tick();
  // 	// Scroll down
  // 	scrollToBottom();

  // 	const messagesBody = [
  // 		// $settings.system
  // 		// 	? {
  // 		// 			role: 'system',
  // 		// 			content: $settings.system
  // 		// 	  }
  // 		// 	: undefined,
  // 		...messages
  // 	].slice(0, -1)
  // 	await tick()
  // 	console.log(chat, messages, messagesBody)
  // 	const [res, controller, error] = await generateChatCompletion({
  // 		model: chat.model,
  // 		messages: messagesBody,
  // 		options: {
  // 			...($settings.options ?? {})
  // 		},
  // 	});
  // 	processing = ""

  // 	if (res && res.ok && error == null) {
  // 		console.log('controller', controller);

  // 		const reader = res.body
  // 			.pipeThrough(new TextDecoderStream())
  // 			.getReader();

  // 		while (true) {
  // 			const { value, done } = await reader.read();
  // 			if (done || stopResponseFlag || _chatId !== chatId) {
  // 				messages[responseMessageIndex].done = true;
  // 				// messages = messages; i think this is for save the chat into the current chat
  // 				if (stopResponseFlag) {
  // 					controller.abort('User: Stop Response');
  // 					console.log("SendPromptOllama ->>> controller.abort('User: Stop Response');")
  // 				}
  // 				break;
  // 			}
  // 			try {
  // 				let data = JSON.parse(value);
  // 				console.log(data)
  // 				if (data.done == false) {
  // 					// update messages data of the response
  // 					messages[responseMessageIndex].content+= data.message.content;
  // 				} else {
  // 					messages[responseMessageIndex].done = true;

  // 					if (messages[responseMessageIndex].content == '') {
  // 						messages[responseMessageIndex].error = true;
  // 						messages[responseMessageIndex].content =
  // 							'Oops! No text generated from Ollama, Please try again.';
  // 					}

  // 					messages[responseMessageIndex].context = data.context ?? null;
  // 					messages[responseMessageIndex].info = {
  // 						total_duration: data.total_duration,
  // 						load_duration: data.load_duration,
  // 						sample_count: data.sample_count,
  // 						sample_duration: data.sample_duration,
  // 						prompt_eval_count: data.prompt_eval_count,
  // 						prompt_eval_duration: data.prompt_eval_duration,
  // 						eval_count: data.eval_count,
  // 						eval_duration: data.eval_duration
  // 					};

  // 					if ($settings.responseAutoCopy) {
  // 						copyToClipboard(messages[responseMessageIndex].content);
  // 					}

  // 				}
  // 			} catch (error) {
  // 				console.log(error);
  // 				messages[responseMessageIndex].context = error.message;
  // 				messages[responseMessageIndex].error = true;
  // 				messages[responseMessageIndex].content = `Uh-oh! There was an issue connecting to Ollama.`;
  // 				break;
  // 			}

  // 			if (autoScroll) {
  // 				scrollToBottom();
  // 			}
  // 		}

  // 		// guardar messages en el chat correspondiente
  // 		if (chatId == _chatId) {
  // 			chat.messages = [...messages]
  // 			await tick()
  // 			saveChatChanges()
  // 		}
  // 	} else {
  // 		if (res !== null) {
  // 			console.error(error.message);
  // 			messages[responseMessageIndex].context = error.message;
  // 		} else {
  // 			console.error(res);
  // 			messages[responseMessageIndex].content = `Uh-oh! There was an issue connecting to Ollama.`;
  // 		}

  // 		messages[responseMessageIndex].error = true;
  // 		messages[responseMessageIndex].content = `Uh-oh! There was an issue connecting to Ollama.`;
  // 		messages[responseMessageIndex].done = true;
  // 	}

  // 	stopResponseFlag = false;
  // 	await tick();

  // 	if (autoScroll) {
  // 		scrollToBottom();
  // 	}

  // 	if (messages.length == 2 && messages.at(1).content !== '' && !messages.at(1).error ) {
  // 		await generateChatTitle(_chatId, userPrompt);
  // 	}
  // };

  // const stopResponse = () => {
  // 	stopResponseFlag = true;
  // 	console.log('stopResponse');
  // };

  // const regenerateResponse = async () => {
  // 	console.log('regenerateResponse');
  // 	if (messages.length != 0
  // 	// && messages.at(-1).done == true
  // 	) {
  // 		messages.splice(messages.length - 1, 1);

  // 		const userMessage = messages.at(-1);
  // 		const userPrompt = userMessage.content;

  // 		await sendPrompt(userPrompt);
  // 	}
  // };

  // /////////////////////////////////////////
  // // Chat: update, create, save. Functions
  // /////////////////////////////////////////

  // const generateChatTitle = async (_chatId, userPrompt) => {
  // 	if ($settings.titleAutoGenerate ?? true) {
  // 		const title = await generateTitle(
  // 			chat.model,
  // 			userPrompt
  // 		);

  // 		if (title) {
  // 			await setChatTitle(_chatId, title);
  // 		}
  // 		console.log("TITLE GENERATED: ",title)
  // 	} else {
  // 		await setChatTitle(_chatId, `${userPrompt}`);
  // 	}
  // };
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
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <Badge
              variant="outline"
              className="absolute right-3 top-3"
            >
              Output
            </Badge>
            <div className="flex-1 flex flex-col gap-16">
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
              <p>fsdafsd</p>
            </div>
            <Prompt />
          </div>
        </main>
      </div>
    </div>
  )
}

function Prompt() {
  return (
    <div className="fixed ml-9 bottom-0 left-1/2 -translate-x-[50%] min-w-[10rem] sm:min-w-[30rem] md:min-w-[40rem] lg:min-w-[60rem] max-w-screen-lg">
      <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
        <PromptArea />
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
          <SendPromptButton />
        </div>
      </form>
      <div className="mt-1.5 py-0.5 text-xs text-neutral-800 text-center bg-black/10 backdrop-blur-sm rounded-t-md">
        LLMs can make mistakes. Verify important information.
      </div>
    </div>
  )
}

import { calculatePromptInputHeight } from "@/lib/utils/common"

function PromptArea() {
  const textareaRef = useRef(null)
  const [prompt, setPrompt] = useState("")
  const [minH, setMinH] = useState(100)

  return (
    <>
      <Label
        htmlFor="message"
        className="sr-only"
      >
        Message
      </Label>
      <Textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.currentTarget.value)
          console.log(e.currentTarget.scrollHeight)
          setMinH(calculatePromptInputHeight(e.currentTarget.scrollHeight, 100))
        }}
        onPaste={(e) => {
          const clipboardData = e.clipboardData || window.Clipboard
          console.log("clipboard", clipboardData, clipboardData.getData("text"))
        }}
        onKeyDown={async (e) => {
          const isCtrlPressed = e.ctrlKey || e.metaKey // metaKey is for Cmd key on Mac
          const isAltPressed = e.altKey
          // Check if Ctrl + Enter is pressed
          if (
            prompt !== "" &&
            e.key.toLowerCase() === "enter" &&
            !e.shiftKey &&
            !isAltPressed &&
            isCtrlPressed
          ) {
            // submitPrompt(prompt)
            console.log("send prompt")
          }

          // Check if Ctrl + R is pressed
          if (prompt === "" && isCtrlPressed && e.key.toLowerCase() === "r") {
            e.preventDefault()
            console.log("regenerate")
          }

          if (prompt === "" && e.key == "ArrowUp") {
            e.preventDefault()
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

function SendPromptButton() {
  const prompt = "fsd"

  const messages = []

  if (messages.length == 0 || messages.at(-1).done == true)
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="submit"
            size="sm"
            className="ml-auto gap-1.5"
            disabled={prompt === ""}
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
  else
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="submit"
            size="sm"
            variant="destructive"
            className="ml-auto gap-1.5"
          >
            Stop response
            <CircleSlash className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm text-muted-foreground">
            Press
            <kbd className="pointer-events-none inline-flex h-5 ml-1 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>Del
            </kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    )
}
