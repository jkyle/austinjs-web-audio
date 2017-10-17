import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const Clock = (context, defaultTempo = 120) => {
  const events = eventBus()

  const quarterEvents = eventBus()

  const tempo = {
    value: defaultTempo,
  }

  const scheduleAheadTime = 0.1
  let currentNote = 0
  let nextNoteTime = 0.01
  let interval

  const scheduleNote = (time) => {
    // Trigger Quarter Notes
    if (currentNote % 4 === 0) {
      quarterEvents.trigger(time)
    }

    currentNote = currentNote === 63 ? 0 : currentNote + 1
    nextNoteTime += 60 / tempo.value / 4
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
    events.trigger(value)
  }

  return {
    register: events.listen,
    tempo,
    start,
    stop,
    onChangeTempo,
    quarterEvents,
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
