import { useState, useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import './App.css'

// Floating Heart Component
const FloatingHeart = ({ delay, left, size }: { delay: number; left: string; size: number }) => {
  return (
    <div
      className="floating-heart"
      style={{
        left,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `-${delay}s`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  )
}

// Confetti Component
const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      color: string
      rotation: number
      rotationSpeed: number
    }> = []

    const colors = ['#ffb7d5', '#f080a0', '#ffffff', '#ff6b9d', '#ffc8dd']

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        speedY: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.y += particle.speedY
        particle.x += particle.speedX
        particle.rotation += particle.rotationSpeed

        if (particle.y > canvas.height) {
          particle.y = -20
          particle.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.rotation * Math.PI) / 180)
        ctx.fillStyle = particle.color
        
        const size = particle.size
        ctx.beginPath()
        ctx.moveTo(0, size / 4)
        ctx.bezierCurveTo(-size / 2, -size / 4, -size / 2, -size / 2, 0, -size / 2)
        ctx.bezierCurveTo(size / 2, -size / 2, size / 2, -size / 4, 0, size / 4)
        ctx.fill()
        
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="confetti-canvas" />
}

// Main Question Page
const QuestionPage = ({ onYes }: { onYes: () => void }) => {
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const noBoundaryRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const yesBtnRef = useRef<HTMLButtonElement>(null)
  const noBtnWrapperRef = useRef<HTMLDivElement>(null)
  const [noButtonPosition, setNoButtonPosition] = useState<{ x: number; y: number } | null>(null)
  const [noButtonInstance, setNoButtonInstance] = useState(0)

  useEffect(() => {
    gsap.set([titleRef.current, yesBtnRef.current, noBtnWrapperRef.current], { opacity: 1 })
    
    const tl = gsap.timeline()
    
    tl.from(titleRef.current, {
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.2,
    })
    
    tl.from([yesBtnRef.current, noButtonRef.current], {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.7)',
    }, '-=0.3')
  }, [])

  const handleNoClick = () => {
    const button = noButtonRef.current
    const container = containerRef.current
    const boundary = noBoundaryRef.current
    if (!button || !container || !boundary) return

    const buttonRect = button.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const boundaryRect = boundary.getBoundingClientRect()

    const buttonWidth = buttonRect.width
    const buttonHeight = buttonRect.height

    const boundaryPadding = 16
    const boundaryLeft = boundaryRect.left - containerRect.left
    const boundaryTop = boundaryRect.top - containerRect.top
    const boundaryRight = boundaryRect.right - containerRect.left
    const boundaryBottom = boundaryRect.bottom - containerRect.top

    // Always keep movement inside the centered portrait boundary.
    let minX = boundaryLeft + boundaryPadding
    let maxX = boundaryRight - buttonWidth - boundaryPadding
    let minY = boundaryTop + boundaryPadding
    let maxY = boundaryBottom - buttonHeight - boundaryPadding

    // If the viewport is smaller than the boundary, clamp to visible area.
    minX = Math.max(0, minX)
    minY = Math.max(0, minY)
    maxX = Math.min(containerRect.width - buttonWidth, maxX)
    maxY = Math.min(containerRect.height - buttonHeight, maxY)

    if (maxX < minX || maxY < minY) return

    const newX = Math.random() * (maxX - minX) + minX
    const newY = Math.random() * (maxY - minY) + minY

    setNoButtonPosition({ x: newX, y: newY })
    setNoButtonInstance((prev) => prev + 1)
  }

  const handleYesClick = () => {
    const btn = yesBtnRef.current
    if (!btn) return

    gsap.to(btn, {
      scale: 0.9,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(btn, {
          scale: 1.2,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => {
            onYes()
          }
        })
      }
    })
  }

  const floatingHearts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        delay: Math.random() * 12,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 30 + 15,
      })),
    []
  )

  return (
    <div ref={containerRef} className="page-container">
      <div ref={noBoundaryRef} className="no-button-boundary" aria-hidden="true" />

      <div className="hearts-background">
        {floatingHearts.map((heart) => (
          <FloatingHeart
            key={heart.id}
            delay={heart.delay}
            left={heart.left}
            size={heart.size}
          />
        ))}
      </div>

      <div className="content-wrapper">
        <div className="heart-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <h1 ref={titleRef} className="question-title">
          Will you be my Valentine?
        </h1>

        <div className="buttons-container">
          <button ref={yesBtnRef} onClick={handleYesClick} className="btn btn-yes">
            <span className="btn-text">Yes</span>
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
          </button>
          
          {noButtonPosition === null ? (
            <div ref={noBtnWrapperRef} className="no-button-wrapper">
              <button
                key={`no-inline-${noButtonInstance}`}
                ref={noButtonRef}
                onMouseEnter={handleNoClick}
                onClick={handleNoClick}
                className="btn btn-no"
              >
                <span className="btn-text">No :c</span>
              </button>
            </div>
          ) : (
            <div className="no-button-spacer" aria-hidden="true" />
          )}
        </div>
      </div>

      {noButtonPosition !== null && (
        <button
          key={`no-teleport-${noButtonInstance}`}
          ref={noButtonRef}
          onMouseEnter={handleNoClick}
          onClick={handleNoClick}
          className="btn btn-no btn-no-teleport"
          style={{ left: `${noButtonPosition.x}px`, top: `${noButtonPosition.y}px` }}
        >
          <span className="btn-text">No :c</span>
        </button>
      )}
    </div>
  )
}

// Success Page
const SuccessPage = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [calendarAdded, setCalendarAdded] = useState(false)

  useEffect(() => {
    if (!contentRef.current) return

    gsap.fromTo(
      contentRef.current,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.3,
        clearProps: 'transform,opacity',
      }
    )
  }, [])

  const handleCalendarClick = () => {
    setCalendarAdded(true)
    
    const eventTitle = encodeURIComponent('Early Valentine\'s Day Date')
    const details = encodeURIComponent('With da real scrabble master')
    const location = encodeURIComponent('i forgor')
    
    const startDate = '20260212'
    const endDate = '20260212'
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${details}&location=${location}`
    
    setTimeout(() => {
      window.open(googleCalendarUrl, '_blank')
    }, 300)
  }

  return (
    <div className="page-container success-page">
      <Confetti />
      
        <div ref={contentRef} className="success-content">
          <div className="celebration-icon">
            <img src="/blehhhhhh.gif" alt="Celebration cat" className="celebration-gif" />
          </div>
        
        <h1 className="success-title">Yipeeee!!!</h1>
        
        <p className="success-message">
          luh u cuh &lt;3 &lt;3 &lt;3
        </p>

        <div className="heart-divider">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>

        <button 
          onClick={handleCalendarClick}
          className={`calendar-btn ${calendarAdded ? 'added' : ''}`}
          disabled={calendarAdded}
        >
          {calendarAdded ? (
            <>
              <svg className="calendar-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Event Added!</span>
            </>
          ) : (
            <>
              <svg className="calendar-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
              <span>Add to Google Calendar</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Main App
function App() {
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <div className="app">
      {showSuccess ? (
        <SuccessPage />
      ) : (
        <QuestionPage onYes={() => setShowSuccess(true)} />
      )}
    </div>
  )
}

export default App
