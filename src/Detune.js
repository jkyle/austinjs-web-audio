import React from 'react'
import style from './style.styl'
import Oscillator from './Oscillator'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'
import ADSR, { ADSRDOM } from './ADSR'

const Detune = (
  context,
  initDetune = 1.5,
  env = {
    a: 0.02,
    d: 0,
    s: 1,
    r: 0.02,
  },
) => {
  const events = eventBus()
  const gain = context.createGain()

  gain.gain.value = 0.3

  const detune = {
    value: initDetune,
  }

  const adsr = ADSR(env)

  const osc1 = Oscillator(context, 'sawtooth', adsr)
  const osc2 = Oscillator(context, 'sawtooth', adsr)
  const osc3 = Oscillator(context, 'sawtooth', adsr)

  osc1.gain.connect(gain)
  osc2.gain.connect(gain)
  osc3.gain.connect(gain)

  const onChangeGain = (value) => {
    gain.gain.value = value
    events.trigger(value)
  }

  const onChangeDetune = (value) => {
    detune.value = value
    events.trigger(value)
  }

  const start = (startTime, frequency = 440) => {
    const oscs = [
      osc1.start(startTime, frequency),
      osc2.start(startTime, frequency, detune.value * 5),
      osc3.start(startTime, frequency, detune.value * 10),
    ]
    return {
      stop: stopTime => oscs.forEach(osc => osc.stop(stopTime)),
    }
  }

  return {
    start,
    gain,
    register: events.listen,
    onChangeGain,
    onChangeDetune,
    detune,
    adsr,
  }
}

const DetuneDOM = makeDevice(({ device }) => (
  <div>
    <div className={style.components}>
      <Knob label="MAIN"
        min={0}
        max={0.3}
        step={0.02}
        value={device.gain.gain.value}
        onChange={device.onChangeGain}
      />
      <Knob label="detune"
        min={0}
        max={10}
        step={0.02}
        value={device.detune.value}
        onChange={device.onChangeDetune}
      />
    </div>
    <ADSRDOM device={device.adsr} />
  </div>
))

export default Detune
export { DetuneDOM }
