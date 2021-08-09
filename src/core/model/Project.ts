import { JsonObject, JsonProperty } from 'json2typescript'
import ProjectDirectory from './ProjectDirectory';

@JsonObject('ProjectData')
export default class Project {
  /** 应用名称 */
  @JsonProperty('name', String, true)
  public name = '应用';

  @JsonProperty('rootDirectory', ProjectDirectory, true)
  public rootDirectory: ProjectDirectory = new ProjectDirectory()
}
