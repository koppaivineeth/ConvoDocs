import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path
  console.log("BEFORE VERCEL_URL", process.env.VERCEL_URL)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  console.log("AFTER VERCEL_URL", process.env.VERCEL_URL)

  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function constructMetadata({
  title = "YRC",
  description = "YRC is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        { url: image }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "VK"
    },
    icons,
    metadataBase: new URL("https://your-read-companion-3mhy5t23t-vineeth-koppais-projects.vercel.app"),
    themeColor: "#fff",
    ...(noIndex && {
      index: false,
      follow: false
    })
  }
}
