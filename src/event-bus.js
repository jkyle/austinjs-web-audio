export default () => {
  const listeners = []
  return {
    listen: (listener) => {
      listeners.push(listener)
    },
    trigger: (...args) => listeners.map(listener => listener(...args)),
    listeners,
  }
}
