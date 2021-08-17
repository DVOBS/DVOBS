<template>
  <span
    class="TxtEditor"
    @dblclick="handleDbclick"
    :title="triggerMode === 'dbclick' ? '双击编辑' : ''"
  >
    <span
      class="value"
      v-if="!inputShowed"
    >{{ value }}
    </span>

    <input
      v-show="inputShowed"
      ref="input"
      type="text"
      v-model="innerValue"
      @blur="inputValue"
      @keypress.enter="inputValue"
      @keypress.esc="inputValue"
      @keydown.stop
      @dblclick.stop
      :placeholder="placeholder"
    >
    <font-awesome-icon
      v-if="triggerMode === 'button'"
      v-show="!inputShowed"
      class="edit-icon"
      :title="editBtnTitle"
      :icon="['fas', 'pen']"
      @click="handleIconBtnClick"
    />
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class TxtEditor extends Vue {
  @Prop({ type: String, required: true })
  public value!: string;

  @Prop({ type: String, required: false, default: '' })
  public editBtnTitle!: string;

  @Prop({ type: String, required: false, default: '' })
  public defaultText!: string;

  @Prop({ type: String, required: false, default: 'button' })
  public triggerMode!: string // button dbclick

  @Prop({ type: String, required: false, default: '' })
  public placeholder!: string;

  public innerValue = '';
  public inputShowed = false;

  public startInput () {
    this.inputShowed = true
    this.$nextTick(() => {
      this.innerValue = this.value;
      (this.$refs.input as HTMLElement).focus()
    })
  }

  public handleIconBtnClick () {
    this.startInput()
  }

  public handleDbclick() {
    if (this.triggerMode === 'dbclick') {
      this.startInput()
    }
  }

  public inputValue () {
    this.inputShowed = false
    this.$emit('input', this.innerValue || this.defaultText);
    (this.$el as HTMLElement).scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.TxtEditor {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  padding-right: 20px;
  width: 100%;
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
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .input-div {
    display: inline-block;
  }

  input {
    border: none;
    width: 100%;
    background: transparent;
    outline: none;
    color: $text-color;
    font-size: inherit;
    line-height: inherit;
    padding: 0;
    font-family: initial;
  }
}
</style>
