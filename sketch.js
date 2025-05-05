// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleSize = 100;
let isDragging = false;
let prevX, prevY;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the draggable circle
  fill(255, 0, 0, 150);
  noStroke();
  circle(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the index finger tip (keypoint 8)
        let indexFinger = hand.keypoints[8];

        // Check if the index finger is touching the circle
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        if (d < circleSize / 2) {
          isDragging = true;
        }

        // If dragging, move the circle and draw a line
        if (isDragging) {
          if (prevX !== undefined && prevY !== undefined) {
            stroke(0, 0, 255); // Blue color for the line
            strokeWeight(2);
            line(prevX, prevY, indexFinger.x, indexFinger.y);
          }

          circleX = indexFinger.x;
          circleY = indexFinger.y;

          prevX = indexFinger.x;
          prevY = indexFinger.y;
        }

        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints 0 to 4
        strokeWeight(2);
        if (hand.handedness == "Left") {
          stroke(255, 0, 255); // Left hand color
        } else {
          stroke(255, 255, 0); // Right hand color
        }

        for (let i = 0; i < 4; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Draw lines connecting keypoints 5 to 8
        if (hand.handedness == "Left") {
          stroke(0, 255, 255); // Different color for left hand
        } else {
          stroke(0, 255, 0); // Different color for right hand
        }

        for (let i = 5; i < 8; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Draw lines connecting keypoints 9 to 12
        if (hand.handedness == "Left") {
          stroke(255, 128, 0); // Orange color for left hand
        } else {
          stroke(0, 128, 255); // Blue color for right hand
        }

        for (let i = 9; i < 12; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Draw lines connecting keypoints 13 to 16
        if (hand.handedness == "Left") {
          stroke(128, 0, 255); // Purple color for left hand
        } else {
          stroke(255, 255, 128); // Yellow color for right hand
        }

        for (let i = 13; i < 16; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Draw lines connecting keypoints 17 to 20
        if (hand.handedness == "Left") {
          stroke(255, 0, 0); // Red color for left hand
        } else {
          stroke(0, 255, 255); // Cyan color for right hand
        }

        for (let i = 17; i < 20; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }
      }
    }
  }

  // Reset dragging state when no hands are detected
  if (hands.length === 0) {
    isDragging = false;
    prevX = undefined;
    prevY = undefined;
  }
}
