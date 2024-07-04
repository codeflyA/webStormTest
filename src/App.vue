<script lang="ts" setup>
import {ref} from "vue";
import {ElTree,ElTreeV2} from "element-plus";
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
const list = ['a', 'b', 'c', 'd']

const isCheckAll = ref(false);
const checkedResult = ref(['a', 'b', 'd']);
const isIndeterminate = ref(true);

const checkAllChange = (val: boolean) => {
  checkedResult.value = val ? list : []
  isIndeterminate.value = false
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
  <van-checkbox
      v-model="isCheckAll"
      :indeterminate="isIndeterminate"
      @change="checkAllChange"
  >
    全选
  </van-checkbox>
</template>

<style scoped>

</style>
