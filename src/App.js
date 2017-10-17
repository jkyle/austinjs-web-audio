import React from 'react'
import style from './style.styl'
import Device from './Device'
import TimeAnalyser, { TimeAnalyserDOM } from './TimeAnalyser'
import FrequencyAnalyser, { FrequencyAnalyserDOM } from './FrequencyAnalyser'
import MultiOsc, { MultiOscDOM } from './Multiosc'
import Keyboard, { KeyboardDOM } from './Keyboard'
import Filter, { FilterDOM } from './Filter'
import LFO, { LFODOM } from './LFO'
import Clock, { ClockDOM } from './Clock'
import Sequencer, { SequencerDOM } from './Sequencer'
import Delay, { DelayDOM } from './Delay'
import Distortion, { DistortionDOM } from './Distortion'
import Detune, { DetuneDOM } from './Detune'

const context = new (window.AudioContext || window.webkitAudioContext)()
const keyboard = Keyboard(context)
const filter = Filter(context)
const osc = MultiOsc(context)
const lfo = LFO(context)
lfo.start(context.currentTime)
const delayLFO = LFO(context)
delayLFO.start(context.currentTime)

const gain = context.createGain()
const distortion = Distortion(context)
distortion.shaper.connect(gain)

const detune = Detune(context)
detune.gain.connect(gain)
keyboard.register(detune.start)

const delay = Delay(context)
delay.out.connect(distortion.shaper)
delayLFO.gain.connect(delay.delay.delayTime)

osc.gain.connect(filter.filter)
filter.filter.connect(delay.input)
lfo.gain.connect(filter.filter.frequency)
gain.connect(context.destination)

const clock = Clock(context)
const sequencer = Sequencer(context)

clock.register(sequencer.onTempoChange)
clock.quarterEvents.listen(sequencer.trigger)
sequencer.noteOn.listen(osc.start)

export default () => (
  <div className={style.container}>
    <Device name="Keyboard">
      <KeyboardDOM device={keyboard} />
    </Device>
    <Device name="DetuneSynth">
      <DetuneDOM device={detune} />
    </Device>
    <Device name="Clock">
      <ClockDOM device={clock} />
    </Device>
    <Device name="Sequencer">
      <SequencerDOM device={sequencer} />
    </Device>
    <Device name="Oscillator">
      <MultiOscDOM device={osc} />
    </Device>
    <Device name="LFO">
      <LFODOM device={lfo} max={500} />
    </Device>
    <Device name="LFO">
      <LFODOM device={delayLFO} max={1} />
    </Device>
    <Device name="Filter">
      <FilterDOM device={filter} />
    </Device>
    <Device name="Delay">
      <DelayDOM device={delay} />
    </Device>
    <Device name="Distortion">
      <DistortionDOM device={distortion} />
    </Device>
  </div>
)
