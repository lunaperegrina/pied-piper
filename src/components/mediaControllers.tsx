'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { type ChangeEvent, useState, useEffect } from 'react';


export function CardWithForm({ transcode, ffmpegMessage }: {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  transcode: (file: any) => Promise<void>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ffmpegMessage: any
}): React.JSX.Element {

  const [file, setFile] = useState<File>();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    console.log('aaaa')
    if (e.target.files) {
      console.log(e.target.files[0].type.split('/')[1])
      setFile(e.target.files[0]);
    }
  };

  function handleUploadClick() {
    transcode(file);
  }

  useEffect(() => {
    console.log(file?.size)
  }, [file])

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Convert</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="file-to-compress">File</Label>
              <Input onChange={handleFileChange} id="file-to-compress" type="file" />
            </div>
            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="file-to-compress">Files Selected: (TO-DO)</Label>

            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleUploadClick} disabled={file ? false : true }>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
