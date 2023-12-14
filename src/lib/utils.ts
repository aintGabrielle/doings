import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export enum TaskStatus {
  ONGOING = "ongoing",
  PENDING = "pending",
  DROPPED = "dropped",
  CANCELLED = "cancelled",
  DONE = "done",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateProjectEnrollmentID() {
  const pattern = "xxxx-xxxx"
  const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

  let enrollment_id = ""

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "x") {
      enrollment_id += alphanumeric[Math.floor(Math.random() * alphanumeric.length)]
    } else {
      enrollment_id += pattern[i]
    }
  }

  return enrollment_id
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}