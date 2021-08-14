<template>
  <span class="NameEditor" :class="error? 'error' : ''">
    <span
      class="value"
      v-show="!inputShowed"
    >{{ value }}
    </span>

    <input
      v-show="inputShowed"
      ref="input"
      type="text"
      v-model="innerValue"
      @blur="handelBlur"
      @keydown.enter="handleEnter"
      @keydown.esc="handeleEsc"
      @keydown.stop
    >
    <div v-if="error && inputShowed" class="error">{{ error }}</div>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import DirectoryItem from './DirectoryItem.vue';
import ProjectDirectory from '@/core/model/ProjectDirectory'
import ProjectFile from '@/core/model/ProjectFile'

function isValidFileName (fileName: string) {
  if (!fileName && fileName.length <= 255) {
    return false
  } else {
    const regExp = /[^\s\\/:*?"<>|]?(\x20|[^\s\\/:*?"<>|])*[^\s\\/:*?"<>|.]$/;
    return fileName.match(regExp)
  }
}

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class NameEditor extends Vue {
  @Prop({ type: String, required: true })
  public value!: string;

  public innerValue = '123';
  public inputShowed = false;

  public get error () {
    if (!isValidFileName(this.innerValue)) {
      return '文件名不合法'
    }

    const parentDirectoryItem = this.$parent as DirectoryItem;
    const siblings = parentDirectoryItem.siblings

    if (
      siblings.find((d: ProjectDirectory | ProjectFile) => {
        return d.name === this.innerValue
      })
    ) {
      return '当前位置已存在文件夹或文件' + this.innerValue
    }

    return ''
  }

  @Watch('inputShowed')
  public inputShowedChange () {
    if(!this.inputShowed) {
      this.$emit('hidden')
    }
  }

  public startInput () {
    this.inputShowed = true
    this.$nextTick(() => {
      this.innerValue = this.value;
      (this.$refs.input as HTMLElement).focus()
    })
  }

  public handleIconClick () {
    this.startInput()
  }

  public handleEnter () {
    if (this.error) {
      return
    }
    this.inputShowed = false
  }

  public handeleEsc () {
    (this.$refs.input as HTMLElement).blur()
  }

  public handelBlur() {
    (this.$el as HTMLElement).scrollTo(0, 0)
    if (this.value !== this.innerValue && !this.error) {
      this.changeName()
    }
    this.innerValue = this.value
    window.setTimeout(() => {
      this.inputShowed = false
    })
  }

  public changeName() {
    this.$emit('input', this.innerValue);
  }

  public created () {
    this.innerValue = this.value
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
$error-color: #a01717;
.NameEditor {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  margin-left: -1px;
  .edit-icon {
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 0px;
    margin-left: 5px;
    cursor: pointer;
    width: 10px;
    height: 10px;
  }

  .value {
    display: inline-block;
    padding-left: 1px;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .input-div {
    display: inline-block;
  }

  input {
    border: $primary-color-lighten solid 1px;
    width: 100%;
    height: 26px;
    line-height: 26px;
    background: transparent;
    outline: none;
    color: $text-color;
    font-size: inherit;
    line-height: inherit;
    padding: 0;
    font-family: initial;
  }

  &.error input {
    border-color: $error-color;
  }
  .error {
    position: relative;
    width: 100%;
    line-height: 18px;
    padding: 4px 0;
    padding-left: 5px;
    border: $error-color solid 1px;
    border-top: none;
    background: darken($error-color , 25%);
    color: $text-color;
    z-index: 10;
    white-space: break-spaces;
  }
}
</style>
