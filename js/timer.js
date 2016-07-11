var context, rotateValue;
var timerCanvas = document.getElementById('timerCanvas');
var timerNumber = document.getElementById('timerNumber');
var countTimes;

function swingPic() {
  if (zf.start === 1 || zf.start === 0) {
    return
  }
  var leftnum = document.getElementById("leftNumber");
  var rightnum = document.getElementById("rightNumber");
  countTimes++;
  if (countTimes > 99) {
    leftnum.style.backgroundPositionX = parseInt(countPosx[9]) + 'px';
    leftnum.style.backgroundPositionY = parseInt(countPosy[9]) + 'px';
    rightnum.style.backgroundPositionX = parseInt(countPosx[9]) + 'px';
    rightnum.style.backgroundPositionY = parseInt(countPosy[9]) + 'px';
    displayKO();
    return;
  } else {
    rotateValue = (rotateValue + 12) % 361;
    var targetPic = document.getElementById('swing');
    targetPic.style.webkitTransform = "rotate(" + rotateValue + "deg)";
    leftnum.style.backgroundPositionX = parseInt(countPosx[parseInt(countTimes / 10)]) + 'px';
    leftnum.style.backgroundPositionY = parseInt(countPosy[parseInt(countTimes / 10)]) + 'px';
    rightnum.style.backgroundPositionX = parseInt(countPosx[parseInt(countTimes % 10)]) + 'px';
    rightnum.style.backgroundPositionY = parseInt(countPosy[parseInt(countTimes % 10)]) + 'px';
  }
}

function countTime(process) {
  if (process == 15) {
    timerCanvasFunc(process);
    process--;
    countTime(process)
  } else if (process >= 0) {
    setTimeout(function () {
      if (process == 0) {
        timerCanvasFunc(0);
      } else {
        timerCanvasFunc(process);
        process--;
        countTime(process)
      }
    }, 1000);
  }
}

function timerCanvasFunc(process) {
  var circle = new Image();
  circle.src = 'imgs/circle.png';
  circle.onload = function () {
    context.drawImage(circle, 0, 0, 200, 200);
    context.beginPath();
    context.moveTo(100, 100);
    // context.arc(100,100,80,Math.PI*1.5, Math.PI*(1.5-2*process/15));
    if (process != 15 && process != 0) {
      context.arc(100, 100, 80, Math.PI * 1.5, Math.PI * (1.5 - 2 * process / 15));
    }
    context.closePath();
    context.fillStyle = "#6b6b6b";
    context.fill();
    context.beginPath();
    context.arc(100, 100, 64, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = '#2f2f2f';
    context.fill();
    timerNumber.style.backgroundPositionX = parseInt(numPosx[process]) + 'px';
    timerNumber.style.backgroundPositionY = parseInt(numPosy[process]) + 'px';
  }
}
var numPosx = ['-30px', '-30px', '-30px', '-30px', '-30px', '-120px', '-120px', '-120px', '-120px', '-120px', '-235px', '-235px', '-235px', '-235px', '-235px', '-367px'];
var numPosy = ['-50px', '-50px', '-265px', '-370px', '-475px', '-50px', '-155px', '-265px', '-370px', '-475px', '-50px', '-155px', '-265px', '-370px', '-475px', '-50px'];
var countPosx = ['-375px', '-375px', '-375px', '-375px', '-440px', '-440px', '-440px', '-440px', '-507px', '-500px', '-500px', '-500px'];
var countPosy = ['-160px', '-267px', '-375px', '-481px', '-160px', '-267px', '-374px', '-481px', '-54px', '-160px', '-265px', '-373px'];
/*
background-position
0:-30px -50px
1:-30px -155px
2:-30px -265px
3:-30px -370px
4:-30px -475px
5:-120px -50px
6:-120px -155px
7:-120px -265px
8:-120px -370px
9:-120px -475px
10:-235px -50px
11:-235px -155px
12:-235px -265px
13:-235px -370px
14:-235px -475px
15:-367px -50px
*/
/*
0：-375px -160px
1：-375px -267px
2：-375px -375px
3：-375px -481px
4：-440px -160px
5：-440px -267px
6：-440px -374px
7：-440px -481px
8：-507px -54px
9：-500px -160px
K：-500px -265px
o：-500px -373px
*/
