;(function (window) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  const FRAME_RATE = 60
  const PARTICLE_NUM = 3000
  const RADIUS = Math.PI * 2
  const CANVASHEIGHT = 150
  const CANVASID = 'canvas'

  let texts = ['MY DEAR ALU', 'LOOK UP AT THE', 'STARRY SKY', 'ARE YOU', 'LOOKING', 'AT THE', 'SAME STAR', 'WITH ME ?', 'HAPPY', 'VALENTINE\'S', 'DAY', 'Amar ALU ❤️']

  let canvas, ctx, particles = [], text = texts[0], textIndex = 0, textSize = 80

  function updateCanvasSize() {
    let tempCanvas = document.createElement("canvas")
    let tempCtx = tempCanvas.getContext("2d")
    tempCtx.font = `${textSize}px 'Arial', 'Helvetica Neue', 'sans-serif'`
    let textWidth = tempCtx.measureText(text).width
    let padding = 80  // Increased left padding to prevent cropping
    return textWidth + padding
  }

  function draw () {
    let CANVASWIDTH = updateCanvasSize()
    canvas.width = CANVASWIDTH

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)
    ctx.fillStyle = 'white'
    ctx.textBaseline = 'middle'
    ctx.fontWeight = 'bold'
    ctx.font = `${textSize}px 'Arial', 'Helvetica Neue', 'sans-serif'`
    
    let textX = 40  // Shifted text slightly right
    let textY = CANVASHEIGHT * 0.5
    ctx.fillText(text, textX, textY)

    let imgData = ctx.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)
    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)

    for (let p of particles) p.inText = false
    particleText(imgData)

    window.requestAnimationFrame(draw)
  }

  function particleText (imgData) {
    let pxls = []
    for (let w = canvas.width; w > 0; w -= 2) {
      for (let h = 0; h < CANVASHEIGHT; h += 2) {
        let index = (w + h * canvas.width) * 4
        if (imgData.data[index] > 1) pxls.push([w, h])
      }
    }

    let j = Math.max(0, parseInt((particles.length - pxls.length) / 2, 10))
    for (let i = 0; i < pxls.length && j < particles.length; i++, j++) {
      let p = particles[j]
      let X = (pxls[i][0]) - p.px
      let Y = (pxls[i][1]) - p.py
      let T = Math.sqrt(X * X + Y * Y)
      let A = Math.atan2(Y, X)

      p.x = p.px + Math.cos(A) * T * p.delta
      p.y = p.py + Math.sin(A) * T * p.delta
      p.px = p.x
      p.py = p.y
      p.inText = true
      p.fadeIn()
      p.draw(ctx)
    }

    for (let p of particles) {
      if (!p.inText) p.fadeOut()
      p.draw(ctx)
    }
  }

  function setDimensions () {
    let CANVASWIDTH = updateCanvasSize()
    canvas.width = CANVASWIDTH
    canvas.height = CANVASHEIGHT
    canvas.style.position = 'absolute'
    canvas.style.left = '50%'
    canvas.style.top = '50%'
    canvas.style.transform = 'translate(-50%, -50%)'
  }

  function event () {
    document.addEventListener('click', () => updateText(), false)
    document.addEventListener('touchstart', () => updateText(), false)
  }

  function updateText() {
    textIndex = (textIndex + 1) % texts.length
    text = texts[textIndex]
    setDimensions()  // Recalculate canvas size when text changes
    console.log("Text updated:", text)
  }

  function init () {
    canvas = document.getElementById(CANVASID)
    if (!canvas || !canvas.getContext) return

    ctx = canvas.getContext('2d')
    setDimensions()
    event()

    for (let i = 0; i < PARTICLE_NUM; i++) particles[i] = new Particle(canvas)
    draw()
  }

  class Particle {
    constructor (canvas) {
      this.delta = 0.08
      this.x = 0
      this.y = 0
      this.px = Math.random() * canvas.width
      this.py = canvas.height * 0.5 + ((Math.random() - 0.5) * canvas.height)
      this.mx = this.px
      this.my = this.py
      this.size = Math.random() * 1.5
      this.inText = false
      this.opacity = 0
      this.fadeInRate = 0.02
      this.fadeOutRate = 0.02
      this.opacityTresh = 0.95
      this.fadingOut = true
      this.fadingIn = true
    }

    fadeIn () {
      if (this.opacity < this.opacityTresh) this.opacity += this.fadeInRate
    }

    fadeOut () {
      if (this.opacity > 0) this.opacity -= this.fadeOutRate
    }

    draw (ctx) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true)
      ctx.closePath()
      ctx.fill()
    }
  }

  setTimeout(init, 5000)  // Delay start by 5 seconds
})(window)
