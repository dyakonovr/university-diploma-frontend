<template>
  <label
    class="el-switch"
    :class="{ 'is-checked': model }">
    <span
      v-if="label"
      class="el-switch__label">
      {{ label }}
    </span>
    <input
      v-model="model"
      type="checkbox"
      class="el-switch__input"
    >
    <span
      class="el-switch__core"
      :class="{ 'active': model }">
      <span class="el-switch__button"/>
    </span>
  </label>
</template>

<script setup lang="ts">
type Props = {
  label?: string;
}

defineProps<Props>();

const model = defineModel<boolean>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.el-switch {
  display: flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  vertical-align: middle;
  cursor: pointer;
}

.el-switch.is-checked .el-switch__button {
  transform: translateX(20px);
}

.el-switch__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
}

.el-switch__core {
  margin: 0;
  display: inline-block;
  position: relative;
  width: 40px;
  height: 25px;
  border: 1px solid;
  border-radius: 100px;
  box-sizing: border-box;
  cursor: pointer;
  border-color: colors.$gray-300;
  background-color: colors.$gray-300;
  transition: border-color .3s, background-color .3s;

  &.active {
    border-color: colors.$primary-normal;
    background-color: colors.$primary-normal;
  }
}

.el-switch__button {
  position: absolute;
  top: 3px;
  left: 1px;
  border-radius: 100%;
  transition: transform .3s;
  width: 16px;
  height: 16px;
  background-color: #FFF;
}

.el-switch__label {
  margin-right: 10px;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.el-switch__label.is-left {
  margin-right: 10px;
  margin-left: 0;
}
</style>