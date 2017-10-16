export default () => {
  const listeners = []
  return {
    listen: (listener) => {
      listeners.push(listener)
    },
    trigger: value => listeners.forEach(listener => listener(value)),
  }
}
