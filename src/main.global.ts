import Vue from 'vue'

import ElementUI from 'element-ui'
import PortalVue from 'portal-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import '@/assets/style/index.scss'

import {
  faFont,
  faMagic,
  faFolder,
  faFolderOpen,
  faChevronRight,
  faChevronDown,
  faTimes,
  faPlus,
  faArchway,
  faMehBlank,
  faChevronCircleRight,
  faChevronCircleDown,
  faPen,
  faCube,
  faEye,
  faLock,
  faCogs
} from '@fortawesome/free-solid-svg-icons'

import { faFile, faFileImage, faSquare } from '@fortawesome/free-regular-svg-icons'
import { faVuejs } from '@fortawesome/free-brands-svg-icons'

library.add(faFont)
library.add(faMagic)
library.add(faFile)
library.add(faFolder)
library.add(faFolderOpen)
library.add(faChevronRight)
library.add(faChevronDown)
library.add(faTimes)
library.add(faPlus)
library.add(faArchway)
library.add(faMehBlank)
library.add(faVuejs)
library.add(faChevronCircleRight)
library.add(faChevronCircleDown)
library.add(faPen)
library.add(faCube)
library.add(faEye)
library.add(faLock)
library.add(faSquare)
library.add(faFileImage)
library.add(faCogs)

Vue.use(PortalVue)
Vue.use(ElementUI)
Vue.component('font-awesome-icon', FontAwesomeIcon)
