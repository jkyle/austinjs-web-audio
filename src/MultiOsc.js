import React from 'react'
import style from './style.styl'
import Oscillator from './Oscillator'
import makeDevice from './Generic'
import Knob from './Knob'

const MultiOsc = (context) => {
  const listeners = []
  const mainGain = context.createGain()
  const register = listener => listeners.push(listener)

  const osc1 = Oscillator(context, 'square')
  const osc2 = Oscillator(context, 'sawtooth')
  const osc3 = Oscillator(context, 'triangle')

  osc1.gain.connect(mainGain)
  osc2.gain.connect(mainGain)
  osc3.gain.connect(mainGain)

  const onChangeGain = (value) => {
    mainGain.gain.value = value
    listeners.forEach(listener => listener())
  }

  const onChangeOscGain = (targetOsc, value) => {
    targetOsc.gain.gain.value = value
    listeners.forEach(listener => listener())
  }

  const start = (startTime, frequency = 440) => {
    const oscs = [
      osc1.start(startTime, frequency),
      osc2.start(startTime, frequency),
      osc3.start(startTime, frequency),
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
  }
}

const MultiOscDOM = makeDevice(({ device }) => (
  <div>
    <Knob label="MAIN"
      min={0}
      max={1}
      step={0.2}
      value={device.mainGain.gain.value}
      onChange={device.onChangeGain}
    />
    <div className={style.components}>
      <Knob label="square"
        min={0}
        max={1}
        step={0.2}
        value={device.osc1.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc1, value)}
      />
      <Knob label="sawtooth"
        min={0}
        max={1}
        step={0.2}
        value={device.osc2.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc2, value)}
      />
      <Knob label="triangle"
        min={0}
        max={1}
        step={0.2}
        value={device.osc3.gain.gain.value}
        onChange={value => device.onChangeOscGain(device.osc3, value)}
      />
    </div>
  </div>
))

export default MultiOsc
export { MultiOscDOM }
