/*
Mimi Yin NYU-ITP
Drawing skeleton joints and bones.
 */

// Declare kinectron
let kinectron = null;
let bodies = {};

// Set up ToneJS
var playing = false;
let player;

function play() {
  player.start();
  playing = true;
}

function stop() {
  player.stop();
  playing = false;
}

new Tone.Buffer('music.mp3', buffer => {
  console.log('mp3 Buffer loaded.');
  player = new Tone.BufferSource(buffer, () => {
    console.log('BufferSource loaded.');
    let playButton = document.getElementById('playbutton');
    playButton.innerHTML = 'Play';
    playButton.addEventListener('click', () => {
      Tone.start();
      if (!playing) {
        play();
        document.getElementById('playbutton').innerHTML = 'Stop';
      } else {
        stop();
        document.getElementById('playbutton').innerHTML = 'Play';
      }
    })
  });
});

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Define and create an instance of kinectron
  kinectron = new Kinectron("10.17.201.104");

  // Connect with application over peer
  kinectron.makeConnection();

  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);

  background(0);
}

function draw() {
  background(255);

  let sortedBodies = [];
  for(var body in bodies) {
    var joints = bodies[body].joints;
    bodies[body].zPos = joints[kinectron.SPINEMID].cameraZ;
    let handLeft = joints[kinectron.HANDLEFT];
    let handRight = joints[kinectron.HANDRIGHT];
    // Note: don't scale distance to the frame - we want to base our control code on actual distance.
    bodies[body].handsDistance = dist(handLeft.cameraX, handLeft.cameraY, handRight.cameraX, handRight.cameraY);
    if (bodies[body].handsDistance)
      sortedBodies.push(bodies[body]);
  }
  sortedBodies.sort((a, b) => (a.zPos - b.zPos)); // ascending order by zPos

  let playbackSpeedBody = sortedBodies[0];
  let volumeBody = sortedBodies[1];
  // Any other bodies ignored

  let playbackSpeed = playbackSpeedBody ? scalePlaybackSpeed(playbackSpeedBody.handsDistance) : null;
  let volume = volumeBody ? scaleVolume(volumeBody.handsDistance) : null;

  textSize(32);
  text(`front Z: ${playbackSpeedBody ? playbackSpeedBody.zPos : null}`, 5, 5);
  text(`back Z: ${volumeBody ? volumeBody.zPos : null}`, 5, 55);
  text(`playback speed: ${playbackSpeed}`, 5, 105);
  text(`volume: ${volume}`, 5, 155);
}

function scalePlaybackSpeed(distance) {
  return map(distance, 0, 1.5, 1.5, 0.5);
}

function scaleVolume(distance) {
  return distance; // TODO
}

function bodyTracked(body) {
  bodies[body.trackingId] = {
    joints: body.joints,
  }
}

// Scale the joint position data to fit the screen
// 1. Move it to the center of the screen
// 2. Flip the y-value upside down
// 3. Return it as an object literal
function scaleJoint(joint) {
  return {
    x: (joint.cameraX * width / 2) + width / 2,
    y: (-joint.cameraY * width / 2) + height / 2,
    z: joint.cameraZ
  }
}

// Draw skeleton
function drawJoint(joint) {

  //console.log("JOINT OBJECT", joint);
  let pos = scaleJoint(joint);

  //Kinect location data needs to be normalized to canvas size
  stroke(255);
  strokeWeight(5);
  point(pos.x, pos.y);
}
