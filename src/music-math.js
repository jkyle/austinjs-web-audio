const a = 2 ** (1 / 12)

export const timeFromTick = (bpm, division) => bpm / 60 / division
export const freqFromRoot = (base, semiTone) => base * a ** semiTone
export const sample = arr => arr[Math.floor(Math.random() * arr.length)]
export const times = num => [...Array(num).keys()]
export const range = (min, max) => Math.random() * (max - min) + min
