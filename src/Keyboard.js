import React, { Component } from 'react'
import style from './style.styl'
import eventBus from './event-bus'

import { freqFromRoot } from './music-math'

const topRow = 'qwertyuiop'
  .split('')
  .reduce((acc, letter, idx) => ({ ...acc, [letter]: idx }), {})
const middleRow = 'asdfghjkl'
  .split('')
  .reduce((acc, letter, idx) => ({ ...acc, [letter]: idx - 12 }), {})
const bottomRow = 'zxcvbnm'
  .split('')
  .reduce((acc, letter, idx) => ({ ...acc, [letter]: idx - 24 }), {})

const keyToFreq = { ...topRow, ...middleRow, ...bottomRow }

const Keyboard = (context) => {
  const events = eventBus()
  const activeNotes = {}

  const triggerNoteStart = (note) => {
    if (!(note in activeNotes)) {
      // const freq = 440
      const freq = note in keyToFreq ? freqFromRoot(440, keyToFreq[note]) : 0
      activeNotes[note] = events.trigger(context.currentTime, freq)
    }
  }

  const triggerNoteStop = (note) => {
    if (note in activeNotes) {
      activeNotes[note].forEach(activeNote =>
        activeNote.stop(context.currentTime), )
      delete activeNotes[note]
    }
  }

  return {
    register: events.listen,
    keyDown: note => triggerNoteStart(note),
    keyUp: note => triggerNoteStop(note),
  }
}

class KeyboardDOM extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKeys: {},
    }
  }

  componentDidMount() {
    document.addEventListener('keypress', e => this.startNote(e))
    document.addEventListener('keyup', e => this.stopNote(e))
  }

  startNote = (e) => {
    if (!this.state.activeKeys[e.key] && e.key) {
      this.setState(prevState => ({
        activeKeys: { ...prevState.activeKeys, [e.key]: true },
      }))
      this.props.device.keyDown(e.key)
    }
  }

  stopNote = (e) => {
    if (e.key && e.key in this.state.activeKeys) {
      this.setState((prevState) => {
        const activeKeys = { ...prevState.activeKeys }
        delete activeKeys[e.key]
        return { activeKeys }
      })
      this.props.device.keyUp(e.key)
    }
  }

  render() {
    return (
      <div className={style.value}>
        {Object.keys(this.state.activeKeys).map(k => <span key={k}>{k}</span>)}
      </div>
    )
  }
}

export default Keyboard
export { KeyboardDOM }
