import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.info("HELLO FROM AIRTABLE !")

  return NextResponse.json({ message: "hello world" })
}
