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

	'use strict'

	const binCount = 256
	const SpectrumAnalyzer = __webpack_require__(1)
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	/////////////////////////////////
	// Spectrum Analyser
	/////////////////////////////////
	'use strict'

	// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
	const SpectrumAnalyzer = module.exports = function (track, binCount, smoothingTimeConstant) {
	  var audio = document.createElement('audio')
	  var Context = window['AudioContext'] || window['webkitAudioContext']

	  audio.crossOrigin = 'anonymous'
	  audio.src = track

	  audio.currentTime = 0
	  audio.play()

	  audio.addEventListener('ended', function (e) {
	    // console.log('loop!')
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
	    //this.source = source
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
	  // not save if out of bounds
	  getAverage: function (index, count) {
	    var total = 0
	    var start = index || 0
	    var end = start + (count || this.binCount)

	    for (var i = start; i < end; i++) {
	      total += this.frequencyByteData[i]
	    }

	    return total / (end - start)
	  },
	  getAverageFloat:function (index, count) {
	    return this.getAverage(index, count) / 255
	  },

	  updateSample: function () {
	    this.analyzerNode.getByteFrequencyData(this.frequencyByteData)
	    this.analyzerNode.getByteTimeDomainData(this.timeByteData)
	  }
	}


/***/ }
/******/ ]);