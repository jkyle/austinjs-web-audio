import React from 'react'
import style from './style.styl'
import Device from './Device'
import TimeAnalyser, { TimeAnalyserDOM } from './TimeAnalyser'
import FrequencyAnalyser, { FrequencyAnalyserDOM } from './FrequencyAnalyser'
import MultiOsc, { MultiOscDOM } from './Multiosc'
import Keyboard, { KeyboardDOM } from './Keyboard'

const context = new (window.AudioContext || window.webkitAudioContext)()
const keyboard = Keyboard(context)
const timeAnalyser = TimeAnalyser(context)
const freqAnalyser = FrequencyAnalyser(context)
const osc = MultiOsc(context)
keyboard.register(osc.start)
const gain = context.createGain()
osc.gain.connect(gain)
gain.connect(context.destination)
gain.connect(timeAnalyser.analyser)
gain.connect(freqAnalyser.analyser)

export default () => (
  <div className={style.container}>
    <Device name="Keyboard">
      <KeyboardDOM device={keyboard} />
    </Device>
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
