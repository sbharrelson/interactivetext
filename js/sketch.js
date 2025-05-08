


let scene = 1;
let dragging = false;
let dragY;
let darkSkyHeight = 0;
let pulseAngle = 0;
let bounceDuration = 1000;
let bounceStartTime;
let arrowBounceAngle = 0;
let fadeInLetItBe = 0;
let fadeInANight = 0;
let startTime;
let transitionComplete = false;
let fadeInLyric = 0;
let lyricFadeSpeeds = [];
let lyricAlphas = [];
let lyricTextSize = 45;
let lyricPhrase = "of lyric rain";
let rainStartTime;
let rainDropImage;
let fallingRain = null;
let rainSpeed = 2;
let imageScaleFactor = 0.25;
let arrowImage, arrow2Image;
let arrow2StartTime = null;
let arrow2Alpha = 0;
let dayImg, nightImg;

function preload() {
  dayImg = loadImage('img/day.jpg');
  nightImg = loadImage('img/night.jpg');
  rainDropImage = loadImage('img/rain.png');
  arrowImage = loadImage('img/arrow.png');
  arrow2Image = loadImage('img/arrow2.png');

}
function setup() {

  createCanvas(windowWidth, windowHeight);
  textFont('absans');
  textSize(65);
  textAlign(LEFT, TOP);
  dragY = height / 2 - 0;
  startTime = millis();
  bounceStartTime = -bounceDuration;

  // Initialize fade-in speeds and alphas for each instance of "of lyric rain"
  let phrase = lyricPhrase + "\u00A0\u00A0\u00A0\u00A0\u00A0";
  let spacingX = textWidth(phrase);
  let spacingY = 70;
  for (let y = 0; y < height; y += spacingY) {
    for (let x = 0; x < width; x += spacingX) {
      lyricFadeSpeeds.push(random(0.5, 1.5)); // Random fade-in speed
      lyricAlphas.push(0); // Start fully transparent
    }
  }

}
function draw() {
  if (scene === 1) {
    drawScene1();
  } else if (scene === 2) {
    drawScene2();
  }
}
function drawScene1() {
  image(dayImg, 0, 0, width, height / 2);
  let nightAspectRatio = nightImg.width / nightImg.height;
  let nightWidth, nightHeight, nightX, nightY;
  if (nightAspectRatio > width / (height / 2)) {
    nightHeight = height / 2 + darkSkyHeight;
    nightWidth = nightHeight * nightAspectRatio;
    nightX = (width - nightWidth) / 2;
    nightY = height / 2 - darkSkyHeight;
  } else {
    nightWidth = width;
    nightHeight = width / nightAspectRatio + darkSkyHeight;
    nightX = 0;
    nightY = height / 2 - darkSkyHeight;
  }
  image(nightImg, nightX, nightY, nightWidth, nightHeight);
  let elapsed = millis() - startTime;

  fadeInLetItBe = min(255, elapsed / 1000 * 255);

  if (elapsed > 1500) {

    fadeInANight = min(255, (elapsed - 1500) / 1000 * 255);

    if (fadeInANight === 255 && millis() < startTime + 1500 + bounceDuration && bounceStartTime < 0) {

      bounceStartTime = millis();

    }

  }
  if (!transitionComplete) {

    fill(30, 30, 30, fadeInLetItBe);

    textAlign(LEFT, TOP);

    text("Oh let it be", 40, 40);
    if (fadeInANight > 0) {
      let currentBounceTime = millis() - bounceStartTime;
      let textPulseOffset = 0;
      let arrowBounceOffset = 0;
      let arrowFadeIn = 0;
      let arrowFadeInDelay = 2000;

      if (currentBounceTime >= 0 && currentBounceTime < bounceDuration * 2) {
        pulseAngle += 0.1;
        arrowBounceAngle += 0.015;
        textPulseOffset = sin(pulseAngle * 2) * 3;
        arrowBounceOffset = sin(arrowBounceAngle * 0.8) * 2;
      }

      fill(255, 248, 235, fadeInANight);
      textAlign(CENTER, TOP);
      text("a night", width / 2, dragY + textPulseOffset + 20); // increase the value to move lower


      if (fadeInANight === 255 && !dragging && arrowImage && elapsed > startTime + 1500 + arrowFadeInDelay) {
        arrowFadeIn = min(255, (elapsed - (startTime + 2200 + arrowFadeInDelay)) / 3000 * 255);
        tint(255, 255, 255, arrowFadeIn);
        let arrowWidth = arrowImage.width * 0.07;
        let arrowHeight = arrowImage.height * 0.07;
        image(arrowImage, width / 2 - arrowWidth / 2, dragY - arrowHeight - 30 + arrowBounceOffset, arrowWidth, arrowHeight);
        noTint();
      }
    }
  } else {

    if (!rainStartTime) {

      setTimeout(() => {

        scene = 2;

        rainStartTime = millis();

      }, 1000);

      rainStartTime = -1;

    }

  }

}
function drawScene2() {

  let nightAspectRatio = nightImg.width / nightImg.height;

  let canvasAspectRatio = width / height;

  let nightWidth, nightHeight, nightX, nightY;
  if (nightAspectRatio > canvasAspectRatio) {

    nightHeight = height;

    nightWidth = nightHeight * nightAspectRatio;

    nightX = (width - nightWidth) / 2;

    nightY = 0;

  } else {

    nightWidth = width;

    nightHeight = width / nightAspectRatio;

    nightX = 0;

    nightY = (height - nightHeight) / 2;

  }
  image(nightImg, nightX, nightY, nightWidth, nightHeight);
  // Draw repeated "of lyric rain" grid as a background pattern

  textSize(lyricTextSize);

  textAlign(LEFT, TOP);
  // Use non-breaking spaces for wider spacing between each text

  let phrase = lyricPhrase + "\u00A0\u00A0\u00A0\u00A0\u00A0"; // 5 non-breaking spaces

  let spacingX = textWidth(phrase);

  let spacingY = 70; // slightly more vertical space
  let index = 0;
  for (let y = 0; y < height; y += spacingY) {

    for (let x = 0; x < width; x += spacingX) {
      lyricAlphas[index] = min(255, lyricAlphas[index] + lyricFadeSpeeds[index]);
      fill(255, 248, 235, lyricAlphas[index]);
      text(phrase, x, y);
      index++;
    }

  }
  // Rain drop logic (unchanged)

  if (fallingRain) {

    let scaledWidth = rainDropImage.width * imageScaleFactor;

    let scaledHeight = rainDropImage.height * imageScaleFactor;
    tint(255, fallingRain.alpha);
    image(rainDropImage, fallingRain.x, fallingRain.y, scaledWidth, scaledHeight);
    noTint();

    fallingRain.y += rainSpeed;
    fallingRain.alpha -= 2;

    if (fallingRain.alpha <= 0 || fallingRain.y > height) {
      fallingRain = null;
    }
  }
  // Arrow2 logic (unchanged)

  if (arrow2StartTime && millis() - arrow2StartTime >= 5000) {

    if (arrow2Alpha < 255) {

      arrow2Alpha += 2;

    }

    tint(255, arrow2Alpha);

    let arrowW = arrow2Image.width * 0.08;

    let arrowH = arrow2Image.height * 0.08;

    let x = width - arrowW - 20;

    let y = height - arrowH - 20;

    image(arrow2Image, x, y, arrowW, arrowH);

    noTint();

  }

}
function mousePressed() {

  if (scene === 2) {

    let scaledWidth = rainDropImage.width * imageScaleFactor;

    let scaledHeight = rainDropImage.height * imageScaleFactor;
    fallingRain = {
      x: mouseX - scaledWidth / 2,
      y: mouseY - scaledHeight / 2,
      alpha: 255
    };

    if (!arrow2StartTime) {
      arrow2StartTime = millis();
    }

    let arrowW = arrow2Image.width * 0.08;
    let arrowH = arrow2Image.height * 0.08;
    let x = width - arrowW - 20;
    let y = height - arrowH - 20;

    if (
      mouseX >= x && mouseX <= x + arrowW &&
      mouseY >= y && mouseY <= y + arrowH &&
      arrow2Alpha > 200
    ) {
      window.location.href = "page.2.html";
    }
  } else if (scene === 1 && fadeInANight === 255) {

    if (mouseY > height / 2) {

      dragging = true;

      dragYOffset = mouseY - dragY;

    } else {

      let textWidthMeasure = textWidth("a night");

      if (

        mouseX > width / 2 - textWidthMeasure / 2 &&

        mouseX < width / 2 + textWidthMeasure / 2 &&

        mouseY > dragY - 32 &&

        mouseY < dragY + 32

      ) {

        dragging = true;

        dragYOffset = mouseY - dragY;

      }

    }

  }

}
function mouseDragged() {

  if (dragging && !transitionComplete) {

    dragY = constrain(mouseY - dragYOffset, 0, height / 2 - 40);

    darkSkyHeight = map(dragY, height / 2 - 40, 0, 0, height / 2);

  }

}
function mouseReleased() {

  dragging = false;

  if (dragY <= 0 && !transitionComplete) {

    transitionComplete = true;

  }

}
function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}