import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const ADSR = (env = {
  a: 0.02,
  d: 0,
  s: 1,
  r: 0.02,
}, ) => {
  const events = eventBus()
  const onEnvChange = (param, value) => {
    env[param] = value
    events.trigger(value)
  }

  return {
    register: events.listen,
    onEnvChange,
    env,
    addParam: (param, scale = 0.8, initialOffset = 0) => {
      const offset = {
        value: initialOffset,
      }
      const onChangeOffset = (value) => {
        offset.value = value
      }

      const start = (startTime) => {
        param.setValueAtTime(offset.value + 0.002, startTime)
        param.exponentialRampToValueAtTime(
          offset.value + scale,
          startTime + env.a,
        )
        param.exponentialRampToValueAtTime(
          offset.value + scale * env.s,
          startTime + env.a + env.d,
        )

        return {
          stop: stopTime =>
            param.exponentialRampToValueAtTime(
              offset.value + 0.002,
              stopTime + env.r,
            ),
        }
      }

      return {
        start,
        onChangeOffset,
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
