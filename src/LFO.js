import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const LFO = (context) => {
  const events = eventBus()
  const gain = context.createGain()
  gain.gain.value = 0
  let osc
  const oscType = {
    value: 'sine',
  }
  const oscFrequency = {
    value: 0,
  }

  const onChangeType = (value) => {
    oscType.value = value
    if (osc) {
      osc.type = value
    }
    events.trigger(value)
  }

  const onChangeFrequency = (value) => {
    oscFrequency.value = value
    if (osc) {
      osc.frequency.value = value
    }
    events.trigger(value)
  }

  const onChangeGain = (value) => {
    gain.gain.value = value
    events.trigger(value)
  }

  const start = (startTime, frequency = 440) => {
    osc = context.createOscillator()
    osc.connect(gain)
    osc.frequency.value = frequency
    osc.type = oscType.value
    osc.start(startTime)

    return (stopTime) => {
      osc.stop(stopTime)
      osc = null
    }
  }

  return {
    start,
    gain,
    onChangeType,
    onChangeGain,
    onChangeFrequency,
    oscType,
    oscFrequency,
    register: events.listen,
  }
}

const LFODOM = makeDevice(({ device, min = 0, max = 1 }) => (
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
    <Knob label="rate"
      min={0}
      max={20}
      step={0.02}
      value={device.oscFrequency.value}
      onChange={device.onChangeFrequency}
    />
    <Knob label="depth"
      min={min}
      max={max}
      step={0.02}
      value={device.gain.gain.value}
      onChange={device.onChangeGain}
    />
  </div>
))

export default LFO
export { LFODOM }
