/*global THREE requestAnimationFrame*/
'use strict'

const binCount = 256
const SpectrumAnalyzer = require('spectrum-analyzer')
const analyzer = new SpectrumAnalyzer('https://raw.githubusercontent.com/rickycodes/tones/master/futurecop.mp3', binCount, 0.80)

var camera, group, scene, renderer

function animate () {
  render()
  requestAnimationFrame(animate)
}

function render () {
  var data = analyzer.getFrequencyData()
  analyzer.updateSample()
  camera.lookAt(scene)
  group.children.forEach(function (child, i) {
    if (data[i] !== 0) {
      child.scale.z = data[i] * 0.08
    }
  })
  renderer.render(scene, camera)
}

function setup () {
  var xPos = 0
  var yPos = 0
  const width = 100
  const space = width + 40

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
  group = new THREE.Object3D()
  scene = new THREE.Scene()

  camera.position.z = 5000

  var light = new THREE.HemisphereLight(0xffffff, 1)
  group.add(light)

  var geometry = new THREE.BoxGeometry(width, width, width)

  var color = 0x001EFF

  console.log(color)

  for (var i = 1; i < binCount; i++) {
    var material = new THREE.MeshPhongMaterial({ color: i * color })
    var object = new THREE.Mesh(geometry, material)

    object.position.x = xPos
    object.position.y = yPos

    xPos += width + space

    if ((i % Math.sqrt(binCount)) === 0) {
      xPos = 0
      yPos -= width + space
    }

    group.add(object)
  }

  group.position.set(-2000, 1600, 0)
  group.rotation.x = -0.80

  scene.add(group)

  renderer = new THREE.WebGLRenderer({alpha: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.sortObjects = false

  document.body.appendChild(renderer.domElement)
}

(function () {
  setup()
  animate()
})()
