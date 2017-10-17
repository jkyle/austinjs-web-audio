import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const Clock = (context, defaultTempo = 120) => {
  const events = eventBus()

  const wholeEvents = eventBus()
  const halfEvents = eventBus()
  const quarterEvents = eventBus()
  const eighthEvents = eventBus()
  const sixteenthEvents = eventBus()

  const tempo = {
    value: defaultTempo,
  }

  const scheduleAheadTime = 0.2
  let currentNote = 0
  let nextNoteTime = 0.01
  let interval

  const scheduleNote = (time) => {
    // Trigger Sixteenth Notes
    sixteenthEvents.trigger(time, 0.25)

    // Trigger Eight Notes
    if (currentNote % 2 === 0) {
      eighthEvents.trigger(time, 0.5)
    }

    // Trigger Quarter Notes
    if (currentNote % 4 === 0) {
      quarterEvents.trigger(time, 1)
    }

    if (currentNote % 8 === 0) {
      halfEvents.trigger(time, 2)
    }

    if (currentNote % 16 === 0) {
      wholeEvents.trigger(time, 4)
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
    wholeEvents,
    halfEvents,
    quarterEvents,
    eighthEvents,
    sixteenthEvents,
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
