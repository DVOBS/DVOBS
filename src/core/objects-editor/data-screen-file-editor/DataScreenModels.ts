import { getWidgetDefinition } from '@/core/widgets-data-screen'
import shortid from 'shortid'
import Vue from 'vue'
import { ASTElement } from 'vue-template-compiler'

function space(count: number) {
  return Array(count).fill(' ').join('')
}

function numberValue(val: string) {
  return Number(val)
}

function stringVlaue(str:string) {
  if (str.startsWith('"') && str.endsWith('"')) {
    const obj = JSON.parse(`{"value":${str}}`)
    return obj.value
  }
  return str
}

function valueOfAttr(str:string) {
  if (str.startsWith('"') && str.endsWith('"')) {
    const obj = JSON.parse(`{"value":${str}}`)
    return obj.value
  }
  if (!isNaN(Number(str))) {
    return Number(str)
  }
  if (str === 'true') {
    return true
  }
  if (str === 'false') {
    return false
  }
}

export class DataScreenConfig {
  public width = 1920
  public height = 1080
  public bgColor = '#888888'
  public bgImage = ''
  public widgetConfigs: WidgetConfig[] = []

  constructor(ast: ASTElement | undefined) {
    console.log(1)
    if (ast?.tag === 'DataScreen') {
      const attrs = ast.attrs || []
      for (const {name, value} of attrs) {
        switch (name) {
          case 'width':
            this.width = numberValue(value)
            break
          case 'height':
            this.height = numberValue(value)
            break
          case 'bgColor':
            this.bgColor = stringVlaue(value)
            break
          case 'bgImage':
            this.bgImage = stringVlaue(value)
            break
          default:
            break
        }
      }
      for (const child of ast.children) {
        if(child.type === 1 && (child.tag === 'Widget' || child.tag === 'WidgetGroup')) {
          const widgetConfig = new WidgetConfig(child)
          this.widgetConfigs.push(widgetConfig)
        }
      }
    } else {
      console.error((`Root element is not 'DataScreen'`))
    }
  }

  public generateCode() {
    let code = '<DataScreen\n'
    code += `${space(2)}:width="${this.width}"\n`
    code += `${space(2)}:height="${this.height}"\n`
    code += `${space(2)}:bgColor="${this.bgColor}"\n`
    code += `${space(2)}:bgImage="${this.bgImage}"\n`
    code += '>\n'
    for (const widgetConfig of this.widgetConfigs) {
      code += widgetConfig.generateCode(1)
    }
    code += '</DataScreen>\n'
    return code
  }
}

const anchorValues = [
  'left-top', 'center-top', 'right-top',
  'left-center', 'center', 'right-center',
  'left-bottom', 'center-bottom', 'right-bottom'
]

export class WidgetConfig {
  /** 组件名称 */
  public name = '组件';

  /** 组件ID */
  public id = shortid.generate()

  /** 组件ID */
  public parentId = ''

  /** WidgetTag */
  public widgetTag = ''

  /** 锚点的位置 */
  public anchor = 'left-top';

  /** x坐标 */
  public x = 0;

  /** y坐标 */
  public y = 0;

  /** 宽度 */
  public width = 100;

  /** 高度 */
  public height = 100;

   /** 实际宽度 */
  public runtimeWidth = 0

  /** 实际宽度 */
  public runtimeHeight = 0

  /** 锁定 */
  public lock = false

  /** 可见性 */
  public visible = true

  public attrs: any = {}

  public children:WidgetConfig[] = []

  public isGroup = false

  constructor(ast?: ASTElement) {
    if (ast?.tag === 'Widget' || ast?.tag === 'WidgetGroup') {
      const attrs = ast.attrs || []
      if (ast.ref) {
        this.id = stringVlaue(ast.ref)
      }
      for (const {name, value} of attrs) {
        switch (name) {
          case 'name':
            this.name = stringVlaue(value)
            break
          case 'x':
            this.x = numberValue(value)
            break
          case 'y':
            this.y = numberValue(value)
            break
          case 'width':
            this.width = numberValue(value)
            break
          case 'height':
            this.height = numberValue(value)
            break
          case 'visible':
            this.visible = valueOfAttr(value)
            break
          case 'lock':
            this.lock = valueOfAttr(value)
            break
          case 'anchor': {
            const anchor = valueOfAttr(value)
            if (anchorValues.indexOf(anchor) !== -1) {
              this.anchor = valueOfAttr(value)
            }
            break
          }
          default:
            break
        }
      }
      
      if (ast.tag === 'Widget') {
        if (ast.children.length === 1 && ast.children[0].type === 1) {
          this.setWidgetTag(ast.children[0].tag)
          const attrs = ast.children[0].attrs || []
          const attrsMap = new Map()

          for (const attr of attrs) {
            attrsMap.set(attr.name, valueOfAttr(attr.value))
          }

          const widgetDefinition = getWidgetDefinition(this.widgetTag)

          this.attrs = {}
          for (const propsGroup of widgetDefinition?.propsGroups || []) {
            for (const prop of propsGroup.props) {
              if (attrsMap.has(prop.key)) {
                Vue.set(this.attrs, prop.key, attrsMap.get(prop.key))
              } else {
                Vue.set(this.attrs, prop.key, prop.value)
              }
            }
          }
        } else {
          console.error((`Widget element must has one child'`))
        }
      }

      if (ast.tag === 'WidgetGroup') {
        this.isGroup = true
        for (const child of ast.children) {
          if(child.type === 1 && (child.tag === 'Widget' || child.tag === 'WidgetGroup')) {
            const widgetConfig = new WidgetConfig(child)
            widgetConfig.parentId = this.id
            this.children.push(widgetConfig)
          }
        }
      }
    } else {
      console.error((`Root element is not 'DataScreen'`))
    }
  }

  public setWidgetTag(tag: string) {
    this.widgetTag = tag
    this.attrs = {}
    const widgetDefinition = getWidgetDefinition(tag)
    for (const propsGroup of widgetDefinition?.propsGroups || []) {
      for (const prop of propsGroup.props) {
        Vue.set(this.attrs, prop.key, prop.value)
      }
    }
  }

  public generateCode(depth: number) {
    const tag = this.isGroup ? 'WidgetGroup' : 'Widget'
    const widgetTag = this.widgetTag
    const widgetDefinition = getWidgetDefinition(widgetTag)
    let code = `${space(depth * 2)}<${tag}\n`
    code += `${space(depth * 2 + 2)}name="${this.name}"\n`
    code += `${space(depth * 2 + 2)}ref="${this.id}"\n`
    code += `${space(depth * 2 + 2)}:visible="${this.visible}"\n`
    code += `${space(depth * 2 + 2)}:lock="${this.lock}"\n`
    if (!this.isGroup && !widgetDefinition?.autoSize) {
      code += `${space(depth * 2 + 2)}:width="${this.width}"\n`
      code += `${space(depth * 2 + 2)}:height="${this.height}"\n`
    }
    code += `${space(depth * 2 + 2)}:x="${this.x}"\n`
    code += `${space(depth * 2 + 2)}:y="${this.y}"\n`
    code += `${space(depth * 2 + 2)}anchor="${this.anchor}"\n`
    code += `${space(depth * 2)}>\n`
    if (this.isGroup) {
      for (const widgetConfig of this.children) {
        code += widgetConfig.generateCode(depth + 1)
      }
    } else if(widgetTag) {
      code += `${space(depth * 2 + 2)}<${widgetTag}\n`
      for (const propsGroup of widgetDefinition?.propsGroups || []) {
        for (const prop of propsGroup.props) {
          const key = prop.key
          const value = (
            this.attrs[key] !== null &&
            this.attrs[key] !== undefined
          ) ? this.attrs[key] : prop.value
          switch (prop.type) {
            case 'number':
              code += `${space(depth * 2 + 4)}:${key}="${value}"\n`
              break
            default:
              code += `${space(depth * 2 + 4)}${key}="${value}"\n`
              break
          }
        }
      }
      code += `${space(depth * 2 + 2)}><${widgetTag}/>\n`
    }
    code += `${space(depth * 2)}</${tag}>\n`
    return code
  }
}

export function transformVueAstToDataScreen(ast: ASTElement) {
  return new DataScreenConfig(ast)
}
