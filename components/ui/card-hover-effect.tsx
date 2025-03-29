"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface CardHoverEffectProps {
  children: React.ReactNode
  className?: string
}

export const CardHoverEffect = ({ children, className }: CardHoverEffectProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={ref}
      className={cn("relative rounded-md overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {isHovered && (
        <div
          className="absolute inset-0 bg-gray-900/10 backdrop-blur-sm z-10"
          style={{
            WebkitMaskImage: `radial-gradient(
              80px circle at ${position.x}px ${position.y}px,
              black,
              transparent
            )`,
            maskImage: `radial-gradient(
              80px circle at ${position.x}px ${position.y}px,
              black,
              transparent
            )`,
          }}
        />
      )}
      {children}
    </div>
  )
}

