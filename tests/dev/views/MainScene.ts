import scene from '@/core/v3c/Scene'
import * as THREE from 'three'
import { Component, Watch } from 'vue-property-decorator'

@Component({ name: 'MainScene' })
export default class MainScene extends scene {
  public cameraDistance = 400

  get scene() {
    const newScene = new THREE.Scene()
    newScene.fog = new THREE.Fog(0x000000, 0, 600)
    return newScene
  }

  get camera(): THREE.Camera {
    const camera = new THREE.PerspectiveCamera(75, 0, 0.1, 100000)

    const lightShieldIntensity = 1.25
    const lightShieldDistance = 500
    const lightShieldDecay = 2.25
    const colorBase = 0x4488FF

    const lightShield1 = new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay)
    lightShield1.position.x = -300
    lightShield1.position.y = 300
    lightShield1.position.z = -150
    lightShield1.name = 'lightShield1'
    camera.add(lightShield1)

    const lightShield2 = new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay)
    lightShield2.position.x = 300
    lightShield2.position.y = 300
    lightShield2.position.z = -150
    lightShield2.name = 'lightShield2'
    camera.add(lightShield2)

    const lightShield3 = new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay)
    lightShield3.position.x = 0
    lightShield3.position.y = 300
    lightShield3.position.z = 0
    lightShield3.name = 'lightShield3'
    camera.add(lightShield3)

    const lightShield4 = new THREE.PointLight(colorBase, 2, lightShieldDistance, lightShieldDecay)
    lightShield4.position.x = 0
    lightShield4.position.y = -300
    lightShield4.position.z = 0
    lightShield4.name = 'lightShield4'
    camera.add(lightShield4)

    const lightShield5 = new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay)
    lightShield5.position.x = -300
    lightShield5.position.y = -300
    lightShield5.position.z = -150
    lightShield5.name = 'lightShield5'
    camera.add(lightShield5)

    const lightShield6 = new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay)
    lightShield6.position.x = 300
    lightShield6.position.y = -300
    lightShield6.position.z = -150
    lightShield6.name = 'lightShield6'
    camera.add(lightShield6)

    const lightShield7 = new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay)
    lightShield7.position.x = -450
    lightShield7.position.y = 0
    lightShield7.position.z = -150
    lightShield7.name = 'lightShield5'
    camera.add(lightShield7)

    const lightShield8 = new THREE.PointLight(colorBase, lightShieldIntensity, lightShieldDistance, lightShieldDecay)
    lightShield8.position.x = 450
    lightShield8.position.y = 0
    lightShield8.position.z = -150
    lightShield8.name = 'lightShield8'
    camera.add(lightShield8)

    return camera
  }

  @Watch('cameraDistance', { immediate: true, deep: true })
  public onCameraDistanceChange(val: number) {
    if (this.camera) {
      this.camera.position.z = val
    }
  }
}
