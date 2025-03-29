"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import { useState, useRef } from "react"

interface HoverBorderGradientProps {
  children: React.ReactNode
  containerClassName?: string
  className?: string
  as?: React.ElementType
  duration?: number
  from?: string
  via?: string
  to?: string
  borderWidth?: number
  onClick?: () => void
  borderClassName?: string
}

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Component = "div",
  duration = 0.2,
  from = "from-purple-500",
  via = "via-pink-500",
  to = "to-blue-500",
  borderWidth = 1,
  onClick,
  borderClassName,
}: HoverBorderGradientProps) => {
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
    <Component
      ref={ref}
      className={cn("relative p-[1px] group/btn overflow-hidden", containerClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{
        transition: `all ${duration}s ease-in-out`,
      }}
    >
      {isHovered && (
        <div
          className={cn("absolute inset-0 w-full h-full bg-gradient-to-r", from, via, to, borderClassName)}
          style={{
            WebkitMaskImage: `radial-gradient(
              30% 30% at ${position.x}px ${position.y}px,
              black 45%,
              transparent 70%
            )`,
            maskImage: `radial-gradient(
              30% 30% at ${position.x}px ${position.y}px,
              black 45%,
              transparent 70%
            )`,
          }}
        />
      )}
      <div className={cn("relative h-full w-full", className)}>{children}</div>
    </Component>
  )
}

