import shortid from "shortid";

export interface HorizontalLayoutNode {
  id: string,
  type: 'horizontal' | 'horizontal-root',
  basis: number,
  children: (VerticalLayoutNode | TabsLayoutNode | MainLayoutNode)[]
}

export interface VerticalLayoutNode {
  id: string,
  type: 'vertical',
  basis: number,
  children: (HorizontalLayoutNode | TabsLayoutNode | MainLayoutNode)[]
}

export interface TabsLayoutNode {
  id: string,
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
  id: shortid.generate(),
  type: 'horizontal',
  basis: 100,
  children: [
    {
      id: shortid.generate(),
      type: 'tabs',
      basis: 20,
      children: ['file-explorer', 'widget-library', 'hierarchy']
    }, {
      id: shortid.generate(),
      type: 'vertical',
      basis: 60,
      children: [
        {
          type: 'main',
          basis: 75,
          name: 'object-eidtor-tabs'
        }, {
          id: shortid.generate(),
          type: 'tabs',
          basis: 25,
          children: ['console']
        }
      ]
    }, {
      id: shortid.generate(),
      type: 'tabs',
      basis: 20,
      children: ['property-inspector', 'data-inspector']
    }
  ]
}