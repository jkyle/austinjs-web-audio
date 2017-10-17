import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const Delay = (context, time = 0, feedbackAmout = 0) => {
  const events = eventBus()

  const delay = context.createDelay()
  delay.delayTime.value = time

  const feedback = context.createGain()
  feedback.gain.value = feedbackAmout

  const dry = context.createGain()
  const input = context.createGain()
  const wet = context.createGain()
  const out = context.createGain()

  dry.gain.value = 1
  wet.gain.value = 0

  dry.connect(out)
  wet.connect(out)

  delay.connect(feedback)
  feedback.connect(delay)

  delay.connect(wet)
  input.connect(dry)
  input.connect(delay)

  const onValueChange = (target, value) => {
    target.value = value
    events.trigger(value)
  }

  const onDelayTimeChange = (value) => {
    delay.delayTime.value = value
    events.trigger(value)
  }

  const onFeedbackChange = (value) => {
    feedback.gain.value = value
    events.trigger(value)
  }

  const onGainChange = (value) => {
    dry.gain.value = 1 - value
    wet.gain.value = value
    events.trigger(value)
  }

  return {
    register: events.listen,
    delay,
    feedback,
    out,
    wet,
    input,
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
      step={0.02}
      value={device.wet.gain.value}
      onChange={value => device.onGainChange(value)}
    />
    <Knob label="time"
      min={0}
      max={1}
      step={0.02}
      value={device.delay.delayTime.value}
      onChange={value => device.onValueChange(device.delay.delayTime, value)}
    />
    <Knob label="fdbk"
      min={0}
      max={0.9}
      step={0.02}
      value={device.feedback.gain.value}
      onChange={value => device.onValueChange(device.feedback.gain, value)}
    />
  </div>
))

export default Delay
export { DelayDOM }
