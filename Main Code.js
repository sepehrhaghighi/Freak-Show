window.onload = function() {
  var widthnor, heightnor;
  var delaygain = 0.5;

  this.addEventListener("mousemove", function(e) {
    var x = e.clientX;
    var y = e.clientY;
    // console.log(x, y);
    var width = window.innerWidth;
    var height = window.innerHeight;
    // console.log(width);
    widthnor = x / width; // 0-1 range
    heightnor = y / height; // 0-1 range
    var scale = heightnor / widthnor;
    // console.log(widthnor);
    // console.log(x, y);
    var a = document.getElementById("image");
    a.setAttribute("width", scale * 300);
    a.setAttribute("height", scale * 300);
    // }
    audioDelay();
  });

  function play() {
    var audio2 = document.getElementById("scream");
    audio2.play();
  }

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context, player;
  var splitter, merger;
  var leftDelay, rightDelay, delayAmount;
  var leftFeedback, rightFeedback;
  context = new AudioContext();

  merger = context.createChannelMerger(2);
  splitter = context.createChannelSplitter(2);

  // create a sound input node from an audio sample
  player = context.createBufferSource();
  player.loop = true;

  // create a delay effect node
  leftDelay = context.createDelay();
  rightDelay = context.createDelay();

  // create a gain effect node
  leftFeedback = context.createGain();
  rightFeedback = context.createGain();

  // play the sound
  document.querySelector("#button1").addEventListener("click", function() {
    loadSound("laugh.mp3");
  });
  function audioDelay() {
    // connect the different nodes
    player.connect(splitter);
    player.connect(context.destination);

    splitter.connect(leftDelay, 0);
    leftDelay.delayTime.value = widthnor;

    leftDelay.connect(leftFeedback);
    leftFeedback.gain.value = delaygain;
    leftFeedback.connect(rightDelay);

    splitter.connect(rightDelay, 1);
    rightDelay.delayTime.value = heightnor;

    rightDelay.connect(rightFeedback);
    rightFeedback.gain.value = delaygain;
    rightFeedback.connect(leftDelay);

    leftFeedback.connect(merger, 0, 0);
    rightFeedback.connect(merger, 0, 1);

    merger.connect(context.destination);
  }

  document.querySelector("#button2").addEventListener("click", function() {
    player.stop();
  });

  function loadSound(soundfile) {
if (player.buffer) {
var bufferSource = context.createBufferSource();
bufferSource.buffer = player.buffer;
bufferSource.loop = true;
player = bufferSource;
player.connect(context.destination);

player.start();
} else {

    var request = new XMLHttpRequest();
    request.open("GET", soundfile, true);
    request.responseType = "arraybuffer";

    // Decode asynchronously
    request.onload = function() {
      context.decodeAudioData(
        request.response,
        function(buffer) {
          player.buffer = buffer;
          player.start();
        },
        onError
      );
    };
    request.send();
  }
  }

  function onError() {
    console.log("The file could not be loaded");
  }

  // play the sound
  document.getElementById("image").addEventListener("click", function() {
    play();
  });

  var slider = document.getElementById("delaylevel");
  var gain = document.getElementById("gain");
  gain.value = slider.value;

  slider.oninput = function() {
    gain.value = this.value;
    delaygain = this.value;
  };
};
