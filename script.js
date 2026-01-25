/* ---------- JAVASCRIPT KISMI ---------- */
let comparisons = 0;
let array = [];
let abortController = new AbortController(); // Durdurma kontrolü için

/* ---------- UI ---------- */
function setControls(disabled) {
  document.getElementById("startBtn").disabled = disabled;
  document.getElementById("arrayInput").disabled = disabled;
  document.getElementById("algorithm").disabled = disabled;
}

function getSpeed() {
  return Number(document.getElementById("speed").value);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ---------- INFO PANEL ---------- */
function updateAlgoInfo(algo) {
  const title = document.getElementById("algoTitle");
  const complexity = document.getElementById("complexity");
  const pseudo = document.getElementById("pseudo");
  const tip = document.getElementById("tip");

  if (algo === "bubble") {
    title.innerText = "Bubble Sort";
    complexity.innerText = "Karmaşıklık: O(n²)";
    pseudo.innerText = `for i from 0 to n
  for j from 0 to n-i-1
    if a[j] > a[j+1]
      swap(a[j], a[j+1])`;
    tip.innerText = "ℹ️ En basit ama genellikle en yavaş algoritma.";
  }
  else if (algo === "selection") {
    title.innerText = "Selection Sort";
    complexity.innerText = "Karmaşıklık: O(n²)";
    pseudo.innerText = `for i from 0 to n
  min = i
  for j from i+1 to n
    if a[j] < a[min]
      min = j
  swap(a[i], a[min])`;
    tip.innerText = "ℹ️ Her adımda en küçüğü bulup başa koyar.";
  }
  else if (algo === "merge") {
    title.innerText = "Merge Sort";
    complexity.innerText = "Karmaşıklık: O(n log n)";
    pseudo.innerText = `function mergeSort(arr)
  if len <= 1 return
  mid = len / 2
  left = mergeSort(arr[0..mid])
  right = mergeSort(arr[mid..end])
  merge(left, right)`;
    tip.innerText = "🚀 Böl ve Yönet mantığı. Büyük verilerde çok hızlıdır.";
  }
  else if (algo === "quick") {
    title.innerText = "Quick Sort";
    complexity.innerText = "Ortalama: O(n log n)";
    pseudo.innerText = `function quickSort(arr, low, high)
  if low < high
    pi = partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)`;
    tip.innerText = "⚡ Pratikte genellikle en hızlı çalışan algoritmadır.";
  }
}

function updateInfoUI() {
    const algo = document.getElementById("algorithm").value;
    updateAlgoInfo(algo);
}

/* ---------- START ---------- */
async function startSort() {
  setControls(true);
  
  // Önceki işlemi durdurma sinyali
  abortController.abort();
  abortController = new AbortController();

  let input = document.getElementById("arrayInput").value;
  
  if (!input.trim()) {
      generateSample();
      input = document.getElementById("arrayInput").value;
  }

  // Virgül, boşluk vb. ile ayır
  array = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

  if (array.length < 2) {
    alert("Lütfen en az 2 geçerli sayı girin.");
    setControls(false);
    return;
  }

  comparisons = 0;
  document.getElementById("count").innerText = comparisons;

  drawBars();

  const algo = document.getElementById("algorithm").value;
  updateAlgoInfo(algo);

  try {
      if (algo === "bubble") await bubbleSort();
      else if (algo === "selection") await selectionSort();
      else if (algo === "merge") await mergeSortWrapper();
      else if (algo === "quick") await quickSortWrapper();
      
      markSorted();
  } catch (error) {
      console.log("İşlem durduruldu veya hata oluştu", error);
  }
  
  setControls(false);
}

/* ---------- DRAW ---------- */
function drawBars(highlight = []) {
  const bars = document.getElementById("bars");
  bars.innerHTML = "";

  const maxVal = Math.max(...array, 10);
  const containerHeight = 280;

  array.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    let h = (value / maxVal) * containerHeight;
    bar.style.height = h + "px";
    bar.innerText = value;

    if (highlight.includes(i)) bar.style.background = "#e74c3c"; // Kırmızı
    
    bars.appendChild(bar);
  });
}

/* ---------- SORTS ---------- */
async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      drawBars([j, j + 1]);
      await sleep(getSpeed());

      comparisons++;
      document.getElementById("count").innerText = comparisons;

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        drawBars([j, j + 1]); 
        await sleep(getSpeed());
      }
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      drawBars([min, j]);
      await sleep(getSpeed());

      comparisons++;
      document.getElementById("count").innerText = comparisons;

      if (array[j] < array[min]) min = j;
    }
    if (min !== i) {
      [array[i], array[min]] = [array[min], array[i]];
      drawBars([i, min]);
      await sleep(getSpeed());
    }
  }
}

/* ---------- MERGE SORT ---------- */
async function mergeSortWrapper() {
  await mergeSort(0, array.length - 1);
}

async function mergeSort(l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  await mergeSort(l, m);
  await mergeSort(m + 1, r);
  await merge(l, m, r);
}

async function merge(l, m, r) {
  let left = array.slice(l, m + 1);
  let right = array.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    comparisons++;
    document.getElementById("count").innerText = comparisons;
    
    drawBars([k]); 
    await sleep(getSpeed());

    if (left[i] <= right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }
    
    drawBars([k]); 
    await sleep(getSpeed());
    k++;
  }

  while (i < left.length) {
    array[k] = left[i];
    drawBars([k]);
    await sleep(getSpeed());
    i++; k++;
  }
  while (j < right.length) {
    array[k] = right[j];
    drawBars([k]);
    await sleep(getSpeed());
    j++; k++;
  }
}

/* ---------- QUICK SORT ---------- */
async function quickSortWrapper() {
  await quickSort(0, array.length - 1);
}

async function quickSort(low, high) {
  if (low < high) {
    const pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    drawBars([j, high]); 
    await sleep(getSpeed());

    comparisons++;
    document.getElementById("count").innerText = comparisons;

    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      drawBars([i, j]);
      await sleep(getSpeed());
    }
  }

  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  drawBars([i + 1, high]);
  await sleep(getSpeed());
  
  return i + 1;
}

/* ---------- EXTRA ---------- */
function reset() {
  array = [];
  document.getElementById("bars").innerHTML = "";
  document.getElementById("count").innerText = "0";
  document.getElementById("arrayInput").value = "";
  setControls(false);
}

function markSorted() {
  const bars = document.querySelectorAll(".bar");
  bars.forEach(b => b.style.background = "#2ecc71");
}

function generateSample() {
  const count = 15;
  array = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
  document.getElementById("arrayInput").value = array.join(", ");
  drawBars();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Başlangıçta çalıştır
window.onload = function() {
    generateSample();
    updateInfoUI();
};