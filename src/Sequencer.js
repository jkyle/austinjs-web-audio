import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'

import { freqFromRoot } from './music-math'

const Sequencer = () => {
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

  const registerTempo = (newTempo) => {
    tempo.value = newTempo
  }

  const listeners = []
  const register = listener => listeners.push(listener)

  const observers = []
  const addObserver = obs => observers.push(obs)

  const trigger = (time) => {
    observers
      .map(obs => obs.start(time, steps[idx]))
      .map(stop => stop(time + gate.value * (tempo.value / 60)))
    idx = (idx + 1) % steps.length
  }

  const onGateChange = (value) => {
    gate.value = value
    listeners.forEach(listener => listener(value))
  }

  return {
    register,
    addObserver,
    trigger,
    gate,
    onGateChange,
    registerTempo,
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
