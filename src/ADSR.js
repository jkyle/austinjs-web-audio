import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'

const ADSR = (
  env = {
    a: 0.02,
    d: 0,
    s: 1,
    r: 0.02,
  },
  scale = 0.8,
) => {
  const listeners = []
  const register = listener => listeners.push(listener)
  const onEnvChange = (param, value) => {
    env[param] = value
    listeners.forEach(listener => listener(value))
  }

  return {
    register,
    onEnvChange,
    env,
    addParam: (param) => {
      const start = (startTime) => {
        param.setValueAtTime(0.002, startTime)
        param.exponentialRampToValueAtTime(scale, startTime + env.a)
        param.exponentialRampToValueAtTime(
          scale * env.s,
          startTime + env.a + env.d,
        )

        return stopTime =>
          param.exponentialRampToValueAtTime(0.002, stopTime + env.r)
      }
      return {
        start,
      }
    },
  }
}

const ADSRDOM = makeDevice(({ device }) => (
  <div className={style.components}>
    <Knob min={0}
      max={1}
      step={0.02}
      value={device.env.a}
      onChange={value => device.onEnvChange('a', value)}
      label="ATK"
    />
    <Knob min={0}
      max={1}
      step={0.02}
      value={device.env.d}
      onChange={value => device.onEnvChange('d', value)}
      label="DCY"
    />
    <Knob min={0.002}
      max={1}
      step={0.02}
      value={device.env.s}
      onChange={value => device.onEnvChange('s', value)}
      label="SUS"
    />
    <Knob min={0}
      max={1}
      step={0.02}
      value={device.env.r}
      onChange={value => device.onEnvChange('r', value)}
      label="REL"
    />
  </div>
))

export default ADSR
export { ADSRDOM }
