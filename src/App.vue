<script lang="ts" setup>
import {ref} from "vue";
import {ElTree} from "element-plus";

const personnelTreeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'isLeaf',
}

function handleNodeClick() {
}

function loadNode() {
}
</script>

<template>
  <el-tree
      ref="personnelTreeRef"
      :load="loadNode"
      :props="defaultProps"
      lazy
      node-key="id"
      @node-click="handleNodeClick"
  >
  </el-tree>
</template>

<style scoped>

</style>
