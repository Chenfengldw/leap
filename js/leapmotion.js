var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var oSize = getSize();
console.log(oSize);
canvas.width = oSize.cWidth;
canvas.height = oSize.cHeight;
var mostIn = -100;
var mostOut = 100;
var normalFistSize = 100;
var rightFist = new Image();
var leftFist = new Image();
var leftId = 0;
var rightId = 1;
var lastHandId = 0;
var bitted = 0;


rightFist.src = "imgs/rightFist.png";
leftFist.src = "imgs/leftFist.png";

function leapMotion() {

  var controller = new Leap.Controller();
  controller.connect();
  controller.on('deviceConnected', onDeviceConnected);
  controller.on('deviceDisconnected', onDeviceDisconnect);

  console.log("hello");
  var frameArr = new Array();
  var graspCheckLength = 20;
  var graspThresh = 25;
  var lastGesture = -1; //-1 null, 0 grasp,1 circle,2 key,3 screen ,4 swipe,after 1 sec it will be reset to -1
  var timer = 0;



  Leap.loop({ frameEventName: "animationFrame" }, function (frame) {

    if (timer < 30) timer++;
    else {
      lastGesture = -1;
      timer = 0;
    }

  });

  Leap.loop({ frameEventName: "animationFrame" }, function (frame) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // frame.pointables.forEach(function(pointable) {

    //      var position = pointable.stabilizedTipPosition;
    //      var normalized = frame.interactionBox.normalizePoint(position);
    //      var x = ctx.canvas.width * normalized[0];
    //      var y = ctx.canvas.height * (1 - normalized[1]);
    //      ctx.beginPath();
    //      ctx.rect(x, y, 20, 20);
    //      ctx.fill();
    //      });

    frame.hands.forEach(function (hand) {
      //basic info of hand
      if (zf.start === 0) {
        zf.showTimer();
        zf.start = 1;
      }

      var position = hand.palmPosition;
      var deep = position[2]
      if (deep < mostIn) deep = mostIn;
      if (deep > mostOut) deep = mostOut;
      var normalized = frame.interactionBox.normalizePoint(position);
      console.log(normalized[1]);
      var x = ctx.canvas.width * normalized[0];
      var y = ctx.canvas.height * (1 - normalized[1]);

      // recognize left or right

      if (hand.id > lastHandId) {
        if (getSide(hand) == 1) leftId = hand.id;
        else rightId = hand.id;

      }

      //draw image of fists

      ctx.beginPath();
      var fistSize = getFistSize(deep, mostIn, mostOut, normalFistSize);
      if (hand.id == rightId) {
        ctx.drawImage(rightFist, x, y, fistSize, fistSize);
      } else ctx.drawImage(leftFist, x, y, fistSize, fistSize);


      var point = getSize().point;
      var rect = getSize().rect;
      var detect = null;
      if (hand.id == rightId) detect = getDetectPointR(x, y, fistSize, fistSize);
      else detect = getDetectPointL(x, y, fistSize, fistSize);



      // detect collision


      if (
        bitted === 0 &&
        (((detect.x - point.x) * (detect.x - point.x) + (detect.y - point.y) * (detect.y - point.y) <= point.r * point.r) ||
          ((detect.x > rect.x - rect.w / 2) && (detect.x < rect.x + rect.w / 2) && (detect.y > rect.y) && (detect.y < rect.y + rect.h)))
      ) {
        var speed = Math.sqrt((hand.palmVelocity[0] * hand.palmVelocity[0]) + (hand.palmVelocity[2] * hand.palmVelocity[2]));
        if (hand.id == leftId) {
          if (hand.palmVelocity[0] > 0) {
            console.log("left beat! v=");
            rotatePillar(0, speed * (normalized[1] + 0.5) * 4 / 3000);
            zf.swingPic();
            bitted = 1;
          }
        } else {
          if (hand.palmVelocity[0] < 0) {
            console.log("right beat!");
            rotatePillar(1, -speed * (normalized[1] + 0.5) * 4 / 3000);
            zf.swingPic();
            bitted = 1;
          }
        }
      } else if (
        ((detect.x - point.x) * (detect.x - point.x) + (detect.y - point.y) * (detect.y - point.y) > point.r * point.r) &&
        ((detect.x < rect.x - rect.w / 2) || (detect.x > rect.x + rect.w / 2) || (detect.y < rect.y) || (detect.y > rect.y + rect.h))
      ) {
        bitted = 0;
      }

      if (hand.id > lastHandId) lastHandId = hand.id;
    });
  });



  Leap.loop({ frameEventName: "animationFrame" }, function (frame) {


    if (frameArr.length < 20) frameArr.push(frame);
    else {
      frameArr.push(frame);
      frameArr.shift();

      var prevP = 0;
      var afterP = 0;
      var prevH = 0;
      var afterH = 0;

      for (var i = 0; i < graspCheckLength / 2; ++i) prevP += frameArr[i].pointables.length;
      for (var i = graspCheckLength / 2; i < graspCheckLength; ++i) afterP += frameArr[i].pointables.length;
      for (var i = 0; i < graspCheckLength / 2; ++i) prevH += frameArr[i].hands.length;
      for (var i = graspCheckLength / 2; i < graspCheckLength; ++i) afterH += frameArr[i].hands.length;


      if (prevP - afterP > graspThresh && prevH == afterH && lastGesture != 0) { //get a new grasp

        var graspX = 0;
        var graspY = 0;
        for (var i = 0; i < graspCheckLength; ++i) {
          graspX += getPosition(frameArr[i])[0];
          graspY += getPosition(frameArr[i])[1];
        }
        graspX /= graspCheckLength;
        graspY /= graspCheckLength;

        //Here output to explorer the info of a grasp.
        lastGesture = 0;
        console.log("Grasp Gesture at" + graspX + "," + graspY);
      }
    }

  });


  Leap.loop({ enableGestures: true }, function (frame) {

    if (frame.valid && frame.gestures.length > 0 && frame.pointables.length > 0) {

      frame.gestures.forEach(function (gesture, pointable) {
        switch (gesture.type) {
          case "circle":
            if (lastGesture != 1) { //Here output to explorer the info of a circle
              lastGesture = 1;
              console.log("Circle Gesture at" + getPosition(frame)[0] + "," + getPosition(frame)[1]);
            }
            break;
          case "keyTap":
            if (lastGesture != 2 && frame.pointables.length == 1) { //Here output to explorer the info of a key tap
              lastGesture = 2;
              console.log("Key Tap Gesture at" + getPosition(frame)[0] + "," + getPosition(frame)[1]);
            }
            break;
          case "screenTap":
            if (lastGesture != 3 && frame.pointables.length == 1) { //Here output to explorer the info of a screen tap
              lastGesture = 3;
              console.log("Screen Tap Gesture at" + getPosition(frame)[0] + "," + getPosition(frame)[1]);
            }
            break;
          case "swipe":
            if (lastGesture != 4) { //Here output to explorer the info of a swipe
              lastGesture = 4;
              console.log("Swipe Gesture at" + getPosition(frame)[0] + "," + getPosition(frame)[1]);
            }
            break;
        }
      });

    }


  });

}


function onDeviceConnected() {
  zf.start = 1;
  zf.hideWarning();
}

function onDeviceDisconnect() {
  zf.start = 0;
  zf.showWarning();
}


function getPosition(f) {
  var position = new Array();
  var gestureX = 0;
  var gestureY = 0;
  var counter = 0;

  f.pointables.forEach(function (pointable) {
    var position = pointable.stabilizedTipPosition;
    var normalized = f.interactionBox.normalizePoint(position);
    var x = ctx.canvas.width * normalized[0];
    var y = ctx.canvas.height * (1 - normalized[1]);
    gestureX += x;
    gestureY += y;
    counter++;
  });

  if (counter != 0) {
    gestureX /= counter;
    gestureY /= counter;
  } else {
    gestureX = null;
    gestureY = null;
  }
  position.push(gestureX);
  position.push(gestureY);

  return position;
}


function getFistSize(deep, mostIn, mostOut, normalFistSize) {
  return ((deep - mostIn) * 2 / (mostOut - mostIn) + 1) * normalFistSize;
}

function getSide(hand) {
  if (hand.direction[0] < 0 && hand.direction[2] < 0) return 0 //0 means right hand
  else return 1; //1 means left hand
}

function getDetectPointR(x, y, w, h) {
  return { x: x + w * 45.0 / 256 - 20, y: y + h * 70.0 / 240 };
}

function getDetectPointL(x, y, w, h) {
  return { x: x + w + 20, y: y + h * 70.0 / 240 };
}


window.onload = function () {
  getSize();
  //myCanvas.width = cWidth;
  //myCanvas.height = cHeight;
  //drawFace();
  //drawFist();
  //init();
  leapMotion();
  //setInterval(moveLeftFist,300);
  //setInterval(rotatePillar,300);
  if (zf.timerCanvas.getContext) {
    zf.context = zf.timerCanvas.getContext("2d");
  }
  var circle = new Image();
  circle.src = 'imgs/circle.png';
  circle.onload = function () {
    zf.context.drawImage(circle, 0, 0, 200, 200);
  }

  document.getElementById("swing").onclick = zf.swingPic;
}
