import React, { Component } from 'react'
import style from './style.styl'

export default class Knob extends Component {
  componentDidMount() {
    this.md = this.knob.addEventListener('mousedown', e =>
      this.startDrag(e.clientY), )
    this.mm = document.addEventListener(
      'mousemove',
      e => this.dragStart && this.dragMove(e.clientY),
    )
    this.mu = document.addEventListener(
      'mouseup',
      () => this.dragStart && this.stopDrag(),
    )
  }

  startDrag(location) {
    this.dragStart = location
    this.initialValue = this.input.value
  }

  dragMove(location) {
    const offset = location - this.dragStart
    const newVal =
      this.initialValue - offset / (300 / (this.props.max - this.props.min))
    const clampedValue = Math.ceil(newVal / this.props.step) * this.props.step
    this.props.onChange(clampedValue > this.props.max
      ? this.props.max
      : clampedValue < this.props.min ? this.props.min : clampedValue, )
  }

  stopDrag() {
    this.dragStart = false
  }

  render() {
    const {
      min, max, value, step, onChange, label
    } = this.props
    return (
      <div className={style.knobWrapper}>
        <h4 className={style.value}>{step >= 1 ? value : value.toFixed(2)}</h4>
        <div className={style.visuallyHidden}>
          <input ref={(input) => {
              this.input = input
            }}
            id={label}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        </div>
        <div ref={(knob) => {
            this.knob = knob
          }}
          className={style.knob}
          style={{
            transform: `rotateZ(${(value - min) / (max - min) * 270 - 135}deg)`,
          }}
        />
        <label htmlFor={label} className={style.label}>
          {label}
        </label>
      </div>
    )
  }
}
