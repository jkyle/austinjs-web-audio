import React from 'react'
import style from './style.styl'
import makeDevice from './Generic'
import Knob from './Knob'

/*
var source = context.createMediaElementSource(mediaElement);
var dist = context.createWaveShaper();
var gain = context.createGain();

source.connect(gain);
gain.connect(dist);
dist.connect(context.destination);

gain.gain.value = 1;
dist.curve = makeDistortionCurve(0);

var range = document.querySelector('#range');
range.addEventListener('input', function(){
  var value = parseInt(this.value) * 5;
  dist.curve = makeDistortionCurve(value);
});
*/

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

const Distortion = (context) => {
  const listeners = []
  const register = listener => listeners.push(listener)
  const shaper = context.createWaveShaper()

  const dist = {
    value: 0,
  }

  const onChangeDistortion = (value) => {
    dist.value = value
    shaper.curve = makeDistortionCurve(value * 5)
    listeners.forEach(listener => listener())
  }

  return {
    onChangeDistortion,
    register,
    dist,
    shaper,
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
  </div>
))

export default Distortion
export { DistortionDOM }
