import { NextResponse } from "next/server"

type Meta = {
  correlationId: string
}

export function ok<T>(data: T, meta: Meta, init?: ResponseInit) {
  return NextResponse.json({ data, meta }, init)
}

export function created<T>(data: T, meta: Meta) {
  return NextResponse.json({ data, meta }, { status: 201 })
}
