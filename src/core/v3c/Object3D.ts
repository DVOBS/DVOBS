import * as THREE from 'three';
import { Component, Prop, Provide, Inject, Vue, Watch } from 'vue-property-decorator';

type XYZ = [number, number, number];

function xyzDefaultValueFn(defaultValue = 0): () => XYZ {
  return () => {
    return [defaultValue, defaultValue, defaultValue];
  };
}

@Component({ name: 'Object3D' })
export default class Object3D extends Vue {

  @Provide('parentObject3D')
  public get object3D(): THREE.Object3D {
    return new THREE.Object3D();
  }
  public name = 'Object3D';

  @Inject() public renderBus!: Vue;
  @Inject({ default: null }) public parentObject3D!: THREE.Object3D;
  @Prop({ default: xyzDefaultValueFn(0) }) private position!: XYZ;
  @Prop({ default: xyzDefaultValueFn(0) }) private rotation!: XYZ;
  @Prop({ default: xyzDefaultValueFn(1) }) private scale!: XYZ;

  public render(createElement: any) {
    if (this.parentObject3D) {
      this.parentObject3D.add(this.object3D);
    }
    return createElement('span', { style: { display: 'none' } }, this.$slots.default);
  }

  @Watch('position', { immediate: true, deep: true })
  public updatePosition() {
    const object3D = this.object3D;
    const [x, y, z] = this.position;
    if (object3D) {
      object3D.position.x = Number(x);
      object3D.position.y = Number(y);
      object3D.position.z = Number(z);
    }
  }

  @Watch('scale', { immediate: true, deep: true })
  public updateScale() {
    const object3D = this.object3D;
    const [x, y, z] = this.scale;
    if (object3D) {
      object3D.scale.x = Number(x);
      object3D.scale.y = Number(y);
      object3D.scale.z = Number(z);
    }
  }

  @Watch('rotation', { immediate: true, deep: true })
  public updateRotation() {
    const object3D = this.object3D;
    const [x, y, z] = this.rotation;
    if (object3D) {
      object3D.rotation.x = Number(x);
      object3D.rotation.y = Number(y);
      object3D.rotation.z = Number(z);
    }
  }

  public lookAt(x: number | THREE.Vector3, y: number, z: number) {
    if (!this.object3D) {
      return;
    }
    this.object3D.lookAt(x, y, z);
    this.$emit('update:rotation', this.object3D.rotation);
  }

  public mounted() {
    this.renderBus.$on('beforeRenderScene', this.beforeRenderScene);
  }

  public beforeDestroy() {
    if (this.parentObject3D && this.object3D) {
      this.parentObject3D.remove(this.object3D);
    }
    this.renderBus.$off('beforeRenderScene', this.beforeRenderScene);
  }

  public beforeRenderScene() {
    // DO NOTHING
  }
}
