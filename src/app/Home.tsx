'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { CardWithForm } from '@/components/mediaControllers'

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)

  async function load() {
    setIsLoading(true)
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message
    })

    ffmpeg.on('progress', ({ progress, time }) => {
      if (messageRef.current) messageRef.current.innerHTML = `Progress: ${progress} Time: ${time}`
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })
    setLoaded(true)
    setIsLoading(false)
  }

  async function transcode(
    file: Blob,
    outputFormat: string,
    typeOperaton: 'compress' | 'convert',
    quality?: 'low' | 'medium' | 'high') {
    const ffmpeg = ffmpegRef.current
    console.log('transcoding')
    console.log(outputFormat)
    console.log(typeOperaton)
    console.log(quality)
    await ffmpeg.writeFile(`input.${file.type.split('/')[1]}`, await fetchFile(file))
    console.log('file written')

    if (typeOperaton === 'convert') {
      console.log('convert')
      await ffmpeg.exec(['-i', `input.${file.type.split('/')[1]}`, `output.${outputFormat}`])
    } else if (typeOperaton === 'compress') {
      console.log('compress')
      switch (quality) {
        case "high":
          console.log('high')
          await ffmpeg.exec(['-i', `input.${file.type.split('/')[1]}`, '-vcodec', 'h264', '-acodec', 'mp2', 'output.mp4'])
          break;
        case "medium":
          console.log('medium')
          await ffmpeg.exec(['-i', `input.${file.type.split('/')[1]}`, "-s 1280x720 -acodec copy -y", 'output.mp4'])
          break;
        case "low":
          console.log('low')
          await ffmpeg.exec(['-i', `input.${file.type.split('/')[1]}`, "-vcodec h264 -b:v 1000k -acodec mp3", 'output.mp4'])
          break;
        default:
          break;
      }
    }
  
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const data = (await ffmpeg.readFile('output.mp4')) as any
    if (videoRef.current)
      videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <h1 className="text-4xl font-bold text-center">Compress WASM</h1>
      {isLoading && <LoadingPidePiper />}

      <div className="w-full flex flex-row items-center justify-center h-screen m-8 gap-4">
        <section className='flex-auto w-2/3'>
          {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
          {isLoading ? <Skeleton className='w-full h-80 rounded-xl' /> : <video ref={videoRef} controls className='w-2/3 h-96 mx-auto' />}
        </section>
        <aside className='flex-auto w-1/3'>
          <CardWithForm transcode={transcode} ffmpegMessage={messageRef} videoRef={videoRef} />
        </aside>

      </div>

    </>
  )
}

function LoadingPidePiper() {
  return (
    <p
      // className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center text-white py-2 px-4 rounded"
      className="text-white py-2 px-4 flex items-center">
      Loading ffmpeg... (our Pide Piper 🪈💚 31MB)
      <span className="animate-spin ml-3">
        <svg
          viewBox="0 0 1024 1024"
          focusable="false"
          data-icon="loading"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true">
          <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
        </svg>
      </span>
    </p>
  )
}