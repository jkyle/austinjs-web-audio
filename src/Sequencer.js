import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

import { freqFromRoot, sample } from './music-math'

const Sequencer = (
  context,
  initialRoot = 110,
  initialSequence = [0, 12, 5, 19, 7, 24, 0, 5],
  initialGate = 1,
) => {
  const events = eventBus()
  const noteOn = eventBus()

  const root = {
    value: initialRoot,
  }

  const sequence = {
    value: initialSequence,
  }

  const makeSteps = (rootFreq, seq) =>
    seq.map(step => freqFromRoot(rootFreq, step))
  let steps = makeSteps(root.value, sequence.value)

  let idx = 0

  const gate = {
    value: initialGate,
  }

  const tempo = {
    value: 120,
  }

  const onTempoChange = (newTempo) => {
    tempo.value = newTempo
  }

  const trigger = (time, division) => {
    noteOn
      .trigger(time, steps[idx] * sample([0.5, 1, 2]))
      .map(osc => osc.stop(time + gate.value * division / (tempo.value / 60)))

    if (idx + 1 === steps.length) {
      steps = makeSteps(root.value, sequence.value)
    }

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
