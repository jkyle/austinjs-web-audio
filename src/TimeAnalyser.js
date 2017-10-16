import React from 'react'

const TimeAnalyser = (context) => {
  const analyser = context.createAnalyser()
  analyser.fftSize = 2048

  return {
    analyser,
  }
}

class TimeAnalyserDOM extends React.Component {
  componentDidMount() {
    const ctx = this.canvas.getContext('2d')
    const { analyser } = this.props.device
    const WIDTH = 300
    const HEIGHT = 300
    analyser.smoothingConstant = 1

    analyser.fftSize = 1024
    const bufferLength = analyser.fftSize
    // const dataArray = new Float32Array(bufferLength);
    const dataArray = new Uint8Array(bufferLength)

    let prev = 0
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    const draw = () => {
      requestAnimationFrame(draw)

      analyser.getByteTimeDomainData(dataArray)
      if (prev <= 128 && dataArray[0] > 128) {
        // ctx.fillStyle = 'transparent'
        // ctx.fillRect(0, 0, WIDTH, HEIGHT)
        ctx.clearRect(0, 0, WIDTH, HEIGHT)

        ctx.lineWidth = 2
        // ctx.strokeStyle = 'rgb(240, 70, 212)'
        ctx.strokeStyle = 'rgb(240, 240, 240)'

        ctx.beginPath()

        const sliceWidth = WIDTH * (1.0 / bufferLength)
        let x = 0
        for (let i = 0; i < bufferLength; i += 1) {
          const v = dataArray[i] / 128.0
          // const v = dataArray[i] * 200;
          const y = v * (HEIGHT / 2)
          // const y = v + (HEIGHT / 2);

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          x += sliceWidth
        }

        ctx.lineTo(this.canvas.width, this.canvas.height / 2)
        ctx.stroke()
      }
      prev = dataArray[0]
    }

    draw()
  }

  render() {
    return (
      <div>
        <canvas ref={(canvas) => {
            this.canvas = canvas
          }}
          width={300}
          height={300}
        />
      </div>
    )
  }
}

export default TimeAnalyser
export { TimeAnalyserDOM }
