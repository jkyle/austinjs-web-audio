import React from 'react'
import style from './style.styl'
import Device from './Device'
import TimeAnalyser, { TimeAnalyserDOM } from './TimeAnalyser'
import FrequencyAnalyser, { FrequencyAnalyserDOM } from './FrequencyAnalyser'
import MultiOsc, { MultiOscDOM } from './Multiosc'

const context = new (window.AudioContext || window.webkitAudioContext)()
const timeAnalyser = TimeAnalyser(context)
const freqAnalyser = FrequencyAnalyser(context)
const osc = MultiOsc(context)
const gain = context.createGain()
osc.gain.connect(gain)
gain.connect(context.destination)
gain.connect(timeAnalyser.analyser)
gain.connect(freqAnalyser.analyser)

const play = (time) => {
  osc.start(time).stop(time + 1)
}

setInterval(() => play(context.currentTime + 0.5), 2000)

export default () => (
  <div className={style.container}>
    <Device name="Oscillator">
      <MultiOscDOM device={osc} />
    </Device>
    <Device name="Time Analyser">
      <TimeAnalyserDOM device={timeAnalyser} />
    </Device>
    <Device name="Freq Analyser">
      <FrequencyAnalyserDOM device={freqAnalyser} />
    </Device>
  </div>
)
