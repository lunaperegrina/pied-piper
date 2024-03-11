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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { compatibleFormats } from "@/utils/ffmpegFormats"

import { filesize } from "filesize";

import { Separator } from "@/components/ui/separator"

import { type ChangeEvent, useState, useEffect, use } from 'react';


export function CardWithForm({ transcode, ffmpegMessage, videoRef }: {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  transcode: (file: any,
    outputFormat: string,
    typeOperaton: 'compress' | 'convert',
    videoQuality?: 'low' | 'medium' | 'high') => Promise<void>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ffmpegMessage: any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  videoRef: any
}): React.JSX.Element {

  const [file, setFile] = useState<File>();
  const [isCompatible, setIsCompatible] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>();
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high'>();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      console.log(e.target.files[0].name)
      console.log(e.target.files[0].name.split('.'))
      console.log(e.target.files[0].name.split('.').pop())
      setFile(e.target.files[0]);
    }
  };

  function handleUploadClick(
    typeOperaton: 'compress' | 'convert',
    videoQuality?: 'low' | 'medium' | 'high'
  ) {
    transcode(file, outputFormat as string, typeOperaton, videoQuality);
    setVideoSrc("")
  }

  function handleDownloadClick() {
    console.log('download')

    const element = document.createElement('a');
    element.href = videoRef.current.src;
    element.download = "download";
    document.body.appendChild(element);
    element.click();
  }

  useEffect(() => {
    console.log(videoRef.current.src)
    setVideoSrc(videoRef.current.src)
  }, [videoRef])

  useEffect(() => {
    console.log(file?.size)
    console.log(file?.type)
    console.log(file?.name.split('.').pop() as string)
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    console.log(compatibleFormats[file?.name.split('.').pop() as string])
    setIsCompatible(compatibleFormats[file?.name.split('.').pop() as string] ? true : false)
  }, [file])

  return (
    <Tabs defaultValue="convert" className="w-2/3 m-4 rounded-2xl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="convert">Convert</TabsTrigger>
        <TabsTrigger value="compress">Compress</TabsTrigger>
      </TabsList>
      <TabsContent value="convert">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Convert</CardTitle>
            {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="file-to-compress">Input File</Label>
                <Input onChange={handleFileChange} id="file-to-compress" type="file" />
              </div>
              <div className="flex flex-col space-y-1.5">

                {file && (
                  <>
                    <Label className="text-zinc-400" >File size: {filesize(file?.size as number, { standard: "jedec" })}</Label>
                    <Label className="text-zinc-400">File type: {file?.type}</Label>
                  </>
                )}

              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Output Format</Label>
                <Select
                  onValueChange={(value) => { setOutputFormat(value) }}
                  disabled={!isCompatible}>
                  <SelectTrigger id="output-format">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {
                      isCompatible && compatibleFormats[file?.name.split('.').pop() as string].map((format) => (
                        <SelectItem value={format}>{format}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator orientation="horizontal" />
            <p ref={ffmpegMessage} className="text-zinc-400 my-3" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Separator orientation="vertical" />
            <Button onClick={() => handleUploadClick('convert')} disabled={file && outputFormat ? false : true}>
              Convert
            </Button>
          </CardFooter>
          <CardFooter className="flex justify-between">
            <Button onClick={handleDownloadClick} className="w-full" disabled={file && outputFormat && videoSrc === "" ? false : true}>
              {/* <Image src="/icons/download.png" alt="Download" width={20} height={20} /> */}
              Download
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="compress">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Compress</CardTitle>
            {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="file-to-compress">Input File (only mp4)</Label>
                <Input onChange={handleFileChange} id="file-to-compress" type="file" />
              </div>
              <div className="flex flex-col space-y-1.5">

                {file && (
                  <>
                    <Label className="text-zinc-400" >File size: {filesize(file?.size as number, { standard: "jedec" })}</Label>
                    <Label className="text-zinc-400">File type: {file?.type}</Label>
                  </>
                )}

              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Output Format</Label>
                <Select
                  onValueChange={(value) => { setVideoQuality(value as 'low' | 'medium' | 'high') }}>
                  <SelectTrigger id="output-format">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={'high'}>Good</SelectItem>
                    <SelectItem value={'medium'}>Medium</SelectItem>
                    <SelectItem value={'low'}>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator orientation="horizontal" />
            <p ref={ffmpegMessage} className="text-zinc-400 my-3" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Separator orientation="vertical" />
            <Button onClick={() => handleUploadClick('compress', videoQuality)} disabled={file ? false : true}>
              Compress
            </Button>
          </CardFooter>
          <CardFooter className="flex justify-between">
            <Button onClick={handleDownloadClick} className="w-full" disabled={file && videoSrc === "" ? false : true}>
              {/* <Image src="/icons/download.png" alt="Download" width={20} height={20} /> */}
              Download
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
