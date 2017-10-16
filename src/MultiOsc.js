import React from 'react'
import style from './style.styl'
import Oscillator from './Oscillator'
import makeDevice from './Generic'
import Knob from './Knob'
import ADSR, { ADSRDOM } from './ADSR'

const MultiOsc = (context) => {
  const listeners = []
  const register = listener => listeners.push(listener)
  const mainGain = context.createGain()
  mainGain.gain.value = 0.5
  const adsr = ADSR(
    {
      a: 0.02,
      d: 0,
      s: 1,
      r: 0.5,
    },
    0.5,
  )

  const osc1 = Oscillator(context, 'square', adsr)
  const osc2 = Oscillator(context, 'sawtooth', adsr)
  const osc3 = Oscillator(context, 'triangle', adsr)
  const metalizer = Oscillator(context, 'triangle', adsr)

  osc1.gain.connect(mainGain)
  osc2.gain.connect(mainGain)
  osc3.gain.connect(mainGain)
  metalizer.gain.connect(osc3.gain)
  metalizer.gain.gain.value = 0

  const onChangeGain = (value) => {
    mainGain.gain.value = value
    listeners.forEach(listener => listener())
  }

  const onChangeOscGain = (targetOsc, value) => {
    targetOsc.gain.gain.value = value
    listeners.forEach(listener => listener())
  }

  const onChangeMetalize = (value) => {
    metalizer.gain.gain.value = value
    listeners.forEach(listener => listener())
  }

  const start = (startTime, frequency = 440) => {
    const oscs = [
      osc1.start(startTime, frequency),
      osc2.start(startTime, frequency),
      osc3.start(startTime, frequency),
      metalizer.start(startTime, frequency * 4),
    ]
    return stopTime => oscs.forEach(stop => stop(stopTime))
  }

  return {
    start,
    mainGain,
    register,
    onChangeGain,
    onChangeOscGain,
    osc1,
    osc2,
    osc3,
    metalizer,
    adsr,
  }
}

const MultiOscDOM = makeDevice(({ device }) => (
  <div>
    <div className={style.components}>
      <Knob label="MAIN"
        min={0}
        max={1}
        step={0.2}
        value={device.mainGain.gain.value}
        onChange={device.onChangeGain}
      />
      <Knob label="MTLZ"
        min={0}
        max={1}
        step={0.2}
        value={device.metalizer.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.metalizer, value)}
      />
    </div>
    <div className={style.components}>
      <Knob label="sqr"
        min={0}
        max={1}
        step={0.2}
        value={device.osc1.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc1, value)}
      />
      <Knob label="saw"
        min={0}
        max={1}
        step={0.2}
        value={device.osc2.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc2, value)}
      />
      <Knob label="tri"
        min={0}
        max={1}
        step={0.2}
        value={device.osc3.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc3, value)}
      />
    </div>
    <ADSRDOM device={device.adsr} />
  </div>
))

export default MultiOsc
export { MultiOscDOM }
