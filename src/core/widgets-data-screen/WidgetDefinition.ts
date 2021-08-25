import Vue from 'vue'

export interface Prop {
  type: 'string' | 'number' | 'color';
  name: string;
  key: string;
  value: unknown;
  max?: number;
  min?: number;
  step?: number;
}

export interface PropsGroup {
  name: string;
  prop?: string;
  defaultValue?: boolean;
  props: Prop[];
}

export interface WidgetDefinition {
  /** 控件类的 TAG */
  tag: string;
  /** 控件类的显示名称 */
  displayName: string;
  /* 自动尺寸 */
  autoSize?: boolean;
  /* 控件的 Vue Component */
  component: Vue.Component;
  /* 属性分组 */
  propsGroups?: PropsGroup[];
}
