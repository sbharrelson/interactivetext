let dayImage, nightImage;


let scene = 1;

let dragging = false;
let dragY;
let bgColor;
let darkSkyHeight = 0;
let pulseAngle = 0;

let fadeInLetItBe = 0;
let fadeInANight = 0;
let startTime;
let transitionComplete = false;

let fadeInLyric = 0;
let rainStartTime;
let rainWords = [];

function preload() {
  dayImage = loadImage('day.jpg');     // adjust path if needed
  nightImage = loadImage('night.jpg'); // adjust path if needed
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('absans');
  textSize(65);
  textAlign(LEFT, TOP);
  dragY = height - 80;
  startTime = millis();
}

function draw() {
  background(bgColor);

  let lightCream = color(255, 248, 235);
  let darkText = color(30, 30, 30);

  if (scene === 1) {
    image(dayImage, 0, 0, width, height);
    drawScene1();
  } else if (scene === 2) {
    image(nightImage, 0, 0, width, height);
    drawScene2();
  }
}

function drawScene1(lightCream, darkText) {
  if (!transitionComplete) {
    darkSkyHeight = map(dragY, height - 80, 0, 0, height);
    fill(10, 20, 50);
    rect(0, height - darkSkyHeight, width, darkSkyHeight);
  } else {
    bgColor = color(10, 20, 50);
    background(bgColor);
  }

  let elapsed = millis() - startTime;
  if (fadeInLetItBe < 255) {
    fadeInLetItBe = min(255, elapsed / 1000 * 255);
  }
  if (elapsed > 1500 && fadeInANight < 255) {
    fadeInANight = min(255, (elapsed - 1500) / 1000 * 255);
  }

  if (transitionComplete) {
    fill(lightCream);
    textAlign(CENTER, TOP);

    setTimeout(() => {
      if (scene === 1) {
        scene = 2;
        rainStartTime = millis();
      }
    }, 1000);
  } else {
    fill(red(darkText), green(darkText), blue(darkText), fadeInLetItBe);
    textAlign(LEFT, TOP);
    text("Oh let it be", 40, 40);

    if (fadeInANight > 0) {
      pulseAngle += 0.05;
      let pulseOffset = sin(pulseAngle) * 10;
      fill(red(darkText), green(darkText), blue(darkText), fadeInANight);
      textAlign(CENTER, TOP);
      text("a night", width / 2, dragY + pulseOffset);
    }
  }
}

function drawScene2(lightCream, darkText) {
  background(10, 20, 50);

  textAlign(CENTER, TOP);
  textSize();
  
  text("of lyric rain", width / 2, 40);
  drawingContext.shadowBlur = 0;


  if (millis() - rainStartTime < 3000) {
    if (frameCount % 2 === 0) {
      rainWords.push({
        x: random(width),
        y: 80,
        speed: random(2, 5),
        size: random(16, 28),
        alpha: 255
      });
    }
  }

  for (let i = rainWords.length - 1; i >= 0; i--) {
    let r = rainWords[i];
    r.y += r.speed;
    r.alpha -= 2;

    if (r.alpha <= 0) {
      rainWords.splice(i, 1);
      continue;
    }

    fill(255, 248, 235, r.alpha);
    textSize(r.size);
    text("rain", r.x, r.y);
  }

  textSize(45);
}

function mousePressed() {
  if (scene !== 1 || fadeInANight < 255) return;

  let textWidthMeasure = textWidth("a night");
  if (
    mouseX > width / 2 - textWidthMeasure / 2 &&
    mouseX < width / 2 + textWidthMeasure / 2 &&
    mouseY > dragY &&
    mouseY < dragY + 32
  ) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging && !transitionComplete) {
    dragY = constrain(mouseY, 0, height - 80);
  }
}

function mouseReleased() {
  dragging = false;
  if (dragY <= 80 && !transitionComplete) {
    transitionComplete = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}