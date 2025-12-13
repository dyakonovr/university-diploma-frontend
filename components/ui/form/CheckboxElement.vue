<template>
  <label
    class="el-checkbox"
    :class="{ 'is-checked': model, 'is-disabled': disabled }">
    <span
      v-if="label"
      class="el-checkbox__label text-14 weight-500">
      {{ label }}
    </span>
    <span class="el-checkbox__input">
      <input
        v-model="model"
        type="checkbox"
        class="el-checkbox__original"
        :disabled="disabled">
      <span class="el-checkbox__inner">
        <check-icon class="el-checkbox__inner-after" />
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
import CheckIcon from '~/assets/images/icons/check.svg';

interface Props {
  label: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false
});

const model = defineModel<boolean>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.el-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-right: 30px;
  transition: all 0.2s ease;

  &:hover:not(.is-disabled) .el-checkbox__inner {
    border-color: colors.$primary-normal;
  }
}

.el-checkbox.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.el-checkbox__input {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  line-height: 1;
  vertical-align: middle;
}

.el-checkbox__original {
  opacity: 0;
  position: absolute;
  margin: 0;
  width: 0;
  height: 0;
  z-index: -1;
}

.el-checkbox__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  transition: all 0.2s ease;
}

.el-checkbox__inner-after {
  position: absolute;
  width: 14px;
  height: 14px;
  background-image: url("/assets/images/icons/check.svg");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  transform: scale(0);
  transition: transform 0.15s ease;
}

.el-checkbox.is-checked {
  .el-checkbox__inner {
    color: colors.$white;
    background-color: colors.$primary-normal;
    border-color: colors.$primary-normal;
    
    .el-checkbox__inner-after {
      transform: scale(1);
      transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6);
    }
  }
}

.el-checkbox.is-disabled {
  .el-checkbox__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
  }
  
  &.is-checked .el-checkbox__inner {
    background-color: #f0f2f5;
  }
}

.el-checkbox__label {
  padding-right: 8px;
  font-size: 14px;
  line-height: 1.4;
  transition: color 0.2s ease;
}
</style>