<template>
  <ProjectEditor class="ProjectEditorPage"></ProjectEditor>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'

@Component({
  components: { ProjectEditor }
})
export default class ProjectEditorPage extends Vue {
}
</script>
