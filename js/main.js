//var myCanvas=document.getElementById("myCanvas");
//var cxt=myCanvas.getContext("2d");
var pillarHeight;
var leftFistPosition = 0;
var rightFistPosition = 0;

function getSize() {
  var pageWidth = document.documentElement.clientWidth || document.body.clientWidth;
  var pageHeight = document.documentElement.clientHeight || document.body.clientHeight;

  var DEFAULT_FACE_WIDTH = 250;
  var DEFAULT_FIST_WIDTH = 200;
  var DEFAULT_PILLAR_WIDTH = 244;
  var DEFAULT_PILLAR_HEIGHT = 480;

  var faceWidth;

  if (pageWidth > 1280) {
    faceWidth = DEFAULT_FACE_WIDTH;
    fistWidth = DEFAULT_FIST_WIDTH;
    cWidth = 1280;
  } else {
    faceWidth = pageWidth * DEFAULT_FACE_WIDTH / 1280;
    fistWidth = pageWidth * DEFAULT_FIST_WIDTH / 1280;
    cWidth = pageWidth;
  }
  cHeight = pageHeight;
  var faceLeft = pageWidth / 2 - faceWidth / 2;
  return {
    faceWidth: faceWidth,
    fistWidth: fistWidth,
    faceLeft: faceLeft,
    cWidth: cWidth,
    cHeight: cHeight,
    point: { x: faceLeft + faceWidth / 2, y: 50 + 0.34 * pillarHeight / 2, r: faceWidth / 2 * 0.9 },
    rect: { x: faceLeft + faceWidth / 2, y: 50 + 0.34 * pillarHeight, w: 0.34 * faceWidth, h: 0.4 * pillarHeight }
  }
}

/*function drawFace() {
  var oSize = getSize();
  var faceImg = new Image();
  faceImg.src = "src/face.png";

  faceImg.onload = function() {
    faceHeight = faceImg.height*oSize.faceWidth/faceImg.width;
    cxt.drawImage(faceImg,oSize.faceLeft,50,oSize.faceWidth,faceHeight);
    init();
  }
  
}*/

function drawFist() {
  var oSize = getSize();
  var fistImg = new Image();
  fistImg.src = "../imgs/fist.png";

  fistImg.onload = function () {
    var fistHeight = fistImg.height * oSize.fistWidth / fistImg.width;
    var fistLeft = oSize.faceLeft + oSize.faceWidth - 200;
    cxt.drawImage(fistImg, fistLeft, faceHeight - 100, oSize.fistWidth, fistHeight);
  }
}

function moveRightFist(x, y, cxt) {
  var oSize = getSize();
  var fistImg = new Image();
  fistImg.src = "../imgs/rightFist.png";

  var fistLeft, fistTop;

  //drawFace();
  fistImg.onload = function () {
      var fistHeight = fistImg.height * oSize.fistWidth / fistImg.width;
      cxt.drawImage(fistImg, x, y, oSize.fistWidth, fistHeight);
    }
    /*  var fistImg = document.getElementById("right-fist");
      if(rightFistPosition === 0) {
        fistImg.style.left = (parseInt(fistImg.style.left)-50)+"px";
        fistImg.style.top  = (parseInt(fistImg.style.top)-50)+"px";
        rightFistPosition = 1;
      } else {
        fistImg.style.left = (parseInt(fistImg.style.left)+50)+"px";
        fistImg.style.top  = (parseInt(fistImg.style.top)+50)+"px";
        rightFistPosition = 0;
      }*/
}

function moveLeftFist(x, y) {
  var fistImg = document.getElementById("left-fist");
  if (leftFistPosition === 0) {
    fistImg.style.left = (parseInt(fistImg.style.left) + 50) + "px";
    fistImg.style.top = (parseInt(fistImg.style.top) - 50) + "px";
    leftFistPosition = 1;
  } else {
    fistImg.style.left = (parseInt(fistImg.style.left) - 50) + "px";
    fistImg.style.top = (parseInt(fistImg.style.top) + 50) + "px";
    leftFistPosition = 0;
  }
}

function init() {
  var oSize = getSize();
  var pillar = document.getElementById("pillar");
  pillar.style["z-index"] = "0";
  pillarHeight = pillar.height * oSize.faceWidth / pillar.width;
  pillar.height = pillarHeight;
  pillar.width = oSize.faceWidth;
  pillar.style.left = oSize.faceLeft + "px";
  pillar.style.top = "50px";

  /*var rightFist = document.getElementById("right-fist");
  rightFist.style.left = (oSize.faceLeft + oSize.faceWidth - 80)+"px";
  rightFist.style.top = (pillarHeight*0.3- 50)+"px";

  var leftFist = document.getElementById("left-fist");
  
  leftFist.style.left = (oSize.faceLeft - leftFist.width)+"px";
  leftFist.style.top = (pillarHeight*0.3- 50)+"px";*/
}

var i = 0;

function rotatePillar(fistPosition, speed) {

  addRotate(i, speed);
  i = 20;
  setTimeout(function () {
    minusRotate(i, speed);
  }, 200);

}

function addRotate(i, speed) {
  var pillar = document.getElementById("pillar");
  var addTime = setTimeout(function () {
    if (i < 20) {
      i++;
      pillar.style.transform = "rotate(" + i * speed + "deg)";
      addRotate(i, speed);

    } else {
      clearTimeout(addTime);
    }

  }, 10);
}

function minusRotate(i, speed) {
  var pillar = document.getElementById("pillar");
  var minusTime = setTimeout(function () {
    if (i > 0) {
      i--;
      pillar.style.transform = "rotate(" + i * speed + "deg)";
      minusRotate(i, speed);

    } else {
      clearTimeout(minusTime);
    }

  }, 10);
}


init();
