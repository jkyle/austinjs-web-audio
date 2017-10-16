import React from 'react'

const FrequencyAnalyser = (context) => {
  const analyser = context.createAnalyser()
  analyser.fftSize = 2048

  return {
    analyser,
  }
}

class FrequencyAnalyserDOM extends React.Component {
  componentDidMount() {
    const ctx2 = this.fcanvas.getContext('2d')
    const { analyser } = this.props.device
    const WIDTH = 300
    const HEIGHT = 300
    analyser.smoothingConstant = 1

    analyser.fftSize = 1024

    ctx2.clearRect(0, 0, WIDTH, HEIGHT)
    const bufferLengthAlt = analyser.frequencyBinCount
    const dataArrayAlt = new Uint8Array(bufferLengthAlt)
    const drawAlt = () => {
      requestAnimationFrame(drawAlt)

      analyser.getByteFrequencyData(dataArrayAlt)

      // ctx2.fillStyle = 'transparent'
      // ctx2.fillRect(0, 0, WIDTH, HEIGHT)
      ctx2.clearRect(0, 0, WIDTH, HEIGHT)

      const barWidth = WIDTH / bufferLengthAlt * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLengthAlt; i++) {
        barHeight = dataArrayAlt[i]

        // ctx2.fillStyle = 'rgb(240, 70, 212)'
        ctx2.fillStyle = 'rgb(240, 240, 240)'
        ctx2.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

        x += barWidth + 1
      }
    }
    drawAlt()
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
        <canvas ref={(canvas) => {
            this.fcanvas = canvas
          }}
          width={300}
          height={300}
        />
      </div>
    )
  }
}

export default FrequencyAnalyser
export { FrequencyAnalyserDOM }
