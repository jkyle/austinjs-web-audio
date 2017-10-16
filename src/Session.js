import React, { Component } from 'react'
import MultiOsc, { MultiOscDOM } from './MultiOsc'
import Keyboard, { KeyboardDOM } from './Keyboard'
import LFO, { LFODOM } from './LFO'
import Delay, { DelayDOM } from './Delay'
import Clock, { ClockDOM } from './Clock'
import Sequencer, { SequencerDOM } from './Sequencer'
import Filter, { FilterDOM } from './Filter'
import Distortion, { DistortionDOM } from './Distortion'
import Analyser, { AnalyserDOM } from './Analyser'
import Device from './Device'

const context = new (window.AudioContext || window.webkitAudioContext)()
const keyboard = Keyboard(context)
const clock = Clock(context)
const sequencer = Sequencer(context)
const filter = Filter(context)
const distortion = Distortion(context)
const osc = MultiOsc(context)
const analyser = Analyser(context)

clock.addObserver(sequencer)
sequencer.addObserver(osc)

keyboard.register(osc)
const lfo = LFO(context)
lfo.gain.connect(osc.mainGain.gain)
lfo.start(context.currentTime, 2)
const delay = Delay(context)

delay.out.connect(context.destination)
osc.mainGain.connect(filter.filter)
filter.filter.connect(delay.delay)
filter.filter.connect(distortion.shaper)
distortion.shaper.connect(context.destination)
osc.mainGain.connect(analyser.analyser)

export default class Song extends Component {
  play = () => {
    const stop = osc.start(context.currentTime)
    stop(context.currentTime + 5)
  }

  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Device name="Keyboard">
          <KeyboardDOM device={keyboard} />
        </Device>

        <Device name="Clock">
          <ClockDOM device={clock} />
        </Device>

        <Device name="Sequencer">
          <SequencerDOM device={sequencer} />
        </Device>

        <Device name="Multi-Oscillator">
          <MultiOscDOM device={osc} />
        </Device>

        <Device name="LFO">
          <LFODOM device={lfo} />
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

        <Device name="Analyser">
          <AnalyserDOM device={analyser} />
        </Device>
      </div>
    )
  }
}
