/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*global THREE requestAnimationFrame*/

	const binCount = 256
	const SpectrumAnalyzer = __webpack_require__(1)
	const analyzer = new SpectrumAnalyzer('https://raw.githubusercontent.com/rickycodes/tones/master/futurecop.mp3', binCount, 0.80)

	var camera, group, scene, renderer
	var mouseX = 0
	var mouseY = 0
	var windowHalfX = window.innerWidth / 2
	var windowHalfY = window.innerHeight / 2

	function animate () {
	  render()
	  requestAnimationFrame(animate)
	}

	function render () {
	  camera.position.x += (mouseX - camera.position.x) * 0.05
	  camera.position.y += (-mouseY - camera.position.y) * 0.05
	  camera.lookAt(scene.position)
	  var data = analyzer.getFrequencyData()
	  analyzer.updateSample()
	  group.children.forEach(function (child, i) {
	    if (data[i] !== 0) {
	      var zscale = data[i] * 0.08
	      child.scale.z = zscale
	    }
	  })
	  renderer.render(scene, camera)
	}

	function mouseMove (e) {
	  mouseX = (e.clientX - windowHalfX) * 10
	  mouseY = (e.clientY - windowHalfY) * 10
	}

	function setup () {
	  document.addEventListener('mousemove', mouseMove)
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

	  for (var i = 1; i < binCount; i++) {
	    var material = new THREE.MeshPhongMaterial({ color: i * 0x001EFF })
	    var object = new THREE.Mesh(geometry, material)

	    object.position.x = xPos
	    object.position.y = yPos

	    xPos += width + space

	    if ((i % Math.floor(Math.sqrt(binCount))) === 0) {
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


/***/ },
/* 1 */
/***/ function(module, exports) {
	// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
	const SpectrumAnalyzer = module.exports = function (track, binCount, smoothingTimeConstant) {
	  var audio = document.createElement('audio')
	  var Context = window['AudioContext'] || window['webkitAudioContext']

	  audio.crossOrigin = 'anonymous'
	  audio.src = track

	  audio.currentTime = 0
	  audio.play()

	  audio.addEventListener('ended', function (e) {
	    this.currentTime = 0
	    this.play()
	  })

	  this.context = new Context()
	  this.analyzerNode = this.context.createAnalyser()
	  this.audio = audio

	  this.setBinCount(binCount)
	  this.setSmoothingTimeConstant(smoothingTimeConstant)
	  this.setSource(audio)
	}

	SpectrumAnalyzer.prototype = {
	  setSource: function (source) {
	    this.source = this.context.createMediaElementSource(source)
	    this.source.connect(this.analyzerNode)
	    this.analyzerNode.connect(this.context.destination)
	  },

	  setBinCount: function (binCount) {
	    this.binCount = binCount
	    this.analyzerNode.fftSize = binCount * 2

	    this.frequencyByteData = new Uint8Array(binCount)  // frequency
	    this.timeByteData = new Uint8Array(binCount)   // waveform
	  },

	  setSmoothingTimeConstant: function (smoothingTimeConstant) {
	    this.analyzerNode.smoothingTimeConstant = smoothingTimeConstant
	  },

	  getFrequencyData: function () {
	    return this.frequencyByteData
	  },

	  getTimeData: function () {
	    return this.timeByteData
	  },

	  getAverage: function (index, count) {
	    var total = 0
	    var start = index || 0
	    var end = start + (count || this.binCount)

	    for (var i = start; i < end; i++) {
	      total += this.frequencyByteData[i]
	    }

	    return total / (end - start)
	  },

	  getAverageFloat: function (index, count) {
	    return this.getAverage(index, count) / 255
	  },

	  updateSample: function () {
	    this.analyzerNode.getByteFrequencyData(this.frequencyByteData)
	    this.analyzerNode.getByteTimeDomainData(this.timeByteData)
	  }
	}


/***/ }
/******/ ]);
