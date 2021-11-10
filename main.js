const canvas = document.querySelector("#projectileCanvas"),
  ctx = canvas.getContext("2d"),
  lanuchButton = document.getElementsByClassName("lanuch")[0],
  tankCannonBase = document.getElementsByClassName("cannon-base")[0],
  maxWidth = document.getElementsByClassName("show-max")[0],
  maxHeight = maxWidth.children[0].children[0],
  maxValues = document.getElementsByClassName("max-values")[0],
  showHeightValue = maxValues.children[0],
  showDistanceValue = maxValues.children[1],
  showTimeValue = maxValues.children[2];

const setCanvasWidthAndHeight = () => {
  const { offsetWidth, offsetHeight } = document.querySelector(
    ".projectile-container",
  );
  canvas.width = offsetWidth;
  canvas.height = offsetHeight - 100;
};

setCanvasWidthAndHeight();

const values = {
  velocity: 70,
  angle: 50,
  gravity: 9.8,
};

// (( vy for Velocity-y )) and (( vx for Velocity-x ))

let vy, vx, projectileMotionDrawing;

const setVelocityYandX = () => {
  vy = values.velocity * Math.sin(values.angle * (Math.PI / 180));
  vx = values.velocity * Math.cos(values.angle * (Math.PI / 180));
};

const getFormValues = () => {
  const formData = new FormData(document.querySelector("form"));
  for (const pair of formData.entries()) {
    const [name, value] = pair;
    values[name] = parseFloat(value);
  }
  return (tankCannonBase.style.transform = `rotate(-${values.angle}deg)`);
};

/////////////////////////////// Drawing the Rocket /////////////////////////////////////

const startX = 60,
  radius = 6.5;

let startY = canvas.height - 7,
  x = startX,
  y = startY,
  prevY = y,
  prevX = x,
  frameCount = 0;

const updatePathPosition = () => {
  if (y > canvas.height - radius) {
    projectileMotionDrawing && clearInterval(projectileMotionDrawing);
    calcTimeHeightDistance();
    return (projectileMotionDrawing = false);
  }
  prevY = y;
  prevX = x;
  y =
    startY - (vy * frameCount - 0.5 * values.gravity * Math.pow(frameCount, 2));
  x = startX + vx * frameCount;
  frameCount += 0.05;
};

const rocketPath = () => {
  ctx.beginPath();
  ctx.clearRect(prevX - radius, prevY - radius, 20, 20);
  ctx.fillStyle = "rgba(224, 255, 0,1)";
  ctx.arc(prevX, prevY, radius, 0, Math.PI * 2, true);
  ctx.fill();
};

const rocket = () => {
  rocketPath();
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.fill();
};

//////////////////////////// Launch the Rocket ///////////////////////////////////

const lanuch = () => {
  getFormValues();
  setVelocityYandX();
  lanuchButton.disabled = true;
  projectileMotionDrawing = setInterval(() => draw(), 10);
};

const draw = () => {
  updatePathPosition();
  rocket();
};

/////////////////////////////// Calculate Time, Hight, Distance //////////////////////

const calcTimeHeightDistance = () => {
  const mT = (2 * vy) / values.gravity,
    mH = (vy * vy) / (2 * values.gravity),
    mD = (2 * vx * vy) / values.gravity;

  maxHeight.style.height = mH + "px";
  maxHeight.style.left = mD / 2 - 5 + "px";
  maxWidth.style.width = mD + "px";

  showHeightValue.innerText = `Height:  ${mH.toFixed(2)}m`;
  showDistanceValue.innerText = `Distance:  ${mD.toFixed(2)}m`;
  showTimeValue.innerText = `Time:  ${mT.toFixed(2)}s`;
};

///////////////////////////// Initilizing the Rocket /////////////////////////////

const init = () => {
  setVelocityYandX();
  draw();
};

const resetValues = () => {
  if (projectileMotionDrawing) {
    clearInterval(projectileMotionDrawing);
    projectileMotionDrawing = false;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startY = canvas.height - 7;
  x = startX;
  y = startY;
  prevY = startY;
  prevX = startX;
  frameCount = 0;
  lanuchButton.disabled = false;
  maxHeight.style.height = "0px";
  maxWidth.style.width = "0px";
  maxHeight.style.left = "0px";

  showHeightValue.innerText = `Height:  `;
  showDistanceValue.innerText = `Distance:  `;
  showTimeValue.innerText = `Time:  `;
  init();
};

window.addEventListener("resize", () => {
  setCanvasWidthAndHeight();
  resetValues();
});

init();
