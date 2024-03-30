import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-label"

export default function PromptArea() {
  return (
    <>
      <Label
        htmlFor="message"
        className="sr-only"
      >
        Message
      </Label>
      <Textarea
        id="message"
        placeholder="Type your message here..."
        className="min-h-[9.5rem] resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      />
    </>
  )
}
