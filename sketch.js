/*
Mimi Yin NYU-ITP
Drawing skeleton joints and bones.
 */

// Declare kinectron
let kinectron = null;
let bodies = {};

// Variables for circle
let a = 0;

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
  let sortedBodies = [];
  for(var body in bodies) {
    var joints = bodies[body].joints;
    body.zPos = joints[kinectron.SPINEMID].cameraZ;
    let handLeft = joints[kinectron.HANDLEFT];
    let handRight = joints[kinectron.HANDRIGHT];
    // Note: don't scale distance to the frame - we want to base our control code on actual distance.
    body.handsDistance = dist(handLeft.cameraX, handLeft.cameraY, handRight.cameraX, handRight.cameraY);
    sortedBodies.append(body);
  }
  sortedBodies.sort((a, b) => (a.zPos - b.zPos)); // ascending order by zPos

  let playbackSpeedBody = sortedBodies[0];
  let volumeBody = sortedBodies[1];
  // Any other bodies ignored

  let playbackSpeed = scalePlaybackSpeed(playbackSpeedBody.handsDistance);
  let volume = scaleVolume(volumeBody.handsDistance);

  // console.log(``)

  textSize(32);
  text(`front Z: ${playbackSpeedBody.zPos}`, 5, 5);
  text(`back Z: ${volumeBody.zPos}`, 5, 55);
  text(`playback speed: ${playback}`, 5, 105);
  text(`volume: ${volume}`, 5, 155);

function scalePlaybackSpeed(distance) {
  return distance; // TODO
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