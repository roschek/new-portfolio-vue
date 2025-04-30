<template>
  <article class="three-model">
    <header class="three-model__header">
      <h3 class="three-model__title">3D Model Viewer</h3>
      <section class="three-model__options">
        <div class="three-model__option-group">
          <label for="model" class="three-model__label">Model:</label>
          <select id="model" v-model="selectedModel" class="three-model__select">
            <option v-for="model in models" :key="model.id" :value="model.id">
              {{ model.name }}
            </option>
          </select>
        </div>
        
        <div class="three-model__option-group">
          <label for="material" class="three-model__label">Material:</label>
          <select id="material" v-model="selectedMaterial" class="three-model__select">
            <option v-for="material in materials" :key="material.id" :value="material.id">
              {{ material.name }}
            </option>
          </select>
        </div>
      </section>
    </header>
    
    <section class="three-model__container">
      <figure class="three-model__canvas-container" ref="threeContainer">
        <figcaption class="three-model__canvas-caption">Interactive 3D model viewer</figcaption>
      </figure>
      
      <aside class="three-model__controls-panel">
        <h4 class="three-model__controls-title">Controls</h4>
        
        <fieldset class="three-model__control-group">
          <legend class="three-model__control-legend">Rotation</legend>
          <div class="three-model__control-row">
            <label for="rotationX" class="three-model__axis-label">X:</label>
            <input 
              id="rotationX"
              type="range" 
              min="-180" 
              max="180" 
              v-model.number="rotationX" 
              class="three-model__slider"
              aria-describedby="rotationXValue"
            >
            <output id="rotationXValue" class="three-model__value">{{ rotationX }}°</output>
          </div>
          <div class="three-model__control-row">
            <label for="rotationY" class="three-model__axis-label">Y:</label>
            <input 
              id="rotationY"
              type="range" 
              min="-180" 
              max="180" 
              v-model.number="rotationY" 
              class="three-model__slider"
              aria-describedby="rotationYValue"
            >
            <output id="rotationYValue" class="three-model__value">{{ rotationY }}°</output>
          </div>
          <div class="three-model__control-row">
            <label for="rotationZ" class="three-model__axis-label">Z:</label>
            <input 
              id="rotationZ"
              type="range" 
              min="-180" 
              max="180" 
              v-model.number="rotationZ" 
              class="three-model__slider"
              aria-describedby="rotationZValue"
            >
            <output id="rotationZValue" class="three-model__value">{{ rotationZ }}°</output>
          </div>
        </fieldset>
        
        <fieldset class="three-model__control-group">
          <legend class="three-model__control-legend">Lighting</legend>
          <div class="three-model__control-row">
            <label for="lightIntensity" class="three-model__axis-label">Intensity:</label>
            <input 
              id="lightIntensity"
              type="range" 
              min="0" 
              max="5" 
              step="0.1" 
              v-model.number="lightIntensity" 
              class="three-model__slider"
              aria-describedby="lightIntensityValue"
            >
            <output id="lightIntensityValue" class="three-model__value">{{ lightIntensity }}</output>
          </div>
          <div class="three-model__control-row">
            <label class="three-model__checkbox-label">
              <input type="checkbox" v-model="showHelpers">
              Show helpers
            </label>
          </div>
        </fieldset>
        
        <fieldset class="three-model__control-group">
          <legend class="three-model__control-legend">Animation</legend>
          <div class="three-model__control-row">
            <label class="three-model__checkbox-label">
              <input type="checkbox" v-model="animation">
              Auto-rotation
            </label>
          </div>
          <div class="three-model__control-row" v-if="animation">
            <label for="animationSpeed" class="three-model__axis-label">Speed:</label>
            <input 
              id="animationSpeed"
              type="range" 
              min="0.1" 
              max="5" 
              step="0.1" 
              v-model.number="animationSpeed" 
              class="three-model__slider"
              aria-describedby="animationSpeedValue"
            >
            <output id="animationSpeedValue" class="three-model__value">{{ animationSpeed }}</output>
          </div>
        </fieldset>
        
        <div class="three-model__control-group">
          <button 
            class="three-model__button three-model__button--primary three-model__button--wide" 
            @click="resetSettings"
          >
            Reset Settings
          </button>
        </div>
        
        <section class="three-model__info-box">
          <h5 class="three-model__info-title">Usage Instructions</h5>
          <p>
            <strong>Mouse Controls:</strong> Rotate the object by holding the left button.
            Zoom in/out using the mouse wheel.
          </p>
        </section>
      </aside>
    </section>
  </article>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Data
const selectedModel = ref('cube')
const selectedMaterial = ref('standard')
const rotationX = ref(0)
const rotationY = ref(0)
const rotationZ = ref(0)
const lightIntensity = ref(1.5)
const animation = ref(true)
const animationSpeed = ref(1)
const showHelpers = ref(false)

const models = [
  { id: 'cube', name: 'Cube' },
  { id: 'sphere', name: 'Sphere' },
  { id: 'torus', name: 'Torus' },
  { id: 'knot', name: 'Knot' },
  { id: 'pyramid', name: 'Pyramid' }
]

const materials = [
  { id: 'standard', name: 'Standard' },
  { id: 'phong', name: 'Phong (Glossy)' },
  { id: 'wireframe', name: 'Wireframe' },
  { id: 'normal', name: 'Normals' }
]

// Three.js variables
const threeContainer = ref(null)
let scene, camera, renderer, controls, model, light, lightHelper, gridHelper
let animationFrameId = null
let handleResize // Define at module level to use in both setup and cleanup

function initThree() {
  if (!threeContainer.value) return
  
  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)
  
  // Create camera
  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  // Clean up any previous renderer
  if (threeContainer.value.firstChild) {
    threeContainer.value.removeChild(threeContainer.value.firstChild)
  }
  
  threeContainer.value.appendChild(renderer.domElement)
  
  // Add controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  
  // Add light
  light = new THREE.DirectionalLight(0xffffff, lightIntensity.value)
  light.position.set(1, 1, 1)
  scene.add(light)
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)
  
  // Add helpers
  lightHelper = new THREE.DirectionalLightHelper(light, 1)
  gridHelper = new THREE.GridHelper(10, 10)
  
  if (showHelpers.value) {
    scene.add(lightHelper)
    scene.add(gridHelper)
  }
  
  // Create model
  createModel()
  
  // Define handleResize function
  handleResize = function() {
    const width = threeContainer.value.clientWidth
    const height = threeContainer.value.clientHeight
    
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    
    renderer.setSize(width, height)
  }
  
  window.addEventListener('resize', handleResize)
  
  // Start animation
  animate()
}

function createModel() {
  // Remove current model if exists
  if (model) {
    scene.remove(model)
  }
  
  // Create geometry based on selected model
  let geometry
  
  switch (selectedModel.value) {
    case 'cube':
      geometry = new THREE.BoxGeometry(2, 2, 2)
      break
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.5, 32, 32)
      break
    case 'torus':
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
      break
    case 'knot':
      geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
      break
    case 'pyramid':
      geometry = new THREE.ConeGeometry(1.5, 2, 4)
      break
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2)
  }
  
  // Create material based on selected type
  let material
  
  switch (selectedMaterial.value) {
    case 'standard':
      material = new THREE.MeshStandardMaterial({ 
        color: 0x2563eb,
        roughness: 0.5,
        metalness: 0.5
      })
      break
    case 'phong':
      material = new THREE.MeshPhongMaterial({ 
        color: 0x2563eb,
        shininess: 100,
        specular: 0x444444
      })
      break
    case 'wireframe':
      material = new THREE.MeshBasicMaterial({ 
        color: 0x2563eb,
        wireframe: true
      })
      break
    case 'normal':
      material = new THREE.MeshNormalMaterial()
      break
    default:
      material = new THREE.MeshStandardMaterial({ color: 0x2563eb })
  }
  
  // Create mesh
  model = new THREE.Mesh(geometry, material)
  scene.add(model)
  
  // Apply current rotation
  updateModelRotation()
}

function updateModelRotation() {
  if (!model) return
  
  model.rotation.x = THREE.MathUtils.degToRad(rotationX.value)
  model.rotation.y = THREE.MathUtils.degToRad(rotationY.value)
  model.rotation.z = THREE.MathUtils.degToRad(rotationZ.value)
}

function updateLightIntensity() {
  if (!light) return
  
  light.intensity = lightIntensity.value
  
  if (lightHelper) {
    lightHelper.update()
  }
}

function updateHelpers() {
  if (!scene || !lightHelper || !gridHelper) return
  
  if (showHelpers.value) {
    scene.add(lightHelper)
    scene.add(gridHelper)
  } else {
    scene.remove(lightHelper)
    scene.remove(gridHelper)
  }
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)
  
  if (animation.value) {
    model.rotation.y += 0.01 * animationSpeed.value
  }
  
  controls.update()
  renderer.render(scene, camera)
}

function resetSettings() {
  rotationX.value = 0
  rotationY.value = 0
  rotationZ.value = 0
  lightIntensity.value = 1.5
  animation.value = true
  animationSpeed.value = 1
  showHelpers.value = false
  
  updateModelRotation()
  updateLightIntensity()
  updateHelpers()
}

// Watch for changes
watch(() => selectedModel.value, createModel)
watch(() => selectedMaterial.value, createModel)

watch([() => rotationX.value, () => rotationY.value, () => rotationZ.value], () => {
  updateModelRotation()
})

watch(() => lightIntensity.value, updateLightIntensity)
watch(() => showHelpers.value, updateHelpers)

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    initThree()
  })
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  // Clean up event listeners - now using the properly defined handleResize function
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.three-model {
  margin-bottom: 2rem;
}

.three-model__header {
  margin-bottom: 2rem;
}

.three-model__title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.three-model__options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.three-model__option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.three-model__label {
  font-size: 0.875rem;
  color: #94a3b8;
}

.three-model__select {
  padding: 0.5rem 1rem;
  background-color: rgba(30, 41, 59, 0.8);
  color: white;
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.375rem;
  outline: none;
  cursor: pointer;
  min-width: 150px;
}

.three-model__select:focus {
  border-color: #3b82f6;
}

.three-model__container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.three-model__canvas-container {
  height: 400px;
  background-color: rgba(15, 23, 42, 0.7);
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0;
  position: relative;
}

.three-model__canvas-caption {
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

.three-model__controls-panel {
  background-color: rgba(30, 41, 59, 0.5);
  padding: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.three-model__controls-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: white;
}

.three-model__control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: rgba(30, 41, 59, 0.4);
}

.three-model__control-legend {
  padding: 0 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.three-model__control-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.three-model__axis-label {
  width: 4rem;
  color: #cbd5e1;
  font-size: 0.875rem;
}

.three-model__slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background-color: rgba(71, 85, 105, 0.5);
  border-radius: 3px;
  outline: none;
}

.three-model__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #3b82f6;
  cursor: pointer;
}

.three-model__value {
  min-width: 3rem;
  text-align: right;
  color: #cbd5e1;
  font-family: monospace;
}

.three-model__checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.875rem;
}

.three-model__info-box {
  background-color: rgba(15, 23, 42, 0.7);
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 3px solid #3b82f6;
}

.three-model__info-title {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: white;
}

.three-model__info-box p {
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.three-model__button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.three-model__button--primary {
  background-color: #3b82f6;
  color: white;
}

.three-model__button--primary:hover {
  background-color: #2563eb;
}

.three-model__button--wide {
  width: 100%;
}

@media (min-width: 768px) {
  .three-model__container {
    grid-template-columns: 2fr 1fr;
  }
}

@media (max-width: 768px) {
  .three-model__options {
    flex-direction: column;
  }
  
  .three-model__option-group {
    width: 100%;
  }
}
</style>