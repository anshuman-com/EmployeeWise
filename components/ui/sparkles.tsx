"use client"
import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  particleColor?: string
  className?: string
  particleClassName?: string
  id?: string
}

export const SparklesCore = ({
  id,
  className,
  background,
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  particleColor = "#FFF",
  particleClassName,
  ...props
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<any[]>([])
  const animationRef = useRef<number | null>(null)
  const resizeRef = useRef<any>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    const createParticles = () => {
      const particleCount = Math.min(particleDensity, 1000)
      particles.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random(),
        opacitySpeed: Math.random() * 0.02,
      }))
    }

    createParticles()

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.opacity += particle.opacitySpeed

        if (particle.opacity > 1 || particle.opacity < 0) {
          particle.opacitySpeed = -particle.opacitySpeed
        }

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${Number.parseInt(particleColor.slice(1, 3), 16)}, ${Number.parseInt(
          particleColor.slice(3, 5),
          16,
        )}, ${Number.parseInt(particleColor.slice(5, 7), 16)}, ${particle.opacity})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [minSize, maxSize, particleDensity, particleColor])

  return (
    <div className={cn("fixed inset-0 z-0", className)} {...props}>
      <canvas
        ref={canvasRef}
        id={id}
        className={cn("h-full w-full", particleClassName)}
        style={{
          background: background || "transparent",
        }}
      />
    </div>
  )
}

