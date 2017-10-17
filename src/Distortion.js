import React from 'react'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

// http://stackoverflow.com/a/22313408/1090298
function makeDistortionCurve(amount) {
  const k = typeof amount === 'number' ? amount : 0
  const samples = 44100
  const curve = new Float32Array(samples)
  const deg = Math.PI / 180
  let i = 0
  let x
  for (; i < samples; i += 1) {
    x = i * 2 / samples - 1
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))
  }
  return curve
}

const Distortion = (context, amount = 0, mix = 0) => {
  const events = eventBus()
  const shaper = context.createWaveShaper()

  const dry = context.createGain()
  const input = context.createGain()
  const wet = context.createGain()
  const out = context.createGain()

  dry.gain.value = 1 - mix
  wet.gain.value = mix

  dry.connect(out)
  wet.connect(out)

  shaper.connect(wet)
  input.connect(dry)
  input.connect(shaper)

  const dist = {
    value: amount,
  }

  const onChangeDistortion = (value) => {
    dist.value = value
    shaper.curve = makeDistortionCurve(value)
    events.trigger(value)
  }

  const onGainChange = (value) => {
    dry.gain.value = 1 - value
    wet.gain.value = value
    events.trigger(value)
  }

  return {
    onChangeDistortion,
    register: events.listen,
    dist,
    shaper,
    input,
    out,
    wet,
    onGainChange,
  }
}

const DistortionDOM = makeDevice(({ device }) => (
  <div>
    <Knob min={0}
      max={100}
      step={1}
      value={device.dist.value}
      onChange={device.onChangeDistortion}
      label="DIST"
    />
    <Knob label="mix"
      min={0}
      max={1}
      step={0.02}
      value={device.wet.gain.value}
      onChange={value => device.onGainChange(value)}
    />
  </div>
))

export default Distortion
export { DistortionDOM }
