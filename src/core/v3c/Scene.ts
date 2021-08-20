import * as THREE from 'three';
import { Component, Provide, Vue } from 'vue-property-decorator';

@Component({ name: 'Scene' })
export default class Scene extends Vue {
  public $requestAnimationFrameId = 0;
  public timestamp = 0;
  @Provide() public renderBus = new Vue();

  get renderer(): THREE.Renderer {
    const webGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    webGLRenderer.autoClear = false;
    webGLRenderer.setClearColor(new THREE.Color(0x000000) , 0);
    return webGLRenderer;
  }

  get camera(): THREE.Camera {
    const camera = new THREE.PerspectiveCamera(75);
    camera.position.z = 5;
    return camera;
  }

  @Provide('parentObject3D') get scene(): THREE.Scene {
    const scene = new THREE.Scene();
    return scene;
  }

  public render(createElement: any) {
    return createElement('div', this.$slots.default);
  }

  public beforeRenderScene() { /** */ }

  public renderScene(timestamp?: any) {
    this.timestamp = timestamp;
    this.$requestAnimationFrameId = requestAnimationFrame(this.renderScene);

    const renderer = this.renderer;
    const camera: THREE.PerspectiveCamera = this.camera as THREE.PerspectiveCamera;
    const scene = this.scene;

    this.scene.add(camera);

    const width = this.$el.clientWidth;
    const height = this.$el.clientHeight;

    const x = 0;
    const y = 0;
    const aspect = (width + x) / (height + y);
    camera.setViewOffset (width + x, height + y, x, y, width, height);

    if (renderer && scene && camera) {
      renderer.setSize(width, height);

      if (camera.aspect !== aspect) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
      
      this.beforeRenderScene()
      this.renderBus.$emit('beforeRenderScene');

      renderer.render(
        scene,
        camera,
      );
    }
  }

  public mounted() {
    const renderer = this.renderer;
    if (renderer) {
      renderer.domElement.style.display = 'block';
      this.$el.append(renderer.domElement);
    }
    requestAnimationFrame(this.renderScene);
  }

  public destroy() {
    if (this.$requestAnimationFrameId) {
      cancelAnimationFrame(this.$requestAnimationFrameId);
    }
  }
}
