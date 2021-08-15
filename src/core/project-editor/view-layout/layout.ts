export interface HorizontalLayoutNode {
  type: 'horizontal' | 'horizontal-root',
  basis: number,
  children: (VerticalLayoutNode | TabsLayoutNode | MainLayoutNode)[]
}

export interface VerticalLayoutNode {
  type: 'vertical',
  basis: number,
  children: (HorizontalLayoutNode | TabsLayoutNode | MainLayoutNode)[]
}

export interface TabsLayoutNode {
  type: 'tabs',
  basis: number,
  children: string[]
}

export interface MainLayoutNode {
  type: 'main',
  basis: number,
  name: string
}

export const defaultLayout: HorizontalLayoutNode = {
  type: 'horizontal',
  basis: 100,
  children: [
    {
      type: 'tabs',
      basis: 20,
      children: ['file-explorer', 'widget-library', 'hierarchy']
    }, {
      type: 'vertical',
      basis: 60,
      children: [
        {
          type: 'main',
          basis: 75,
          name: 'object-eidtor-tabs'
        }, {
          type: 'tabs',
          basis: 25,
          children: ['console']
        }
      ]
    }, {
      type: 'tabs',
      basis: 20,
      children: ['property-inspector', 'data-inspector']
    }
  ]
}