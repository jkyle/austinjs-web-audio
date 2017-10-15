import React, { Component } from 'react'
import style from './style.styl'
import MultiOsc, { MultiOscDOM } from './MultiOsc'
import Oscillator, { OscillatorDOM } from './Oscillator'
import LFO, { LFODOM } from './LFO'
import Device from './Device'

const context = new (window.AudioContext || window.webkitAudioContext)()
const osc = MultiOsc(context)
osc.mainGain.connect(context.destination)

const lfo = LFO(context)
lfo.gain.connect(osc.mainGain.gain)
lfo.start(context.currentTime, 2)

export default class Song extends Component {
  play = () => {
    const stop = osc.start(context.currentTime)
    stop(context.currentTime + 5)
  }

  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Device name="Multi-Oscillator">
          <MultiOscDOM device={osc} />
        </Device>

        <Device name="LFO">
          <LFODOM device={lfo} />
        </Device>

        <Device name="Big Button">
          <button onClick={this.play}>Play</button>
        </Device>
      </div>
    )
  }
}
