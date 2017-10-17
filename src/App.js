import React from 'react'
import style from './style.styl'
import Device from './Device'
import MultiOsc, { MultiOscDOM } from './Multiosc'
import Keyboard, { KeyboardDOM } from './Keyboard'
import Filter, { FilterDOM } from './Filter'
import LFO, { LFODOM } from './LFO'
import Clock, { ClockDOM } from './Clock'
import Sequencer, { SequencerDOM } from './Sequencer'
import Delay, { DelayDOM } from './Delay'
import Distortion, { DistortionDOM } from './Distortion'
import Detune, { DetuneDOM } from './Detune'
import Mixer, { MixerDOM } from './Mixer'

const context = new (window.AudioContext || window.webkitAudioContext)()
const filter = Filter(context, 'lowpass', 400)
const osc = MultiOsc(context, 0, 0, 1)
const mixer = Mixer(context, 0, 1)
const lfo = LFO(context, 0.2, 300)
lfo.start(context.currentTime)

mixer.master.connect(context.destination)
const distortion = Distortion(context)
distortion.out.connect(mixer.input2)

const detune = Detune(context)
detune.gain.connect(mixer.input1)

const delay = Delay(context, 0.2, 0.8, 0.5)
delay.out.connect(distortion.input)

osc.gain.connect(filter.filter)
filter.filter.connect(delay.input)
lfo.gain.connect(filter.filter.frequency)

const clock = Clock(context)
const sequencer1 = Sequencer(context)
const sequencer2 = Sequencer(context, 440, [
  0,
  7,
  0,
  7,
  0,
  5,
  0,
  5,
  9,
  5,
  9,
  5,
  4,
  7,
  5,
  -2,
])

clock.register(sequencer1.onTempoChange)
clock.register(sequencer2.onTempoChange)
clock.sixteenthEvents.listen(sequencer1.trigger)
clock.eighthEvents.listen(sequencer2.trigger)
sequencer1.noteOn.listen(osc.start)
sequencer2.noteOn.listen(detune.start)

export default () => (
  <div className={style.container}>
    <div className={style.row}>
      <Device name="Clock">
        <ClockDOM device={clock} />
      </Device>
      <Device name="Mixer">
        <MixerDOM device={mixer} />
      </Device>
    </div>
    <div className={style.row}>
      <Device name="Sequencer1">
        <SequencerDOM device={sequencer1} />
      </Device>
      <Device name="Oscillator">
        <MultiOscDOM device={osc} />
      </Device>
      <Device name="LFO">
        <LFODOM device={lfo} max={500} />
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
    <div className={style.row}>
      <Device name="Sequencer2">
        <SequencerDOM device={sequencer2} />
      </Device>
      <Device name="DetuneSynth">
        <DetuneDOM device={detune} />
      </Device>
    </div>
  </div>
)
