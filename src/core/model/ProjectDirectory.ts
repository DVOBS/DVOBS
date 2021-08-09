import { JsonObject, JsonProperty } from 'json2typescript'
import ProjectFile from './ProjectFile';

@JsonObject('Directory')
export default class ProjectDirectory {
  /** 应用名称 */
  @JsonProperty('name', String, true)
  public name = '/';

  @JsonProperty('directorys', [ProjectDirectory], true)
  public directorys: ProjectDirectory[] =[]

  @JsonProperty('files', [ProjectFile], true)
  public files: ProjectFile[] =[]
}
