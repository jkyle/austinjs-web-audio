import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'

const Oscillator = (context, type = 'sine') => {
  const listeners = []
  const gain = context.createGain()
  const oscType = {
    value: type,
  }

  const onChangeType = (value) => {
    oscType.value = value
    listeners.forEach(listener => listener())
  }

  const onChangeGain = (value) => {
    gain.gain.value = value
    listeners.forEach(listener => listener())
  }

  const register = listener => listeners.push(listener)

  const start = (startTime, frequency = 440) => {
    const osc = context.createOscillator()
    osc.connect(gain)
    osc.frequency.value = frequency
    osc.type = oscType.value
    osc.start(startTime)

    return (stopTime) => {
      osc.stop(stopTime)
    }
  }

  return {
    start,
    gain,
    onChangeType,
    onChangeGain,
    oscType,
    register,
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
    <Knob min={0} max={1} step={0.02} value={device.gain.gain.value} onChange={device.onChangeGain} />
  </div>
))

export default Oscillator
export { OscillatorDOM }
