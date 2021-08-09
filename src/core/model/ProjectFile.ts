import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject('ProjectFile')
export default class ProjectFile {
  /** 应用名称 */
  @JsonProperty('name', String, true)
  public name = 'newFile';

  @JsonProperty('content', String, true)
  public content = ''

  @JsonProperty('base64', String, true)
  public base64 = ''
}
