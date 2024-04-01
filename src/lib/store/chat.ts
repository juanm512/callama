import { create } from "zustand"
import { persist, createJSONStorage, StateStorage } from "zustand/middleware"
import { get, set, del } from "idb-keyval" // can use anything: IndexedDB, Ionic Storage, etc.
import { ElementRef, Ref } from "react"

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // console.log(name, "has been retrieved")
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // console.log(name, "with value", value, "has been saved")
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    // console.log(name, "has been deleted")
    await del(name)
  }
}

export interface Message {
  id: string
  chatId: string
  content: string
  role: "user" | "assistant"
  created_at: number | Date
  done: boolean
  error: boolean
  model?: string
  context?: string
  info?: {
    total_duration?: number
    load_duration?: number
    sample_count?: number
    sample_duration?: number
    prompt_eval_count?: number
    prompt_eval_duration?: number
    eval_count?: number
    eval_duration?: number
  }
}
export interface Chat {
  id: string
  title: string
  model: string
  created_at: number | Date
}
type ChatsMessages = {
  [id: string]: {
    id: string
    messages: Message[]
  }
}

const statusValues: {
  [key: string]: {}
} = {
  IDLE: 0,
  REQUESTING: 1
}

export interface BasicStoreType {
  status: number
  abortFlag: boolean
  controller: AbortController

  changeStatus: (statusKey: string) => void

  changeAbortFlag: (newV: boolean) => void
  setController: (controller: AbortController | null) => void
}
export interface ChatStoreType {
  currentChatId: string
  chats: Chat[]
  chatsMessages: {
    [id: string]: {
      id: string
      messages: Message[]
    }
  }
  changeCurrentChatId: (newId: string) => void
  setChatTitle: (id: string, title: string) => void
  addChat: (newChat: Chat) => void
  addMsg: (chatId: string, newMsg: Message) => void
  updateMsg: (chatId: string, msgId: string, newMsg: Message) => void
}

export interface PromptStoreType {
  prompt: string
  lastPrompt: string

  changePrompt: (prompt: string) => void
  changeLastPrompt: (prompt: string) => void
}

export const useBasicStore = create(
  persist(
    (set, get) => ({
      status: 0,
      abortFlag: false,
      controller: null,

      changeStatus: (statusKey: string) =>
        set({ status: statusValues[statusKey] }),
      changeAbortFlag: (newV: string) =>
        set(() => {
          return { abortFlag: newV }
        }),

      setController: (newcontroller: () => void | null) =>
        set({ controller: newcontroller })
    }),
    {
      name: "basic-store", // unique name
      storage: createJSONStorage(() => storage)
    }
  )
)

export const useChatStore = create(
  persist(
    (set, get) => ({
      currentChatId: "",
      chats: [],
      chatsMessages: {},
      changeCurrentChatId: (newId: string) =>
        set((state: { currentChatId: string }) => {
          return { ...state, currentChatId: newId }
        }),
      setChatTitle: (id: string, title: string) =>
        set((state: { chats: Chat[] }) => {
          const newChats = state.chats.forEach((chat) => {
            if (chat.id === id) chat.title = title
          })
          return { chats: newChats }
        }),
      addChat: (newChat: Chat) =>
        set((state: { chats: Chat[]; chatsMessages: ChatsMessages }) => {
          const newChats = state.chats

          newChats.push(newChat)
          return {
            chats: newChats
          }
        }),
      addMsg: (chatId: string, newMsg: Message) =>
        set((state: { chatsMessages: ChatsMessages }) => {
          const newChatsMessages = state.chatsMessages
          const chatMessages = newChatsMessages[chatId] || {
            id: chatId,
            messages: []
          }
          // console.log(newChatsMessages, chatMessages)
          chatMessages.messages.push(newMsg)
          newChatsMessages[chatId] = chatMessages
          return {
            chatsMessages: newChatsMessages
          }
        }),
      updateMsg: (chatId: string, msgId: string, newMsg: Message) =>
        set((state: { chatsMessages: ChatsMessages }) => {
          const newChatsMessages = state.chatsMessages
          const msgIndex = newChatsMessages[chatId].messages.findIndex(
            (m) => m.id == msgId
          )
          newChatsMessages[chatId].messages[msgIndex] = newMsg

          return {
            chatsMessages: newChatsMessages
          }
        })
    }),
    {
      name: "chat-store", // unique name
      storage: createJSONStorage(() => storage)
    }
  )
)

export const usePromptStore = create(
  persist(
    (set, get) => ({
      prompt: "",
      lastPrompt: "why the sky is blue?",
      changePrompt: (prompt: string) => set({ prompt: prompt }),
      changeLastPrompt: (prompt: string) => set({ lastPrompt: prompt })
    }),
    {
      name: "prompt-store", // unique name
      storage: createJSONStorage(() => storage)
    }
  )
)
