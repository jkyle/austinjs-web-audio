import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const Mixer = (
  context,
  input1Level = 1,
  input2Level = 1,
  input3Level = 1,
  input4Level = 1,
) => {
  const events = eventBus()

  const master = context.createGain()
  master.gain.value = 0.25

  const input1 = context.createGain()
  input1.gain.value = input1Level
  input1.connect(master)

  const input2 = context.createGain()
  input2.gain.value = input2Level
  input2.connect(master)

  const input3 = context.createGain()
  input3.gain.value = input3Level
  input3.connect(master)

  const input4 = context.createGain()
  input4.gain.value = input4Level
  input4.connect(master)

  const onGainChange = (input, value) => {
    input.value = value
    events.trigger(value)
  }

  return {
    register: events.listen,
    master,
    input1,
    input2,
    input3,
    input4,
    onGainChange,
  }
}

const MixerDOM = makeDevice(({ device }) => (
  <div>
    <Knob label="MAIN"
      min={0}
      max={1}
      step={0.02}
      value={device.master.gain.value}
      onChange={value => device.onGainChange(device.master.gain, value)}
    />
    <div className={style.components}>
      <Knob label="1"
        min={0}
        max={1}
        step={0.02}
        value={device.input1.gain.value}
        onChange={value => device.onGainChange(device.input1.gain, value)}
      />
      <Knob label="2"
        min={0}
        max={1}
        step={0.02}
        value={device.input2.gain.value}
        onChange={value => device.onGainChange(device.input2.gain, value)}
      />
      <Knob label="3"
        min={0}
        max={1}
        step={0.02}
        value={device.input3.gain.value}
        onChange={value => device.onGainChange(device.input3.gain, value)}
      />
      <Knob label="4"
        min={0}
        max={1}
        step={0.02}
        value={device.input4.gain.value}
        onChange={value => device.onGainChange(device.input4.gain, value)}
      />
    </div>
  </div>
))

export default Mixer
export { MixerDOM }
