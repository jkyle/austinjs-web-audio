import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'

const Sequencer = () => {
  const steps = [110, 220, 440, 880]
  let idx = 0

  const gate = {
    value: 0.2,
  }

  const listeners = []
  const register = listener => listeners.push(listener)

  const observers = []
  const addObserver = obs => observers.push(obs)

  const trigger = (time) => {
    observers
      .map(obs => obs.start(time, steps[idx]))
      .map(stop => stop(time + gate.value))
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
