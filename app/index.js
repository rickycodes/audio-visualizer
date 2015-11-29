'use strict'

const binCount = 256
const SpectrumAnalyzer = require('spectrum-analyzer')
const analyzer = new SpectrumAnalyzer('https://raw.githubusercontent.com/rickycodes/tones/master/futurecop.mp3', binCount, 0.80)
const lines = []

function animate () {
  var data = analyzer.getFrequencyData()
  analyzer.updateSample()
  lines.forEach(function (line, i) {
    line.style.height = data[i] + 'px'
  })
  requestAnimationFrame(animate)
}

function setup () {
  var xPos = 0
  const width = 5
  const space = 0
  const target = document.getElementsByClassName('container')[0]
  for (var i = 0; i < binCount; i++) {
    var line = document.createElement('div')
    line.setAttribute('class','line line_' + i)
    line.style.left = xPos + 'px'
    line.style.width = width + 'px'
    lines.push(line)
    target.appendChild(line)
    xPos += width + space
  }
}

(function (){
  setup()
  animate()
})()
