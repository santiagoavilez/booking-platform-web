import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from '@/components/ui/dialog'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Booking Platform Web
          </h1>
          <p className="text-muted-foreground text-lg">
            React + Vite + Tailwind CSS + shadcn/ui
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 p-8 border rounded-lg bg-card">
          <Button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </Button>
          <p className="text-sm text-muted-foreground">
            Edit <code className="px-2 py-1 bg-muted rounded text-foreground">src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="sm">
            Outline Button
          </Button>
          <Button variant="secondary" size="sm">
            Secondary Button
          </Button>
          <Button variant="destructive" size="sm">
            Destructive Button
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Open Dialog
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default App
