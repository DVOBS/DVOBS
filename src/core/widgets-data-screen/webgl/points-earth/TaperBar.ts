import Object3D from '@/core/v3c/Object3D'
import * as THREE from 'three';
import { Component, Prop, Watch } from 'vue-property-decorator';

// const globeBufferGeometry = new THREE.SphereBufferGeometry(200, 64, 64);

@Component({ name: 'TaperBar' })
export default class TaperBar extends Object3D {

  @Prop(String) public readonly color!: string;
  @Prop(Number) public readonly value!: number;

  get object3D() {
    const material = new THREE.PointsMaterial({
      size: 0.6,
      fog: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const geometry = new THREE.BufferGeometry();
    const cube = new THREE.Points( geometry, material );
    return cube;
  }

  @Watch('value', { immediate: true })
  @Watch('color')
  public valueChange() {
    const color = new THREE.Color(this.color);
    const pointCount = Math.floor(this.value) + 10;
    const geometry = this.object3D.geometry as THREE.BufferGeometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3));
    const vertices = geometry.attributes.position.array as number[];
    const colors = geometry.attributes.color.array as number[];

    const R = 1.5;
    const H = this.value;
    for (let i = 0; i < pointCount; i++) {
      const r = 1 * Math.random() * Math.random();
      const a = 2 * Math.PI * Math.random();
      const h = 1 - r;

      vertices[i * 3 + 0] = r * Math.sin(a) * R;
      vertices[i * 3 + 2] = -Math.random() * Math.pow(h, 2) * H;
      vertices[i * 3 + 1] = r * Math.cos(a) * R;

      colors[i * 3 + 0] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  public beforeRenderScene() {
    this.object3D.lookAt(0, 0, 0);
  }

  public beforeDestroy() {
    this.object3D.geometry.dispose();
  }
}
