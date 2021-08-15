import Vue from "vue";

const vnodes: {
  [index: string]: Vue.VNode;
} = {} 

export default Vue.observable({ vnodes })