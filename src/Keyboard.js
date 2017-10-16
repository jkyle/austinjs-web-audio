import React, { Component } from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'

const Keyboard = (context) => {
  const listeners = []
  const activeNotes = {}
  const triggerNoteStart = (note) => {
    if (!(note in activeNotes)) {
      activeNotes[note] = listeners.map(listener =>
        listener.start(context.currentTime, 440), )
    }
  }

  const triggerNoteStop = (note) => {
    if (note in activeNotes) {
      activeNotes[note].forEach(stop => stop(context.currentTime))
      delete activeNotes[note]
    }
  }

  return {
    register: listener => listeners.push(listener),
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
