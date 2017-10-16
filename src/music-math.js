const a = 2 ** (1 / 12)

export const timeFromTick = (bpm, division) => bpm / 60 / division
export const freqFromRoot = (base, semiTone) => base * a ** semiTone
