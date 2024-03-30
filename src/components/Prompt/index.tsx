import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@radix-ui/react-tooltip"
import { Paperclip, Mic, CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import PromptArea from "./PromptArea"

export default function Prompt() {
  return (
    <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
      <PromptArea />
      <div className="flex items-center p-3 pt-0">
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
        <Button
          type="submit"
          size="sm"
          className="ml-auto gap-1.5"
        >
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}
