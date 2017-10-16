import React from 'react'
import style from './style.styl'
import Device from './Device'
import TimeAnalyser, { TimeAnalyserDOM } from './TimeAnalyser'
import FrequencyAnalyser, { FrequencyAnalyserDOM } from './FrequencyAnalyser'

const context = new (window.AudioContext || window.webkitAudioContext)()
const timeAnalyser = TimeAnalyser(context)
const freqAnalyser = FrequencyAnalyser(context)

const gain = context.createGain()
gain.connect(context.destination)
gain.connect(timeAnalyser.analyser)
gain.connect(freqAnalyser.analyser)

const play = (time) => {
  gain.gain.setValueAtTime(0.001, time)
  gain.gain.exponentialRampToValueAtTime(0.8, time + 0.02)
  gain.gain.setValueAtTime(0.8, time + 0.98)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 1)

  const osc = context.createOscillator()
  osc.connect(gain)
  osc.start(time)
  osc.stop(time + 1)
}

play(context.currentTime + 0.5)
play(context.currentTime + 2.5)
play(context.currentTime + 4.5)

export default () => (
  <div className={style.container}>
    <Device name="Time Analyser">
      <TimeAnalyserDOM device={timeAnalyser} />
    </Device>
    <Device name="Freq Analyser">
      <FrequencyAnalyserDOM device={freqAnalyser} />
    </Device>
  </div>
)
