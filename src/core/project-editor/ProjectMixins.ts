import { Component, Vue } from 'vue-property-decorator'
import Project from '../model/Project'

@Component
export default class ProjectMixins extends Vue {
  public project: Project | null = null
}