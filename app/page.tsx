import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="bg-slate-200 p-4">
      <h1 className="font-serif text-4xl">Hello there</h1>
      <h1 className="font-sans text-xl">Hello there</h1>
    </section>
  )
}
