import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const Oscillator = (context, type = 'sine') => {
  // This is for notifying React when values change.
  const events = eventBus()

  // This is the main output for this oscillator
  const gain = context.createGain()
  //
  const oscType = {
    value: type,
  }

  // Trigger oscillator start. Optionally pass in frequency.
  const start = (startTime, frequency = 440) => {
    const osc = context.createOscillator()
    const tmpGain = context.createGain()
    osc.connect(tmpGain)
    tmpGain.connect(gain)
    osc.frequency.value = frequency
    osc.type = oscType.value
    osc.start(startTime)
    tmpGain.gain.setValueAtTime(0.001, startTime)
    tmpGain.gain.exponentialRampToValueAtTime(0.8, startTime + 0.02)

    return {
      stop: (stopTime) => {
        tmpGain.gain.setValueAtTime(0.8, stopTime - 0.02)
        tmpGain.gain.exponentialRampToValueAtTime(0.001, stopTime)
        osc.stop(stopTime)
      },
    }
  }

  // This is how React will modify the gain value.
  const onChangeGain = (value) => {
    gain.gain.value = value
    events.trigger(value)
  }

  const onChangeType = (value) => {
    oscType.value = value
    events.trigger(value)
  }

  return {
    start,
    gain,
    onChangeType,
    onChangeGain,
    oscType,
    register: events.listen,
  }
}

const OscillatorDOM = makeDevice(({ device }) => (
  <div>
    <select className={style.select}
      value={device.oscType.value}
      onChange={(e) => {
        device.onChangeType(e.target.value)
      }}
    >
      <option value="sine">Sine</option>
      <option value="square">Square</option>
      <option value="sawtooth">Sawtooth</option>
      <option value="triangle">Triangle</option>
    </select>
    <Knob min={0}
      max={1}
      step={0.02}
      value={device.gain.gain.value}
      onChange={device.onChangeGain}
    />
  </div>
))

export default Oscillator
export { OscillatorDOM }
