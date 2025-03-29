"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import { useEffect, useRef, useState } from "react"

export const BackgroundGradientAnimation = ({
  children,
  className,
  containerClassName,
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  opacity = "0.5",
  interactive = true,
  containerRef,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  gradientBackgroundStart?: string
  gradientBackgroundEnd?: string
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  fourthColor?: string
  fifthColor?: string
  pointerColor?: string
  size?: string
  blendingValue?: string
  opacity?: string
  interactive?: boolean
  containerRef?: React.RefObject<HTMLDivElement>
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null)
  const [curX, setCurX] = useState(0)
  const [curY, setCurY] = useState(0)
  const [tgX, setTgX] = useState(0)
  const [tgY, setTgY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const ref = containerRef || interactiveRef

  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart)
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd)
    document.body.style.setProperty("--first-color", firstColor)
    document.body.style.setProperty("--second-color", secondColor)
    document.body.style.setProperty("--third-color", thirdColor)
    document.body.style.setProperty("--fourth-color", fourthColor)
    document.body.style.setProperty("--fifth-color", fifthColor)
    document.body.style.setProperty("--pointer-color", pointerColor)
    document.body.style.setProperty("--size", size)
    document.body.style.setProperty("--blending-value", blendingValue)
    document.body.style.setProperty("--opacity", opacity)
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
    opacity,
  ])

  useEffect(() => {
    let animationFrameId: number

    function move() {
      if (!ref.current || !interactive) return
      setCurX((prevCurX) => prevCurX + (tgX - prevCurX) / 20)
      setCurY((prevCurY) => prevCurY + (tgY - prevCurY) / 20)
      if (ref.current) {
        ref.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
      }
      animationFrameId = requestAnimationFrame(move)
    }

    animationFrameId = requestAnimationFrame(move)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [interactive, tgX, tgY])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !interactive) return
    const rect = ref.current.getBoundingClientRect()
    setTgX(event.clientX - rect.left - rect.width / 2)
    setTgY(event.clientY - rect.top - rect.height / 2)
  }

  const [isSafari, setIsSafari] = useState(false)
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setTgX(0)
        setTgY(0)
      }}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div className={cn("gradients-container h-full w-full blur-lg", isSafari ? "blur-2xl" : "[filter:url(#blurMe)]")}>
        <div
          ref={ref}
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_${
              isHovered ? "0.8" : "0.8"
            })_0,_rgba(var(--first-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
          )}
        ></div>
        <div
          ref={ref}
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_${
              isHovered ? "1" : "0.8"
            })_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-rotate`,
          )}
          style={{
            animationDirection: "reverse",
          }}
        ></div>
        <div
          ref={ref}
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_${
              isHovered ? "1" : "0.8"
            })_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-rotate`,
          )}
          style={{
            animationDuration: "15s",
          }}
        ></div>
        <div
          ref={ref}
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_${
              isHovered ? "1" : "0.8"
            })_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-rotate`,
          )}
          style={{
            animationDirection: "reverse",
            animationDuration: "20s",
          }}
        ></div>
        <div
          ref={ref}
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_${
              isHovered ? "1" : "0.8"
            })_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-rotate`,
          )}
          style={{
            animationDuration: "25s",
          }}
        ></div>
        {interactive && isHovered && (
          <div
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_${
                isHovered ? "1" : "0"
              })_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
            )}
            style={{
              transform: `translate(${tgX}px, ${tgY}px)`,
              width: "100%",
              height: "100%",
              opacity: isHovered ? "1" : "0",
              transition: "opacity 0.3s ease-in-out",
            }}
          ></div>
        )}
      </div>
    </div>
  )
}

