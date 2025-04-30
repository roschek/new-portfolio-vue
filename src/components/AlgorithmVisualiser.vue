<template>
  <article class="algorithm">
    <header class="algorithm__header">
      <h3 class="algorithm__title">Algorithm Visualizer</h3>
      <div class="algorithm__controls">
        <fieldset class="algorithm__control-group">
          <legend class="algorithm__control-legend">Settings</legend>
          <div class="algorithm__control-row">
            <label for="algorithm" class="algorithm__label">Algorithm:</label>
            <select 
              id="algorithm" 
              v-model="selectedAlgorithm" 
              class="algorithm__select"
              @change="resetAlgorithm"
            >
              <option v-for="algo in algorithms" :key="algo.id" :value="algo.id">
                {{ algo.name }}
              </option>
            </select>
          </div>
          
          <div class="algorithm__control-row">
            <label for="arraySize" class="algorithm__label">Array Size:</label>
            <select 
              id="arraySize" 
              v-model="arraySize" 
              class="algorithm__select"
              @change="resetAlgorithm"
            >
              <option v-for="size in [10, 20, 30, 50, 100]" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>
          
          <div class="algorithm__control-row">
            <label for="speed" class="algorithm__label">Speed:</label>
            <select id="speed" v-model="speed" class="algorithm__select">
              <option value="slow">Slow</option>
              <option value="medium">Medium</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </fieldset>
      </div>
      
      <div class="algorithm__actions">
        <button 
          class="algorithm__button algorithm__button--primary" 
          @click="startAlgorithm"
          :disabled="isRunning"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Start
        </button>
        
        <button 
          class="algorithm__button algorithm__button--secondary" 
          @click="resetAlgorithm"
          :disabled="isRunning"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
          Reset
        </button>
        
        <button 
          v-if="isRunning" 
          class="algorithm__button algorithm__button--danger" 
          @click="stopAlgorithm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
          </svg>
          Stop
        </button>
      </div>
    </header>
    
    <section class="algorithm__container">
      <figure class="algorithm__visualization">
        <div 
          v-for="(item, index) in array" 
          :key="index" 
          class="algorithm__bar"
          :class="{
            'algorithm__bar--current': currentIndices.includes(index),
            'algorithm__bar--comparing': comparingIndices.includes(index),
            'algorithm__bar--sorted': sortedIndices.includes(index)
          }"
          :style="{ height: `${item * 3}px` }"
          role="presentation"
        ></div>
        <figcaption class="algorithm__visualization-caption">
          Sorting visualization - array elements represented as bars
        </figcaption>
      </figure>
      
      <aside class="algorithm__info">
        <section class="algorithm__stats">
          <div class="algorithm__stat">
            <span class="algorithm__stat-label">Comparisons:</span>
            <span class="algorithm__stat-value">{{ comparisonCount }}</span>
          </div>
          <div class="algorithm__stat">
            <span class="algorithm__stat-label">Swaps:</span>
            <span class="algorithm__stat-value">{{ swapCount }}</span>
          </div>
          <div class="algorithm__stat" v-if="elapsedTime > 0">
            <span class="algorithm__stat-label">Time:</span>
            <span class="algorithm__stat-value">{{ elapsedTime }} ms</span>
          </div>
        </section>
        
        <section class="algorithm__explanation">
          <h4>How {{ getSelectedAlgorithm.name }} works:</h4>
          <p>{{ getSelectedAlgorithm.description }}</p>
          <dl class="algorithm__complexity">
            <div class="algorithm__complexity-item">
              <dt class="algorithm__complexity-term">Time Complexity:</dt>
              <dd class="algorithm__complexity-definition">{{ getSelectedAlgorithm.timeComplexity }}</dd>
            </div>
            <div class="algorithm__complexity-item">
              <dt class="algorithm__complexity-term">Space Complexity:</dt>
              <dd class="algorithm__complexity-definition">{{ getSelectedAlgorithm.spaceComplexity }}</dd>
            </div>
          </dl>
        </section>
      </aside>
    </section>
  </article>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Define props and emits
const props = defineProps({
  initialArraySize: {
    type: Number,
    default: 30
  }
})

// Algorithm data
const array = ref([])
const arraySize = ref(props.initialArraySize)
const selectedAlgorithm = ref('bubble')
const speed = ref('medium')
const isRunning = ref(false)
const comparisonCount = ref(0)
const swapCount = ref(0)
const currentIndices = ref([])
const comparingIndices = ref([])
const sortedIndices = ref([])
const elapsedTime = ref(0)

const algorithms = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    description: 'Builds the sorted array one item at a time by comparing each new element to the already-sorted elements and inserting it into the correct position.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    description: 'Divides the input into a sorted and an unsorted region, then repeatedly selects the smallest element from the unsorted region and moves it to the sorted region.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    description: 'A divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    description: 'Selects a pivot element and partitions the array around it, then recursively sorts the sub-arrays. Uses the divide and conquer strategy.',
    timeComplexity: 'Average: O(n log n), Worst: O(n²)',
    spaceComplexity: 'O(log n)'
  }
]

const getSelectedAlgorithm = computed(() => {
  return algorithms.find(algo => algo.id === selectedAlgorithm.value)
})

function getAnimationDelay() {
  if (speed.value === 'slow') {
    return 150
  } else if (speed.value === 'medium') {
    return 50
  } else {
    return 10
  }
}

function generateRandomArray(size) {
  const array = []
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1)
  }
  return array
}

function resetAlgorithm() {
  if (isRunning.value) {
    stopAlgorithm()
  }
  
  array.value = generateRandomArray(arraySize.value)
  comparisonCount.value = 0
  swapCount.value = 0
  currentIndices.value = []
  comparingIndices.value = []
  sortedIndices.value = []
  elapsedTime.value = 0
}

let sortingTimeoutId = null

async function startAlgorithm() {
  if (isRunning.value) return
  
  isRunning.value = true
  comparisonCount.value = 0
  swapCount.value = 0
  currentIndices.value = []
  comparingIndices.value = []
  sortedIndices.value = []
  
  const startTime = performance.now()
  
  try {
    switch (selectedAlgorithm.value) {
      case 'bubble':
        await bubbleSort()
        break
      case 'insertion':
        await insertionSort()
        break
      case 'selection':
        await selectionSort()
        break
      case 'merge':
        await mergeSort()
        break
      case 'quick':
        await quickSort()
        break
    }
  } catch (error) {
    if (error.message !== 'Sorting stopped') {
      console.error(error)
    }
  }
  
  const endTime = performance.now()
  elapsedTime.value = Math.round(endTime - startTime)
  
  isRunning.value = false
}

function stopAlgorithm() {
  isRunning.value = false
  if (sortingTimeoutId) {
    clearTimeout(sortingTimeoutId)
  }
}

function delay(ms) {
  if (!isRunning.value) {
    return Promise.reject(new Error('Sorting stopped'))
  }
  
  return new Promise(resolve => {
    sortingTimeoutId = setTimeout(resolve, ms)
  })
}

async function swap(arr, i, j) {
  if (i === j) return
  
  comparingIndices.value = [i, j]
  await delay(getAnimationDelay())
  
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
  
  swapCount.value++
  comparingIndices.value = []
}

// Bubble Sort Implementation
async function bubbleSort() {
  const arr = array.value
  const n = arr.length
  
  for (let i = 0; i < n; i++) {
    currentIndices.value = [i]
    
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      comparisonCount.value++
      comparingIndices.value = [j, j + 1]
      
      await delay(getAnimationDelay())
      
      if (arr[j] > arr[j + 1]) {
        await swap(arr, j, j + 1)
        swapped = true
      }
    }
    
    sortedIndices.value.push(n - i - 1)
    
    if (!swapped) {
      // If no swaps occurred, array is sorted
      for (let k = 0; k < n - i - 1; k++) {
        sortedIndices.value.push(k)
      }
      break
    }
  }
  
  currentIndices.value = []
  comparingIndices.value = []
}

// Insertion Sort Implementation
async function insertionSort() {
  const arr = array.value
  const n = arr.length
  
  for (let i = 1; i < n; i++) {
    currentIndices.value = [i]
    let current = arr[i]
    let j = i - 1
    
    while (j >= 0) {
      comparisonCount.value++
      comparingIndices.value = [j, j + 1]
      
      await delay(getAnimationDelay())
      
      if (arr[j] > current) {
        arr[j + 1] = arr[j]
        swapCount.value++
        j--
      } else {
        break
      }
    }
    
    arr[j + 1] = current
    sortedIndices.value = Array.from({length: i + 1}, (_, index) => index)
  }
  
  currentIndices.value = []
  comparingIndices.value = []
}

// Selection Sort Implementation
async function selectionSort() {
  const arr = array.value
  const n = arr.length
  
  for (let i = 0; i < n - 1; i++) {
    currentIndices.value = [i]
    let minIndex = i
    
    for (let j = i + 1; j < n; j++) {
      comparisonCount.value++
      comparingIndices.value = [minIndex, j]
      
      await delay(getAnimationDelay())
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    
    if (minIndex !== i) {
      await swap(arr, i, minIndex)
    }
    
    sortedIndices.value.push(i)
  }
  
  sortedIndices.value.push(n - 1)
  currentIndices.value = []
  comparingIndices.value = []
}

// Merge Sort Implementation
async function mergeSort() {
  const arr = array.value
  await mergeSortHelper(arr, 0, arr.length - 1)
  
  // Mark all as sorted when done
  sortedIndices.value = Array.from({length: arr.length}, (_, index) => index)
  currentIndices.value = []
  comparingIndices.value = []
}

async function mergeSortHelper(arr, left, right) {
  if (left >= right) return
  
  const mid = Math.floor((left + right) / 2)
  
  await mergeSortHelper(arr, left, mid)
  await mergeSortHelper(arr, mid + 1, right)
  
  await merge(arr, left, mid, right)
}

async function merge(arr, left, mid, right) {
  const n1 = mid - left + 1
  const n2 = right - mid
  
  // Create temp arrays
  const L = new Array(n1)
  const R = new Array(n2)
  
  // Copy data to temp arrays
  for (let i = 0; i < n1; i++) {
    L[i] = arr[left + i]
  }
  for (let j = 0; j < n2; j++) {
    R[j] = arr[mid + 1 + j]
  }
  
  // Merge the temp arrays back
  let i = 0, j = 0, k = left
  
  while (i < n1 && j < n2) {
    comparisonCount.value++
    comparingIndices.value = [left + i, mid + 1 + j]
    
    await delay(getAnimationDelay())
    
    if (L[i] <= R[j]) {
      arr[k] = L[i]
      i++
    } else {
      arr[k] = R[j]
      j++
    }
    
    swapCount.value++
    currentIndices.value = [k]
    k++
  }
  
  // Copy remaining elements of L[]
  while (i < n1) {
    currentIndices.value = [k]
    arr[k] = L[i]
    i++
    k++
    await delay(getAnimationDelay() / 2)
  }
  
  // Copy remaining elements of R[]
  while (j < n2) {
    currentIndices.value = [k]
    arr[k] = R[j]
    j++
    k++
    await delay(getAnimationDelay() / 2)
  }
}

// Quick Sort Implementation
async function quickSort() {
  const arr = array.value
  await quickSortHelper(arr, 0, arr.length - 1)
  
  // Mark all as sorted when done
  sortedIndices.value = Array.from({length: arr.length}, (_, index) => index)
  currentIndices.value = []
  comparingIndices.value = []
}

async function quickSortHelper(arr, low, high) {
  if (low < high) {
    const pivotIndex = await partition(arr, low, high)
    
    // Elements at pivot position are already in place
    sortedIndices.value.push(pivotIndex)
    
    // Recursively sort elements before and after partition
    await quickSortHelper(arr, low, pivotIndex - 1)
    await quickSortHelper(arr, pivotIndex + 1, high)
  } else if (low === high) {
    // Single element is always sorted
    sortedIndices.value.push(low)
  }
}

async function partition(arr, low, high) {
  // Using the last element as pivot
  const pivot = arr[high]
  currentIndices.value = [high]
  
  let i = low - 1
  
  for (let j = low; j < high; j++) {
    comparisonCount.value++
    comparingIndices.value = [j, high]
    
    await delay(getAnimationDelay())
    
    if (arr[j] <= pivot) {
      i++
      await swap(arr, i, j)
    }
  }
  
  await swap(arr, i + 1, high)
  return i + 1
}

// Initialize on component mount
onMounted(() => {
  resetAlgorithm()
})
</script>

<style scoped>
.algorithm {
  margin-bottom: 2rem;
}

.algorithm__header {
  margin-bottom: 2rem;
}

.algorithm__title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.algorithm__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.algorithm__control-group {
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: rgba(30, 41, 59, 0.4);
}

.algorithm__control-legend {
  padding: 0 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.algorithm__control-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 0.75rem;
}

.algorithm__control-row:last-child {
  margin-bottom: 0;
}

.algorithm__label {
  font-size: 0.875rem;
  color: #94a3b8;
  min-width: 6rem;
}

.algorithm__select {
  padding: 0.5rem 1rem;
  background-color: rgba(30, 41, 59, 0.8);
  color: white;
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.375rem;
  outline: none;
  cursor: pointer;
  min-width: 150px;
}

.algorithm__select:focus {
  border-color: #3b82f6;
}

.algorithm__actions {
  display: flex;
  gap: 1rem;
}

.algorithm__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.algorithm__button--primary {
  background-color: #3b82f6;
  color: white;
}

.algorithm__button--primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.algorithm__button--secondary {
  background-color: rgba(71, 85, 105, 0.5);
  color: #e2e8f0;
}

.algorithm__button--secondary:hover:not(:disabled) {
  background-color: rgba(71, 85, 105, 0.7);
}

.algorithm__button--danger {
  background-color: rgba(239, 68, 68, 0.7);
  color: white;
}

.algorithm__button--danger:hover {
  background-color: rgba(239, 68, 68, 0.9);
}

.algorithm__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.algorithm__container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.algorithm__visualization {
  background-color: rgba(15, 23, 42, 0.7);
  height: 300px;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  border-radius: 0.5rem;
  gap: 2px;
  margin: 0;
  position: relative;
}

.algorithm__visualization-caption {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.algorithm__bar {
  flex: 1;
  background-color: #4b5563;
  min-width: 3px;
  transition: height 0.3s ease, background-color 0.3s ease;
}

.algorithm__bar--current {
  background-color: #3b82f6;
}

.algorithm__bar--comparing {
  background-color: #f59e0b;
}

.algorithm__bar--sorted {
  background-color: #10b981;
}

.algorithm__info {
  padding: 1.5rem;
  background-color: rgba(30, 41, 59, 0.5);
  border-radius: 0.5rem;
}

.algorithm__stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.algorithm__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.algorithm__stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.algorithm__stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #e2e8f0;
}

.algorithm__explanation {
  color: #cbd5e1;
  line-height: 1.6;
}

.algorithm__explanation h4 {
  margin-bottom: 0.75rem;
  color: white;
}

.algorithm__complexity {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.algorithm__complexity-item {
  margin-bottom: 0.5rem;
}

.algorithm__complexity-term {
  color: #94a3b8;
  margin-bottom: 0.25rem;
  font-weight: normal;
}

.algorithm__complexity-definition {
  color: #38bdf8;
  font-family: monospace;
  margin: 0;
}

@media (min-width: 768px) {
  .algorithm__container {
    grid-template-columns: 3fr 2fr;
  }
}

@media (max-width: 768px) {
  .algorithm__controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .algorithm__actions {
    flex-wrap: wrap;
  }
  
  .algorithm__button {
    flex: 1;
    justify-content: center;
  }
}
</style>