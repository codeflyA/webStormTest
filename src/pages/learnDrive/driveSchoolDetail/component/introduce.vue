<script setup lang="ts">
interface IntroItem {
  introduction: string;
}

interface Props {
  instro: IntroItem[];
}

const props = defineProps<Props>();
</script>

<template>
  <view class="introduce">
    <up-text :text="instro[0]?.introduction || '暂无相关简介'" />
  </view>
</template>

<style lang="scss" scoped>
.introduce {
  background-color: white;
  height: 100%;
}
</style>
