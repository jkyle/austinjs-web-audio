import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'

const Clock = (context, defaultTempo = 120) => {
  const listeners = []
  const register = listener => listeners.push(listener)

  const observers = []
  const addObserver = obs => observers.push(obs)

  const tempo = {
    value: defaultTempo,
  }

  const scheduleAheadTime = 0.1
  let currentNote = 0
  let nextNoteTime = 0.01
  let interval

  const scheduleNote = (time) => {
    currentNote = currentNote === 63 ? 0 : currentNote + 1
    nextNoteTime += 60 / tempo.value / 2

    // tmp sequencer
    observers.map(obs => obs.trigger(time))
  }

  const start = () => {
    currentNote = 0
    nextNoteTime = context.currentTime + 0.01

    interval = setInterval(() => {
      while (nextNoteTime < context.currentTime + scheduleAheadTime) {
        scheduleNote(nextNoteTime)
      }
    }, 25)
  }

  const stop = () => {
    if (interval) {
      clearInterval(interval)
    }
  }

  const onChangeTempo = (value) => {
    tempo.value = value
    listeners.forEach(listener => listener(value))
  }

  return {
    register,
    tempo,
    start,
    stop,
    onChangeTempo,
    addObserver,
  }
}

const ClockDOM = makeDevice(({ device }) => (
  <div>
    <Knob label="Tempo"
      min={60}
      max={120}
      step={1}
      value={device.tempo.value}
      onChange={device.onChangeTempo}
    />
    <button onClick={device.start}>Start</button>
    <button onClick={device.stop}>Stop</button>
  </div>
))

export default Clock
export { ClockDOM }
