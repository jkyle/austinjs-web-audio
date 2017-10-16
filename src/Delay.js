import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'

const Delay = (context, time = 0, feedbackAmout = 0) => {
  const listeners = []
  const register = listener => listeners.push(listener)

  const delay = context.createDelay()
  delay.delayTime.value = time

  const feedback = context.createGain()
  feedback.gain.value = feedbackAmout

  const out = context.createGain()
  out.gain.value = 0

  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(out)

  const onValueChange = (target, value) => {
    target.value = value
    listeners.forEach(listener => listener())
  }

  const onDelayTimeChange = (value) => {
    delay.delayTime.value = value
    listeners.forEach(listener => listener())
  }

  const onFeedbackChange = (value) => {
    feedback.gain.value = value
    listeners.forEach(listener => listener())
  }

  const onGainChange = (value) => {
    out.gain.value = value
    listeners.forEach(listener => listener())
  }

  return {
    register,
    delay,
    feedback,
    out,
    onDelayTimeChange,
    onFeedbackChange,
    onGainChange,
    onValueChange,
  }
}

const DelayDOM = makeDevice(({ device }) => (
  <div className={style.components}>
    <Knob label="mix"
      min={0}
      max={1}
      step={0.2}
      value={device.out.gain.value}
      onChange={value => device.onValueChange(device.out.gain, value)}
    />
    <Knob label="time"
      min={0}
      max={1}
      step={0.2}
      value={device.delay.delayTime.value}
      onChange={value => device.onValueChange(device.delay.delayTime, value)}
    />
    <Knob label="fdbk"
      min={0}
      max={0.9}
      step={0.2}
      value={device.feedback.gain.value}
      onChange={value => device.onValueChange(device.feedback.gain, value)}
    />
  </div>
))

export default Delay
export { DelayDOM }
