import Object3D from '@/core/v3c/Object3D'
import * as THREE from 'three'
import { Component, Prop, Watch } from 'vue-property-decorator'
import * as d3 from 'd3'
import TWEEN from '@tweenjs/tween.js'
import BezierEasing from 'bezier-easing'


const globeBufferGeometry = new THREE.SphereBufferGeometry(200, 64, 64)
const bezierEasing = BezierEasing(0, 0.4, 1, 0.3)
@Component({ name: 'PointsGlobal' })
export default class PointsGlobal extends Object3D {
  @Prop(String) public readonly pointsFile!: string
  @Prop(String) public readonly outlineFile!: string
  @Prop(String) public readonly color1!: string
  @Prop(String) public readonly color2!: string
  @Prop(String) public readonly color3!: string
  @Prop(String) public readonly glowColor!: string
  @Prop(String) public readonly outlineColor!: string
  @Prop(Number) public readonly pointSize!: number
  @Prop(Number) public readonly pointRatio!: number
  @Prop(Number) public readonly radius!: number

  // tslint:disable-next-line:variable-name
  private $_points: any
  private run = true

  get object3D() {
    const group = new THREE.Group()

    group.add(this.pointsEarth)
    group.add(this.globeShieldMesh)
    group.add(this.globeInnerMesh)
    group.add(this.glowSprite)
    group.add(this.glowSprite2)
    return group
  }

  get pointsEarth() {
    const material = new THREE.PointsMaterial({
      size: 0.6,
      fog: true,
      vertexColors: true,
      // transparent: true,
      blending: THREE.AdditiveBlending,
      // map: new THREE.TextureLoader().load("./static/dot.png"),
      depthWrite: false, // , depthTest: false
    })

    const geometry = new THREE.BufferGeometry()

    const pointsEarth = new THREE.Points(geometry, material)
    pointsEarth.name = 'pointsEarth'
    return pointsEarth
  }

  get globeShieldMesh() {
    const globeShieldMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      opacity: 0.5,
      fog: false,
      depthWrite: false,
      depthTest: false,
    })

    const globeShieldMesh = new THREE.Mesh(globeBufferGeometry, globeShieldMaterial)

    return globeShieldMesh
  }

  get globeInnerMesh() {
    // var globeTexture = new THREE.TextureLoader().load("./static/map_outline.png")
    const globeInnerMaterial = new THREE.MeshBasicMaterial({
      // map: globeTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      fog: true,
      depthWrite: false,
      depthTest: false,
    })

    const globeInnerMesh = new THREE.Mesh(globeBufferGeometry, globeInnerMaterial)
    globeInnerMesh.rotation.y = -Math.PI * 0.5

    globeInnerMesh.visible = false
    return globeInnerMesh
  }

  get glowSprite() {
    const customMaterialAtmosphere = new THREE.ShaderMaterial({
      uniforms: {
        c:   { value: 1.5 },
        p:   { value: 8 },
        glowColor: {
          value: new THREE.Color(0x0088ff),
        },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main()
        {
            vNormal = normalize( normalMatrix * normal );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        varying vec3 vNormal;
        void main()
        {
          float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );
          gl_FragColor = vec4( glowColor, intensity );
        }
      `,
      // transparent: true,
      // opacity: 0.5,
      blending: THREE.AdditiveBlending,
    })

    const mesh = new THREE.Mesh( new THREE.SphereGeometry(100, 64, 64), customMaterialAtmosphere )
    mesh.scale.x = 2.0025
    mesh.scale.y = 2.0025
    mesh.scale.z = 2.0025
    return mesh
  }

  get glowSprite2() {
    const vertexShader = [
      'varying vec3 vVertexWorldPosition;',
      'varying vec3 vVertexNormal;',
      'varying vec4 vFragColor;',
      'void main(){',
      ' vVertexNormal = normalize(normalMatrix * normal);',
      ' vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;',
      ' gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}',

    ].join('\n')

    const fragmentShader = [
      'uniform vec3 glowColor;',
      'uniform float coeficient;',
      'uniform float power;',

      'varying vec3 vVertexNormal;',
      'varying vec3 vVertexWorldPosition;',

      'varying vec4 vFragColor;',

      'void main(){',
      ' vec3 worldVertexToCamera= cameraPosition - vVertexWorldPosition;',
      ' vec3 viewCameraToVertex = (viewMatrix * vec4(worldVertexToCamera, 0.0)).xyz;',
      ' viewCameraToVertex = normalize(viewCameraToVertex);',
      ' float intensity  = coeficient + dot(vVertexNormal, viewCameraToVertex);',
      ' if(intensity > 0.2){ intensity = 0.0;}',
      ' gl_FragColor  = vec4(glowColor, intensity * 0.75);',
      '}',
    ].join('\n')

    const materialGlow = new THREE.ShaderMaterial({
      uniforms: {
        coeficient: {
          value: 0.0,
        },
        power: {
          value: 2,
        },
        glowColor: {
          value: new THREE.Color(0x0088ff),
        },
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,

    })

    const mesh = new THREE.Mesh( new THREE.SphereGeometry(100, 64, 64), materialGlow )
    mesh.scale.x = 2.05
    mesh.scale.y = 2.05
    mesh.scale.z = 2.05
    return mesh
  }

  @Watch('color1')
  @Watch('color2')
  @Watch('color3')
  @Watch('pointRatio')
  public resetPoints() {
    if (this.$_points) {
      this.setPoints(this.$_points)
    }
  }

  @Watch('glowColor', { immediate: true, deep: true })
  public glowColorChange() {
    (this.glowSprite.material as THREE.ShaderMaterial).uniforms.glowColor.value = new THREE.Color(this.glowColor);
    (this.glowSprite2.material as THREE.ShaderMaterial).uniforms.glowColor.value = new THREE.Color(this.glowColor)
  }

  @Watch('pointsFile', { immediate: true, deep: true })
  public pointsFileChange() {
    const url = this.pointsFile
    d3.json(url).then((points: any) => {
      this.$_points = points
      this.setPoints(points)
    })
  }

  @Watch('outlineFile', { immediate: true, deep: true })
  public outlineFileChange() {
    if (!this.outlineFile) {
      return
    }

    const url = this.outlineFile

    const globeTexture = new THREE.TextureLoader().load(url)
    globeTexture.needsUpdate = true
    this.globeInnerMesh.visible = true;
    (this.globeInnerMesh.material as THREE.MeshBasicMaterial).map = globeTexture
  }

  @Watch('pointSize', { immediate: true, deep: true })
  public pointSizeChange() {
    (this.pointsEarth.material as THREE.PointsMaterial).size = this.pointSize;
    (this.pointsEarth.material as THREE.PointsMaterial).needsUpdate = true
  }

  @Watch('radius', { immediate: true, deep: true })
  public radiusChange() {
    this.object3D.scale.x = this.radius / 200
    this.object3D.scale.y = this.radius / 200
    this.object3D.scale.z = this.radius / 200
  }

  @Watch('outlineColor', { immediate: true, deep: true })
  public outlineColorChange() {
    (this.globeInnerMesh.material as THREE.MeshBasicMaterial).color = new THREE.Color(this.outlineColor)
  }

  public rotateTo(lng: number, lat: number) {
    this.run = false

    const coords = {
      x: this.object3D.rotation.x,
      y: this.object3D.rotation.y,
    }

    new TWEEN.Tween(coords)
      .to({
        x: (lat / 180) * Math.PI,
        y: -(lng / 180) * Math.PI,
      }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.object3D.rotation.x = coords.x
        this.object3D.rotation.y = coords.y
      })
      .start(0)

  }

  public startRun() {
    this.run = true

    const coords = {
      x: this.object3D.rotation.x,
    }

    new TWEEN.Tween(coords)
      .to({
        x: 10 * Math.PI / 180,
      }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.object3D.rotation.x = coords.x
      })
      .start(0)
  }

  public setPoints(points: any[]) {
    const pointsEarth = this.pointsEarth
    const geometry = pointsEarth.geometry as THREE.BufferGeometry

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points.length / 2 * 3), 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(points.length / 2 * 3), 3))

    const vertices = geometry.attributes.position.array as number[]
    const colors = geometry.attributes.color.array as number[]

    const color1 = new THREE.Color(this.color1)
    const color2 = new THREE.Color(this.color2)
    const color3 = new THREE.Color(this.color3)

    function randomColor(c1: number, c2: number, t?: number) {
      let tt = Math.random()
      if (t !== undefined) {
        tt = t
      }
      return c1 * tt + c2 * (1 - tt)
    }

    for (let i = 0; i < points.length / 2; i++) {
      const lng = points[i * 2]
      const lat = points[i * 2 + 1]
      const isFace = Math.random() > this.pointRatio
      const r = isFace ? 200 : 200 - 200 * bezierEasing(Math.random())
      let x = 0
      let y = 0
      let z = 0

      y = Math.sin(lat / 180 * Math.PI) * r
      const r0 = Math.cos(lat / 180 * Math.PI) * r

      x = Math.sin(lng / 180 * Math.PI) * r0
      z = Math.cos(lng / 180 * Math.PI) * r0

      vertices[i * 3 + 0] = x
      vertices[i * 3 + 1] = y
      vertices[i * 3 + 2] = z

      if (isFace) {
        colors[i * 3 + 0] = color3.r
        colors[i * 3 + 1] = color3.g
        colors[i * 3 + 2] = color3.b
      } else {
        colors[i * 3 + 0] = randomColor(color1.r, color2.r, 1 - r / 200)
        colors[i * 3 + 1] = randomColor(color1.g, color2.g, 1 - r / 200)
        colors[i * 3 + 2] = randomColor(color1.b, color2.b, 1 - r / 200)
      }
    }
    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true
  }

  public beforeRenderScene() {
    if (!this.run) {
      return
    }

    this.object3D.rotation.y += 0.0025
    if (this.object3D.rotation.y > Math.PI * 2) {
      this.object3D.rotation.y -= Math.PI * 2
    }
  }

  public beforeDestroy() {
    const map = (this.globeInnerMesh.material as THREE.MeshBasicMaterial).map
    if (map) {
      map.dispose()
    }
    this.glowSprite.geometry.dispose()
    this.glowSprite2.geometry.dispose()
  }
}
