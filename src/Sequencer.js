import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

import { freqFromRoot } from './music-math'

const Sequencer = () => {
  const events = eventBus()
  const noteOn = eventBus()

  const steps = [
    110,
    freqFromRoot(110, 12),
    freqFromRoot(110, 5),
    freqFromRoot(110, 7),
  ]
  let idx = 0

  const gate = {
    value: 0.2,
  }

  const tempo = {
    value: 1,
  }

  const onTempoChange = (newTempo) => {
    tempo.value = newTempo
  }

  const trigger = (time) => {
    noteOn
      .trigger(time, steps[idx])
      .map(osc => osc.stop(time + gate.value * (tempo.value / 60)))
    idx = (idx + 1) % steps.length
  }

  const onGateChange = (value) => {
    gate.value = value
    events.trigger(value)
  }

  return {
    register: events.listen,
    noteOn,
    trigger,
    gate,
    onGateChange,
    onTempoChange,
  }
}

const SequencerDOM = makeDevice(({ device }) => (
  <div>
    <Knob label="Gate"
      min={0.1}
      max={1}
      step={0.1}
      value={device.gate.value}
      onChange={device.onGateChange}
    />
  </div>
))

export default Sequencer
export { SequencerDOM }
