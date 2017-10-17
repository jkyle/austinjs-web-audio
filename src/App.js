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
// import Delay, { DelayDOM } from './Delay'

const context = new (window.AudioContext || window.webkitAudioContext)()
const keyboard = Keyboard(context)
const timeAnalyser = TimeAnalyser(context)
const freqAnalyser = FrequencyAnalyser(context)
const filter = Filter(context)
const osc = MultiOsc(context)
const lfo = LFO(context)
lfo.start(context.currentTime)
keyboard.register(osc.start)

const gain = context.createGain()
// const delay = Delay(context)
// delay.out.connect(gain)

osc.gain.connect(filter.filter)
// filter.filter.connect(delay.input)
<<<<<<< HEAD
filter.filter.connect(gain)
=======
>>>>>>> 2e064b014191a4cb34e2d0a9c6ebde726bf44af3
lfo.gain.connect(filter.filter.frequency)
gain.connect(context.destination)
gain.connect(timeAnalyser.analyser)
gain.connect(freqAnalyser.analyser)

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
    <Device name="Filter">
      <FilterDOM device={filter} />
    </Device>
    {/* <Device name="Delay">
      <DelayDOM device={delay} />
    </Device> */}
    <Device name="Time Analyser">
      <TimeAnalyserDOM device={timeAnalyser} />
    </Device>
    <Device name="Freq Analyser">
      <FrequencyAnalyserDOM device={freqAnalyser} />
    </Device>
  </div>
)
