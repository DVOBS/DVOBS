import Object3D from '@/core/v3c/Object3D'
import * as THREE from 'three'
import { Component, Prop, Watch } from 'vue-property-decorator'
import * as d3 from 'd3'
import TWEEN from '@tweenjs/tween.js'

const globeRadius = 200

function checkDistance(a: {x :number, y: number, z: number }, b: {x :number, y: number, z: number }) {
  return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y) + (b.z - a.z) * (b.z - a.z))
}

function latLongToVector3(lng: number, lat: number, height: number) {
  const r = globeRadius + height
  let x = 0
  let y = 0
  let z = 0

  y = Math.sin(lat / 180 * Math.PI) * r
  const r0 = Math.cos(lat / 180 * Math.PI) * r

  x = Math.sin(lng / 180 * Math.PI) * r0
  z = Math.cos(lng / 180 * Math.PI) * r0

  return new THREE.Vector3(x, y, z)
}

@Component({ name: 'ThreeArcsSnake' })
export default class ThreeArcsSnake extends Object3D {
  @Prop(Number) public readonly lat!: number
  @Prop(Number) public readonly lng!: number
  @Prop(Number) public readonly toLat!: number
  @Prop(Number) public readonly toLng!: number
  @Prop(Boolean) public readonly show!: boolean
  @Prop(String) public readonly color!: string

  private isShowen = true
  private t: number = Math.random() * 150

  get object3D() {
    const group = new THREE.Group()

    group.add(this.arcSnakeMesh)
    return group
  }

  get arcSnakeMesh() {
    const p4 = latLongToVector3(this.toLng, this.toLat, 0)
    const p1 = latLongToVector3(this.lng, this.lat, 0)

    const tempArcHeightMid = 1 + (checkDistance(p1, p4) * 0.00155)
    const pMid = new THREE.Vector3()
    pMid.addVectors(p1, p4)
    pMid.normalize().multiplyScalar(globeRadius * tempArcHeightMid)

    const tempArcHeight = 1 + (checkDistance(p1, pMid) * 0.00155)
    const p2 = new THREE.Vector3()
    p2.addVectors(p1, pMid)
    p2.normalize().multiplyScalar(globeRadius * tempArcHeight)

    const p3 = new THREE.Vector3()
    p3.addVectors(pMid, p4)
    p3.normalize().multiplyScalar(globeRadius * tempArcHeight)

    const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4)

    const curveVertices = curve.getPoints(50)
    const arcSnakeVerticesArray = []
    for (let j = 0; j <= 50; j++) {
      arcSnakeVerticesArray.push(curveVertices[j])
    }

    const arcSnakeBufferGeometry = new THREE.BufferGeometry()
    const arcSnakeShaderUniforms = {
      color: {
        value: new THREE.Color(0x00ffff),
      },
      fogColor: {
        type: 'c',
        value: new THREE.Color(0xffffff),
      },
      fogNear: {
        type: 'f',
        value: 0.1,
      },
      fogFar: {
        type: 'f',
        value: 4000,
      },
    }
    const arcSnakeShaderMaterial = new THREE.ShaderMaterial({
      uniforms: arcSnakeShaderUniforms,
      vertexShader: `
      attribute float alpha;
      varying float vAlpha;

      void main() {
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;

        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;

        void main() {
          gl_FragColor = vec4( color, 1.0 );
          gl_FragColor = vec4(  color, vAlpha );

          #ifdef USE_FOG
            #ifdef USE_LOGDEPTHBUF_EXT
              float depth = gl_FragDepthEXT / gl_FragCoord.w;
            #else
              float depth = gl_FragCoord.z / gl_FragCoord.w;
            #endif
              float fogFactor = smoothstep( fogNear, fogFar, depth );
              gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
          #endif
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      fog: true,
      transparent: true,
    })

    const positions = new Float32Array(arcSnakeVerticesArray.length * 3)
    const alphas = new Float32Array(arcSnakeVerticesArray.length)

    for (let i = 0; i < arcSnakeVerticesArray.length; i++) {
      positions[i * 3] = arcSnakeVerticesArray[i].x
      positions[i * 3 + 1] = arcSnakeVerticesArray[i].y
      positions[i * 3 + 2] = arcSnakeVerticesArray[i].z
      alphas[i] = 1
    }

    arcSnakeBufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    arcSnakeBufferGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
    const arcSnakeMesh = new THREE.Line(arcSnakeBufferGeometry, arcSnakeShaderMaterial)

    return arcSnakeMesh
  }

  public beforeRenderScene() {
    if (this.isShowen) {
      this.t += 0.75
      if (this.t > 150) {
        this.t = 0
      }

      const bufferGeometry = this.arcSnakeMesh.geometry as THREE.BufferGeometry
      const alphas = bufferGeometry.attributes.alpha.array as number[]

      for (let i = 0; i < alphas.length; i++) {
        alphas[i] = Math.abs(i - this.t) < 3 ? (3 - Math.abs(i - this.t)) / 3 + 0.1 : 0.1
      }
      (bufferGeometry.attributes.alpha as THREE.BufferAttribute).needsUpdate = true
    }
  }

  @Watch('color', { immediate: true, deep: true })
  public colorChange() {
    (this.arcSnakeMesh.material as THREE.ShaderMaterial).uniforms.color.value = new THREE.Color(this.color)
  }
}
