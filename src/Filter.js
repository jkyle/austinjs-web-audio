import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'
import eventBus from './event-bus'

const Filter = (context, type = 'highpass') => {
  const events = eventBus()
  const filter = context.createBiquadFilter()
  filter.type = type

  const onChangeType = (value) => {
    filter.type = value
    events.trigger(value)
  }

  const onChangeFrequency = (value) => {
    filter.frequency.value = value
    events.trigger(value)
  }

  const onChangeQ = (value) => {
    filter.Q.value = value
    events.trigger(value)
  }

  return {
    onChangeType,
    onChangeFrequency,
    onChangeQ,
    register: events.listen,
    filter,
  }
}

const FilterDOM = makeDevice(({ device }) => (
  <div>
    <select className={style.select}
      value={device.filter.type}
      onChange={(e) => {
        device.onChangeType(e.target.value)
      }}
    >
      <option value="highpass">HP</option>
      <option value="bandpass">BP</option>
      <option value="lowpass">LP</option>
    </select>
    <Knob min={20}
      max={4200}
      step={1}
      value={device.filter.frequency.value}
      onChange={device.onChangeFrequency}
      label="FRQ"
    />
    <Knob min={0}
      max={24}
      step={0.02}
      value={device.filter.Q.value}
      onChange={device.onChangeQ}
      label="RES"
    />
  </div>
))

export default Filter
export { FilterDOM }
