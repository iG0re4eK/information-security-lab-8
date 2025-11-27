import { RobinMiller } from "./robinMiller.js";

const minStep = 0;
const maxStep = 4;
let currentStep = minStep;
let validStep = false;

let p = null;
let x = 0;
let y = null;
let pointsP = [];
const numberP = 151;
const a = 1;
const b = 0;

const RobinMillerAlg = new RobinMiller();

const pValue = document.getElementById("pValue");
const containerSetP = document.getElementById("containerSetP");
const stepButtons = document.querySelector(".step-btns");
const pageContent = document.querySelector(".pages-content");

function validNumberField(fieldValue) {
  if (fieldValue.trim() === "") {
    return { isValid: false, message: "Поле не может быть пустым" };
  }

  if (!/^\d+$/.test(fieldValue)) {
    return { isValid: false, message: "Введите целое число" };
  }

  const number = Number.parseInt(fieldValue);

  if (number < 2) {
    return { isValid: false, message: "Число должно быть больше 1" };
  }

  return { isValid: true, number: number };
}

pValue.addEventListener("change", () => {
  containerSetP.innerHTML = "";
  pValue.classList.remove("valid");
  pValue.classList.remove("invalid");

  const validation = validNumberField(pValue.value.trim());
  validStep = validation.isValid;

  if (!validation.isValid) {
    pValue.classList.add("invalid");
    containerSetP.innerHTML = validation.message || "Неверный формат числа";
    return;
  }

  let pTemp = Number.parseInt(pValue.value.trim());
  let prevP = [];
  let nextP = [];

  const isValid = RobinMillerAlg.robinMiller(pTemp);
  validStep = isValid;

  if (!isValid) {
    pValue.classList.remove("valid");
    pValue.classList.add("invalid");

    let tempP = pTemp - 1;
    while (prevP.length < 5 && tempP > 1) {
      if (RobinMillerAlg.robinMiller(tempP)) {
        prevP.push(tempP);
      }
      tempP--;
    }

    tempP = pTemp + 1;
    while (nextP.length < 5) {
      if (RobinMillerAlg.robinMiller(tempP)) {
        nextP.push(tempP);
      }
      tempP++;
    }

    prevP.reverse();

    const divPrevP = document.createElement("div");
    prevP.forEach((el) => {
      divPrevP.innerHTML += ` ${el}`;
    });
    containerSetP.appendChild(divPrevP);

    const divNextP = document.createElement("div");
    nextP.forEach((el) => {
      divNextP.innerHTML += ` ${el}`;
    });
    containerSetP.appendChild(divNextP);
  } else {
    pValue.classList.add("valid");
    pValue.classList.remove("invalid");
    p = pTemp;
  }
});

function updateUI() {
  const prevButton = stepButtons.querySelector(".prev");
  const nextButton = stepButtons.querySelector(".next");

  prevButton.style.display = currentStep === minStep ? "none" : "block";
  nextButton.style.display = currentStep === maxStep ? "none" : "block";

  prevButton.disabled = currentStep === minStep;
  nextButton.disabled = currentStep === maxStep;

  const pages = pageContent.querySelectorAll(".page");

  pages.forEach((el, index) => {
    if (index !== currentStep) el.style.display = "none";
    else {
      el.style.display = "block";
    }
  });
}

stepButtons.addEventListener("click", (e) => {
  if (e.target.classList.contains("prev") && currentStep > minStep) {
    currentStep--;
    updateUI();
  } else if (
    e.target.classList.contains("next") &&
    currentStep < maxStep &&
    validStep
  ) {
    currentStep++;
    updateUI();
  }
});

window.addEventListener("load", () => {
  updateUI();
});

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

function ellepticheskaiaKrivaia(x, a, b) {
  return Math.pow(x, 3) + x * a + b;
}

function checkX(x, a, b, p) {
  const func = ellepticheskaiaKrivaia(x, a, b);
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

      console.log(`=`.repeat(60));
    }
  }

  return result;
}

function pointToString(point) {
  if (point[0] === "*" && point[1] === "*") return "O";
  return `(${point[0]}; ${point[1]})`;
}

function checkHasseTheorem(p, curvePoints) {
  let G = curvePoints.length;

  const sqrtP = Math.round(Math.sqrt(p));
  const pLower = p + 1 - sqrtP;
  const pUpper = p + 1 + sqrtP;

  console.log("\n" + "=".repeat(60));
  console.log("ДЕТАЛЬНАЯ ПРОВЕРКА ТЕОРЕМЫ ХАССЕ");
  console.log("=".repeat(60));
  console.log(`Порядок поля: p = ${p}`);
  console.log(`Количество точек на кривой: G = ${G}`);
  console.log(`Ожидаемое количество точек: p + 1 = ${p + 1}`);
  console.log(`√p = ${sqrtP.toFixed(6)}`);

  console.log(`Граница: ${pLower} <= ${p + 1} <= ${pUpper}`);

  const hasseSatisfied = pLower <= G && G <= pUpper;

  console.log(`\nПроверка: ${pLower} ≤ ${G} ≤ ${pUpper}`);
  console.log(`Теорема Хассе выполняется: ${hasseSatisfied}`);

  const deviation = Math.abs(G - (p + 1));
  const maxAllowedDeviation = 2 * sqrtP;
  const deviationRatio = deviation / maxAllowedDeviation;

  console.log(`\nДополнительная информация:`);
  console.log(`Отклонение от p+1: |${G} - ${p + 1}| = ${deviation.toFixed(6)}`);
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
    G: G,
    pLower: pLower,
    pUpper: pUpper,
    satisfied: hasseSatisfied,
    deviation: deviation,
    maxDeviation: maxAllowedDeviation,
  };
}

function findPointOrder(P, groupOrder, p) {
  const divisors = [];
  for (let i = 1; i <= Math.sqrt(groupOrder); i++) {
    if (groupOrder % i === 0) {
      divisors.push(i);
      if (i !== groupOrder / i) {
        divisors.push(groupOrder / i);
      }
    }
  }
  divisors.sort((a, b) => a - b);

  for (const k of divisors) {
    const result = multiplyPoint(k, P, p);
    if (result[0] === "*" && result[1] === "*") {
      return k;
    }
  }
  return groupOrder;
}

// 2
/* while (!checkX(x, a, b, p)) {
  x++;
} */

/* console.log("x:", x);
pointsP = [x, y];
console.log("point p:", pointsP); */

// 3
/* const resultP = multiplyPoint(numberP, pointsP, p);
console.log(`${numberP}P = (${resultP.join("; ")})`); */

// 4
/* const allPoints = findAllPoints(p);
const orderInfo = checkHasseTheorem(p, allPoints);
console.log(orderInfo); */

// 5
/* if (pointsP[0] !== "*") {
  console.log("\n" + "=".repeat(50));
  console.log("ШАГ 5: ПОРЯДОК ТОЧКИ P");
  console.log("=".repeat(50));

  const ySquared =
    (pointsP[0] * pointsP[0] * pointsP[0] + a * pointsP[0] + b) % p;
  const actualYSquared = (pointsP[1] * pointsP[1]) % p;

  if (ySquared === actualYSquared) {
    console.log(`✓ Точка P(${pointsP[0]}, ${pointsP[1]}) принадлежит кривой`);

    const groupOrder = allPoints.length;
    const pointOrder = findPointOrder(pointsP, groupOrder, p);

    console.log(`Порядок группы: ${groupOrder}`);
    console.log(`Порядок точки P: ${pointOrder}`);

    const lagrangeCheck = groupOrder % pointOrder === 0;
    console.log(
      `Проверка теоремы Лагранжа: ${groupOrder} % ${pointOrder} === 0`
    );
    console.log(`Результат: ${lagrangeCheck ? "✓ ВЕРНО" : "✗ ОШИБКА"}`);

    if (lagrangeCheck) {
      const cofactor = groupOrder / pointOrder;
      console.log(`Кофактор: ${groupOrder} / ${pointOrder} = ${cofactor}`);

      if (pointOrder === groupOrder) {
        console.log(
          "✓ Точка P является образующей (порядок равен порядку группы)"
        );
      } else {
        console.log("Точка P не является образующей");
      }
    }
  } else {
    console.log("✗ ОШИБКА: Точка P не принадлежит кривой!");
  }
}
 */
