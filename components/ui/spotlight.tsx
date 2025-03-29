"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = "", fill = "white" }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [size, setSize] = useState(0)

  const updatePosition = (clientX: number, clientY: number) => {
    if (!divRef.current) return

    const rect = divRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    setPosition({ x, y })
  }

  const updateSize = () => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    setSize(size)
  }

  useEffect(() => {
    updateSize()
    window.addEventListener("resize", updateSize)

    return () => {
      window.removeEventListener("resize", updateSize)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY)
      setOpacity(1)
    }

    const handleMouseLeave = () => {
      setOpacity(0)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={divRef}
      className={cn("pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300", className)}
      style={{
        opacity,
      }}
    >
      <svg width="100%" height="100%">
        <defs>
          <radialGradient id="radial-gradient" cx={position.x} cy={position.y} r={size} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={fill} stopOpacity="0.1" />
            <stop offset="10%" stopColor={fill} stopOpacity="0.05" />
            <stop offset="20%" stopColor={fill} stopOpacity="0.025" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#radial-gradient)" />
      </svg>
    </div>
  )
}

