import { RobinMiller } from "./robinMiller.js";

let p = 5103;
let x = 0;
let y = null;
let pointsP = [];
const a = 1;
const b = 0;

const RobinMillerAlg = new RobinMiller();

function sumMod(a, x, n) {
  let p = 1;
  let i = x;

  while (i > 0) {
    const s = i % 2;

    if (s === 1) {
      p = (p * a) % n;
    }

    a = (a * a) % n;
    i = Math.floor((i - s) / 2);
  }

  return p < 0 ? p + n : p;
}

function ellepticheskaiaKrivaia(x) {
  return Math.pow(x, 3) + x;
}

function checkX(x, p) {
  const func = ellepticheskaiaKrivaia(x);
  const temp = RobinMillerAlg.sumMod(func, 1, p);
  const tempSum = p + temp;
  if (Number.isInteger(Math.sqrt(tempSum))) {
    y = Math.sqrt(tempSum);
    return true;
  }
  return false;
}

function decomposingTwo(num) {
  if (num === 0) {
    return [0];
  }

  let answer = [];
  let power = 0;

  while (num > 0) {
    if (num % 2 === 1) {
      answer.push(power);
    }
    num = Math.floor(num / 2);
    power++;
  }

  return answer;
}

function sumPoints(P, Q, p) {
  if (P[0] === Q[0] && P[1] === Q[1]) {
    const temp = sumMod(2 * P[1], p - 2, p);
    const k = sumMod((3 * Math.pow(P[0], 2) + a) * temp, 1, p);

    const x = sumMod(Math.pow(k, 2) - 2 * P[0], 1, p);
    const y = sumMod(k * (P[0] - x) - P[1], 1, p);

    return [x, y];
  } else if (P[0] === Q[0] && P[1] + Q[1] === 0) {
    return ["*", "*"];
  } else {
    const temp = sumMod(Q[0] - P[0], p - 2, p);
    const k = sumMod((Q[1] - P[1]) * temp, 1, p);

    const x = sumMod(Math.pow(k, 2) - P[0] - Q[0], 1, p);
    const y = sumMod(k * (P[0] - x) - P[1], 1, p);

    return [x, y];
  }
}

function multiplyPoint(k, P, p) {
  if (k === 0) return ["*", "*"];
  if (k === 1) return P;

  let result = ["*", "*"];
  let current = P;
  let points = [];
  let decomposTwo = decomposingTwo(k);

  for (let i = 0; i <= decomposTwo[decomposTwo.length - 1]; i++) {
    console.log(`${Math.pow(2, i)}P = (${current[0]}; ${current[1]})`);
    points.push(current);
    current = sumPoints(current, current, p);
  }

  console.log("Сложение точек:");

  let accumulated = 0;

  for (let i = 0; i < decomposTwo.length; i++) {
    const power = decomposTwo[i];
    const pointToAdd = points[power];
    const currentValue = Math.pow(2, power);

    if (result[0] === "*" && result[1] === "*") {
      result = pointToAdd;
      accumulated = currentValue;
      console.log(`${currentValue}P = (${result[0]}; ${result[1]})`);
    } else {
      const oldResult = [...result];
      const oldAccumulated = accumulated;
      result = sumPoints(result, pointToAdd, p);
      accumulated += currentValue;
      console.log(
        `${oldAccumulated}P + ${currentValue}P = ${pointToString(
          oldResult
        )} + ${pointToString(pointToAdd)} = ${pointToString(result)}`
      );
    }
  }

  return result;
}

function pointToString(point) {
  if (point[0] === "*" && point[1] === "*") return "O";
  return `(${point[0]}; ${point[1]})`;
}

// 1
while (!RobinMillerAlg.robinMiller(p)) {
  p += 2;
}

console.log("p:", p);

// 2

while (!checkX(x, p)) {
  x++;
}

console.log("x:", x);
pointsP = [x, y];
console.log("point p:", pointsP);

// 3
const resultP = multiplyPoint(151, pointsP, p);
console.log("P =", resultP);

// 4
// 5
