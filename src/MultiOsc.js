import React from 'react'
import style from './style.styl'
import Oscillator from './Oscillator'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'
import ADSR, { ADSRDOM } from './ADSR'

const MultiOsc = (
  context,
  square = 1,
  sawtooth = 1,
  triangle = 1,
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

  const adsr = ADSR(env)

  const osc1 = Oscillator(context, 'square', adsr)
  osc1.gain.gain.value = square
  const osc2 = Oscillator(context, 'sawtooth', adsr)
  osc2.gain.gain.value = sawtooth
  const osc3 = Oscillator(context, 'triangle', adsr)
  osc3.gain.gain.value = triangle

  osc1.gain.connect(gain)
  osc2.gain.connect(gain)
  osc3.gain.connect(gain)

  const onChangeGain = (value) => {
    gain.gain.value = value
    events.trigger(value)
  }

  const onChangeOscGain = (targetOsc, value) => {
    targetOsc.gain.gain.value = value
    events.trigger(value)
  }

  const start = (startTime, frequency = 440) => {
    const oscs = [
      osc1.start(startTime, frequency),
      osc2.start(startTime, frequency),
      osc3.start(startTime, frequency),
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
    onChangeOscGain,
    osc1,
    osc2,
    osc3,
    adsr,
  }
}

const MultiOscDOM = makeDevice(({ device }) => (
  <div>
    <div className={style.components}>
      <Knob label="MAIN"
        min={0}
        max={1}
        step={0.02}
        value={device.gain.gain.value}
        onChange={device.onChangeGain}
      />
    </div>
    <div className={style.components}>
      <Knob label="sqr"
        min={0}
        max={1}
        step={0.02}
        value={device.osc1.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc1, value)}
      />
      <Knob label="saw"
        min={0}
        max={1}
        step={0.02}
        value={device.osc2.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc2, value)}
      />
      <Knob label="tri"
        min={0}
        max={1}
        step={0.02}
        value={device.osc3.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc3, value)}
      />
    </div>
    <ADSRDOM device={device.adsr} />
  </div>
))

export default MultiOsc
export { MultiOscDOM }
