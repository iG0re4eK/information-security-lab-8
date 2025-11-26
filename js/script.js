import { RobinMiller } from "./robinMiller.js";

let p = 5103;
let x = 0;
let y = null;
let pointsP = [];
const numberP = 151;
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
  return Math.pow(x, 3) + x * a + b;
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

function findAllPoints(p) {
  let points = [["*", "*"]];
  for (let x = 0; x < p; x++) {
    const ySq = (Math.pow(x, 3) + x) % p;
    for (let y = 0; y < p; y++) {
      if ((y * y) % p === ySq) {
        points.push([x, y]);
      }
    }
  }
  return points;
}

function sumPoints(P, Q, p) {
  if (P[0] === "*" && P[1] === "*") return Q;
  if (Q[0] === "*" && Q[1] === "*") return P;

  if (P[0] === Q[0] && P[1] === Q[1]) {
    console.log(
      `Случай 3 (${P[0]}; ${P[1]}) и (${Q[0]}; ${Q[1]}): x_2 == x_1 и y_2 == y_1.`
    );
    const temp = sumMod(2 * P[1], p - 2, p);
    console.log(`temp: ${temp}`);

    const k = sumMod((3 * Math.pow(P[0], 2) + a) * temp, 1, p);
    console.log(`k: ${k}`);

    const x = sumMod(Math.pow(k, 2) - 2 * P[0], 1, p);
    const y = sumMod(k * (P[0] - x) - P[1], 1, p);

    return [x, y];
  } else if (P[0] === Q[0] && P[1] + Q[1] === 0) {
    console.log(
      `Случай 2 (${P[0]}; ${P[1]}) и (${Q[0]}; ${Q[1]}): Бесконечно удаленная точка.`
    );

    return ["*", "*"];
  } else {
    console.log(
      `Случай 1 (${P[0]}; ${P[1]}) и (${Q[0]}; ${Q[1]}): x_2 != x_1.`
    );
    const temp = sumMod(Q[0] - P[0], p - 2, p);
    console.log(`temp: ${temp}`);

    const k = sumMod((Q[1] - P[1]) * temp, 1, p);
    console.log(`k: ${k}`);

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
  pointsP.push(result);
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

      console.log(`--------------------------------------------------`);
    }
  }

  return result;
}

function pointToString(point) {
  if (point[0] === "*" && point[1] === "*") return "O";
  return `(${point[0]}; ${point[1]})`;
}

function checkHasseTheorem(p, curvePoints) {
  let N = curvePoints.length;

  const sqrtP = Math.floor(Math.sqrt(p));
  const hasseLower = p + 1 - 2 * sqrtP;
  const hasseUpper = p + 1 + 2 * sqrtP;

  const exactSqrtP = Math.sqrt(p);
  const exactLower = p + 1 - 2 * exactSqrtP;
  const exactUpper = p + 1 + 2 * exactSqrtP;

  console.log("\n" + "=".repeat(60));
  console.log("ДЕТАЛЬНАЯ ПРОВЕРКА ТЕОРЕМЫ ХАССЕ");
  console.log("=".repeat(60));
  console.log(`Порядок поля: p = ${p}`);
  console.log(`Количество точек на кривой: N = ${N}`);
  console.log(`Ожидаемое количество точек: p + 1 = ${p + 1}`);
  console.log(`√p = ${exactSqrtP.toFixed(6)}`);
  console.log(`2√p = ${(2 * exactSqrtP).toFixed(6)}`);
  console.log(`\nГраницы Хассе (целочисленные):`);
  console.log(`Нижняя граница: ${p + 1} - 2⌊√${p}⌋ = ${hasseLower}`);
  console.log(`Верхняя граница: ${p + 1} + 2⌊√${p}⌋ = ${hasseUpper}`);
  console.log(`\nГраницы Хассе (точные):`);
  console.log(`Нижняя граница: ${p + 1} - 2√${p} ≈ ${exactLower.toFixed(6)}`);
  console.log(`Верхняя граница: ${p + 1} + 2√${p} ≈ ${exactUpper.toFixed(6)}`);

  const hasseSatisfied = hasseLower <= N && N <= hasseUpper;

  console.log(`\nПроверка: ${hasseLower} ≤ ${N} ≤ ${hasseUpper}`);
  console.log(`Теорема Хассе выполняется: ${hasseSatisfied}`);

  const deviation = Math.abs(N - (p + 1));
  const maxAllowedDeviation = 2 * exactSqrtP;
  const deviationRatio = deviation / maxAllowedDeviation;

  console.log(`\nДополнительная информация:`);
  console.log(`Отклонение от p+1: |${N} - ${p + 1}| = ${deviation.toFixed(6)}`);
  console.log(
    `Максимально допустимое отклонение: 2√p ≈ ${maxAllowedDeviation.toFixed(6)}`
  );
  console.log(`Отношение отклонения: ${deviationRatio.toFixed(4)}`);

  if (hasseSatisfied) {
    console.log(`✓ Теорема Хассе подтверждена!`);
  } else {
    console.log(`✗ Нарушение теоремы Хассе!`);
    console.log("Возможные причины:");
    console.log("- Ошибка в подсчете точек");
    console.log("- Кривая не является гладкой");
    console.log("- Особенности реализации");
  }

  return {
    p: p,
    N: N,
    hasseLower: hasseLower,
    hasseUpper: hasseUpper,
    exactLower: exactLower,
    exactUpper: exactUpper,
    satisfied: hasseSatisfied,
    deviation: deviation,
    maxDeviation: maxAllowedDeviation,
  };
}

function checkGroupOrderPrimality(orderInfo) {
  try {
    if (!orderInfo) {
      console.error("Ошибка: orderInfo не определен");
      return [];
    }

    const primeOrders = [];

    const possibleOrders = [];

    for (
      let order = orderInfo.hasseLower;
      order <= orderInfo.hasseUpper;
      order++
    ) {
      possibleOrders.push(order);
    }

    console.log("\n" + "=".repeat(60));
    console.log("ПРОВЕРКА ПРОСТОТЫ ВОЗМОЖНЫХ ПОРЯДКОВ ГРУППЫ");
    console.log("=".repeat(60));
    console.log(
      `Возможные порядки: от ${orderInfo.hasseLower} до ${orderInfo.hasseUpper}`
    );

    for (const order of possibleOrders) {
      if (RobinMillerAlg.robinMiller(order)) {
        primeOrders.push(order);
        console.log(`Порядок ${order} - ПРОСТОЙ`);
      } else {
        console.log(`Порядок ${order} - составной`);
      }
    }

    if (primeOrders.length > 0) {
      console.log(`\nПростые порядки группы: [${primeOrders.join(", ")}]`);
      return primeOrders;
    } else {
      console.log("\nСреди возможных порядков нет простых чисел");
      return [];
    }
  } catch (error) {
    console.error("Ошибка в checkGroupOrderPrimality:", error);
    return [];
  }
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
const resultP = multiplyPoint(numberP, pointsP, p);
console.log(`${numberP}P = (${resultP.join("; ")})`);

// 4
const allPoints = findAllPoints(p);
const orderInfo = checkHasseTheorem(p, allPoints);
console.log(orderInfo);

// 5
const primeOrders = checkGroupOrderPrimality(orderInfo);

if (primeOrders.length > 0) {
  console.log("\n✓ УСПЕХ: Найдены простые порядки группы эллиптической кривой");
  console.log(`Рекомендуемый порядок группы: ${primeOrders[0]}`);
} else {
  console.log("\n⚠ ВНИМАНИЕ: Не найдено простых порядков группы");
}
