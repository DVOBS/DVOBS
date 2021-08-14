import { JsonObject, JsonProperty } from 'json2typescript'
import shortid from 'shortid'
import EditableObject from './EditableObject'

@JsonObject('ProjectFile')
export default class ProjectFile implements EditableObject {
  @JsonProperty('id', String, true)
  public id = shortid.generate()

  @JsonProperty('name', String, true)
  public name = 'newFile';

  @JsonProperty('base64', String, true)
  public base64 = ''
}
