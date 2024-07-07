<template>
  <div class="ElectronicFenceMapDestAbnormal">
    <div class="ElectronicFenceMapDestAbnormalItem" @click="showTable">123</div>
  </div>
</template>

<script lang="ts" setup>
import {
  mobileFenceSetNotify,
  MobileFenceVehicleDestAbnormalData,
} from '@/views/electronicFence/assets'
import {showConfirmDialog} from 'vant'
import {ref} from "vue";

let showElectronicFenceMapDestAbnormalTable = ref(false)
const emits = defineEmits<{
  showDestAbnormalPosition: [value: MobileFenceVehicleDestAbnormalData[]]
}>()

function showTable() {
  showElectronicFenceMapDestAbnormalTable.value = true
}
let notice = ref(false)

function NotifyWhenEnterFence() {
  if (notice.value) {
    showConfirmDialog({
      title: '123',
      message: '',
      confirmButtonText: '123',
      confirmButtonColor: '#0052D9',
      cancelButtonText: '123',
      beforeClose,
    })
  }
}

async function beforeClose(action) {
  if (action === 'confirm') {
    return 123
  } else {
    return true
  }
}
</script>

<style lang="scss" scoped>
.ElectronicFenceMapDestAbnormal {

}
</style>
