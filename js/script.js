import { RobinMiller } from "./robinMiller.js";

const minStep = 0;
const maxStep = 4;
let currentStep = minStep;
let validStep = false;
let validSteps = Array(maxStep + 1).fill(false);

let p = null;

let y = null;
let pointsP = [];
const numberP = 151;
let a = 1;
let b = 0;

const RobinMillerAlg = new RobinMiller();

const pValue = document.getElementById("pValue");
const containerSetP = document.getElementById("containerSetP");
const stepButtons = document.querySelector(".step-btns");
const pageContent = document.querySelector(".pages-content");
const aValue = document.getElementById("aValue");
const bValue = document.getElementById("bValue");
const findBtnX = document.getElementById("findBtnX");
const containerX = document.querySelector(".container-x");
const decompoaseNumberP = document.querySelector(".decompose-number-p");
const containerPoints = document.querySelector(".container-points");

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

findBtnX.addEventListener("click", () => {
  let x = 0;
  containerX.innerHTML = ``;
  a = Number.parseInt(aValue.value);
  b = Number.parseInt(bValue.value);

  validSteps[1] = false;

  while (!checkX(x, a, b, p)) {
    x++;
  }
  pointsP = [x, y];

  validSteps[1] = true;
  updateUI();

  const divPoint = document.createElement("div");
  divPoint.innerHTML = `P = (${pointsP[0]}; ${pointsP[1]})`;
  containerX.appendChild(divPoint);
});

function init() {
  containerX.innerHTML = ``;
  containerSetP.innerHTML = "";
  pValue.classList.remove("valid");
  pValue.classList.remove("invalid");

  const validation = validNumberField(pValue.value.trim());
  validStep = validation.isValid;

  if (!validation.isValid) {
    pValue.classList.add("invalid");
    containerSetP.innerHTML = validation.message || "Неверный формат числа";
    validSteps[0] = false;
    updateUI();
    return;
  }

  let pTemp = Number.parseInt(pValue.value.trim());
  let prevP = [];
  let nextP = [];

  const isValid = RobinMillerAlg.robinMiller(pTemp);
  validStep = isValid;

  if (!isValid) {
    validSteps[0] = false;

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
    divPrevP.innerHTML =
      "Ближайшие простые числа: " + prevP.join(", ") + " | " + nextP.join(", ");
    containerSetP.appendChild(divPrevP);
  } else {
    validSteps[0] = true;

    pValue.classList.add("valid");
    pValue.classList.remove("invalid");
    p = pTemp;
  }

  updateUI();
}

pValue.addEventListener("input", () => {
  init();
});

function updateUI() {
  const prevButton = stepButtons.querySelector(".prev");
  const nextButton = stepButtons.querySelector(".next");

  prevButton.style.display = currentStep === minStep ? "none" : "block";
  nextButton.style.display = currentStep === maxStep ? "none" : "block";

  prevButton.disabled = currentStep === minStep;

  const canProceed = validSteps[currentStep] && currentStep < maxStep;
  nextButton.disabled = !canProceed;

  const pages = pageContent.querySelectorAll(".page");

  pages.forEach((el, index) => {
    if (index !== currentStep) el.style.display = "none";
    else {
      el.style.display = "block";

      if (index === 2 && validSteps[1] && !validSteps[2]) {
        calculateStep2();
      } else if (index === 3 && validSteps[2] && !validSteps[3]) {
        calculateStep3();
      } else if (index === 4 && validSteps[3] && !validSteps[4]) {
        calculateStep4();
      }
    }
  });
}

function calculateStep2() {
  console.log("Выполняем вычисления для шага 2...");

  const resultP = multiplyPoint(numberP, pointsP, p, containerPoints);
  console.log(`${numberP}P = (${resultP.join("; ")})`);

  const step2Result = document.getElementById("step2Result");
  if (step2Result) {
    step2Result.innerHTML = `${numberP}P = (${resultP.join("; ")})`;
  }

  validSteps[2] = true;
  updateUI();
}

function calculateStep3() {
  console.log("Выполняем вычисления для шага 3...");

  const allPoints = findAllPoints(p);
  const orderInfo = checkHasseTheorem(p, allPoints);
  console.log(orderInfo);

  const step3Result = document.getElementById("step3Result");
  if (step3Result) {
    step3Result.innerHTML = `
      Количество точек: ${orderInfo.G}<br>
      Границы Хассе: ${orderInfo.pLower} ≤ ${orderInfo.G} ≤ ${
      orderInfo.pUpper
    }<br>
      Теорема Хассе: ${orderInfo.satisfied ? "выполняется" : "не выполняется"}
    `;
  }

  validSteps[3] = true;
  updateUI();
}

function calculateStep4() {
  console.log("Выполняем вычисления для шага 4...");

  const allPoints = findAllPoints(p);

  if (pointsP[0] !== "*") {
    console.log("\n" + "=".repeat(50));
    console.log("ШАГ 4: ПОРЯДОК ТОЧКИ P");
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

      const step4Result = document.getElementById("step4Result");
      if (step4Result) {
        let resultHTML = `
          Порядок группы: ${groupOrder}<br>
          Порядок точки P: ${pointOrder}<br>
          Теорема Лагранжа: ${lagrangeCheck ? "выполняется" : "не выполняется"}
        `;

        if (lagrangeCheck) {
          const cofactor = groupOrder / pointOrder;
          resultHTML += `<br>Кофактор: ${groupOrder} / ${pointOrder} = ${cofactor}`;

          if (pointOrder === groupOrder) {
            resultHTML += `<br>✓ Точка P является образующей (порядок равен порядку группы)`;
          } else {
            resultHTML += `<br>Точка P не является образующей`;
          }
        }

        step4Result.innerHTML = resultHTML;
      }
    } else {
      console.log("✗ ОШИБКА: Точка P не принадлежит кривой!");

      const step4Result = document.getElementById("step4Result");
      if (step4Result) {
        step4Result.innerHTML = "ОШИБКА: Точка P не принадлежит кривой!";
      }
    }
  }

  validSteps[4] = true;
  updateUI();
}

stepButtons.addEventListener("click", (e) => {
  if (e.target.classList.contains("prev") && currentStep > minStep) {
    currentStep--;
    updateUI();
  } else if (
    e.target.classList.contains("next") &&
    currentStep < maxStep &&
    validSteps[currentStep]
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
  const divRow = document.createElement("div");
  divRow.className = "container-x-row";

  const divX = document.createElement("div");
  divX.innerHTML = `x = ${x} `;
  divRow.appendChild(divX);

  const func = ellepticheskaiaKrivaia(x, a, b);
  const temp = RobinMillerAlg.sumMod(func, 1, p);

  const divTemp = document.createElement("div");
  divTemp.innerHTML = `y<sup>2</sup> = ${func} mod ${p}`;
  divRow.appendChild(divTemp);

  const tempSum = p + temp;

  const divSum = document.createElement("div");
  divSum.innerHTML = `y<sup>2</sup> = ${p} + ${temp} = ${tempSum}`;
  divRow.appendChild(divSum);

  const divSqrt = document.createElement("div");
  y = Math.sqrt(tempSum);

  if (Number.isInteger(y)) {
    divSqrt.innerHTML = `y = ${y}`;
    divRow.appendChild(divSqrt);
    containerX.appendChild(divRow);
    return true;
  }
  divSqrt.innerHTML = `y = ${y}`;
  divRow.appendChild(divSqrt);
  containerX.appendChild(divRow);
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

function sumPoints(P, Q, p, container) {
  const divCard = document.createElement("div");
  const divHeader = document.createElement("div");
  divHeader.className = "points-header";
  const divPoint = document.createElement("div");
  divCard.className = "points-card";

  if (P[0] === "*" && P[1] === "*") {
    divPoint.innerHTML = `P: (${P[0]}; ${P[1]})`;
    container.appendChild(divPoint);
    return Q;
  }
  if (Q[0] === "*" && Q[1] === "*") {
    divPoint.innerHTML = `Q: (${Q[0]}; ${Q[1]})`;
    container.appendChild(divPoint);
    return P;
  }

  const divPointK = document.createElement("div");
  const divPointX = document.createElement("div");
  const divPointY = document.createElement("div");
  const divPointResult = document.createElement("div");

  if (P[0] === Q[0] && P[1] === Q[1]) {
    divHeader.innerHTML = `Случай 3 (${P[0]}; ${P[1]}) и (${Q[0]}; ${Q[1]}): x_2 == x_1 и y_2 == y_1.`;

    const temp = sumMod(2 * P[1], p - 2, p);
    console.log(`temp: ${temp}`);

    const k = sumMod((3 * Math.pow(P[0], 2) + a) * temp, 1, p);
    console.log(`k: ${k}`);

    const x = sumMod(Math.pow(k, 2) - 2 * P[0], 1, p);
    const y = sumMod(k * (P[0] - x) - P[1], 1, p);

    divPointK.innerHTML = `k = (3 * ${P[0]}<sup>2</sup> + ${a})(2 * ${
      Q[0]
    })<sup>-1</sup> mod ${p} = ${
      3 * Math.pow(P[0], 2) + a
    } * ${temp} mod ${p} = ${k}`;

    divPointX.innerHTML = `x = ${k}<sup>2</sup> - 2 * ${
      P[0]
    } mod ${p} = ${Math.pow(k, 2)} - ${2 * P[0]} mod ${p} = ${x}`;

    divPointY.innerHTML = `y = ${k} * (${P[0]} - ${x}) - ${
      Q[0]
    } mod ${p} = ${k} * ${P[0] - x} - ${Q[0]} mod ${p} = ${y}`;

    divPointResult.innerHTML = `(${x}; ${y})`;

    divCard.appendChild(divHeader);
    divCard.appendChild(divPointK);
    divCard.appendChild(divPointX);
    divCard.appendChild(divPointY);
    divCard.appendChild(divPointResult);
    container.appendChild(divCard);

    return [x, y];
  } else if (P[0] === Q[0] && P[1] + Q[1] === 0) {
    divHeader.innerHTML = `Случай 2 (${P[0]}; ${P[1]}) и (${Q[0]}; ${Q[1]}): Бесконечно удаленная точка.`;
    divPointResult.innerHTML = `(*; *)`;

    divCard.appendChild(divHeader);
    divCard.appendChild(divPointResult);
    container.appendChild(divCard);

    return ["*", "*"];
  } else {
    divHeader.innerHTML = `Случай 1 (${P[0]}; ${P[1]}) и (${Q[0]}; ${Q[1]}): x_2 != x_1.`;

    const temp = sumMod(Q[0] - P[0], p - 2, p);
    console.log(`temp: ${temp}`);

    const k = sumMod((Q[1] - P[1]) * temp, 1, p);
    console.log(`k: ${k}`);

    const x = sumMod(Math.pow(k, 2) - P[0] - Q[0], 1, p);
    const y = sumMod(k * (P[0] - x) - P[1], 1, p);

    divPointK.innerHTML = `k = (${Q[1]} - ${Q[0]})(${P[1]} - ${P[0]})<sup>-1</sup> mod ${p} = ${Q[1]} - ${Q[0]} * ${temp} mod ${p} = ${k}`;

    divPointX.innerHTML = `x = ${k}<sup>2</sup> - (${P[0]} + ${
      P[1]
    }) mod ${p} = ${Math.pow(k, 2)} - ${P[0] + P[1]} mod ${p} = ${x}`;

    divPointY.innerHTML = `y = ${k} * (${P[0]} - ${x}) - ${
      Q[0]
    } mod ${p} = ${k} * ${P[0] - x} - ${Q[0]} mod ${p} = ${y}`;

    divPointResult.innerHTML = `(${x}; ${y})`;

    divCard.appendChild(divHeader);
    divCard.appendChild(divPointK);
    divCard.appendChild(divPointX);
    divCard.appendChild(divPointY);
    divCard.appendChild(divPointResult);
    container.appendChild(divCard);

    return [x, y];
  }
}

function multiplyPoint(k, P, p, container) {
  if (k === 0) return ["*", "*"];
  if (k === 1) return P;

  let result = ["*", "*"];
  let current = P;
  let points = [];
  pointsP.push(result);
  let decomposTwo = decomposingTwo(k);

  const divDecomposTwo = document.createElement("div");
  decomposTwo.map((el) => {
    divDecomposTwo.innerHTML += `<div class="row">${Math.pow(2, el)}</div>`;
  });
  decompoaseNumberP.appendChild(divDecomposTwo);

  for (let i = 0; i <= decomposTwo[decomposTwo.length - 1]; i++) {
    console.log(`${Math.pow(2, i)}P = (${current[0]}; ${current[1]})`);
    points.push(current);
    current = sumPoints(current, current, p, container);
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

      result = sumPoints(result, pointToAdd, p, container);

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

function findPointOrder(P, groupOrder, p, container) {
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
    const result = multiplyPoint(k, P, p, container);
    if (result[0] === "*" && result[1] === "*") {
      return k;
    }
  }
  return groupOrder;
}
