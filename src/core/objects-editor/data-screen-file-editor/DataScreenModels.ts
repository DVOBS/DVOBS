import shortid from 'shortid'
import { ASTElement } from 'vue-template-compiler'

function space(count: number) {
  return Array(count).fill(' ').join('')
}

function numberValue(val: string) {
  return Number(val)
}

function stringVlaue(str:string) {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1,-1)
  }
  return str
}

export class DataScreenConfig {
  public width = 1920
  public height = 1080
  public bgColor = '#888888'
  public bgImage = ''
  public widgetConfigs: WidgetConfig[] = []

  constructor(ast: ASTElement | undefined) {
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

export class WidgetConfig {
  /** 组件名称 */
  public name = '组件';

  /** 组件ID */
  public id = shortid.generate()

  /** 组件ID */
  public parentId = ''

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

  public details = {}

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
          default:
            break
        }
      }
      
      if (ast.tag === 'Widget') {
        //
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

  public generateCode(depth: number) {
    const tag = this.isGroup ? 'WidgetGroup' : 'Widget'
    let code = `${space(depth * 2)}<${tag}\n`
    code += `${space(depth * 2 + 2)}name="${this.name}"\n`
    code += `${space(depth * 2 + 2)}ref="${this.id}"\n`
    code += `${space(depth * 2 + 2)}:x="${this.x}"\n`
    code += `${space(depth * 2 + 2)}:y="${this.y}"\n`
    code += `${space(depth * 2 + 2)}:width="${this.width}"\n`
    code += `${space(depth * 2 + 2)}:height="${this.height}"\n`
    code += `${space(depth * 2)}>\n`
    for (const widgetConfig of this.children) {
      code += widgetConfig.generateCode(depth + 1)
    }
    code += `${space(depth * 2)}</${tag}>\n`
    return code
  }
}

export function transformVueAstToDataScreen(ast: ASTElement) {
  return new DataScreenConfig(ast)
}