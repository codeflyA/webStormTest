<template>
  <div class="ElectronicFenceMapDestAbnormal">
    <div class="ElectronicFenceMapDestAbnormalItem" @click="showTable">123</div>
  </div>
</template>

<script lang="ts" setup>
import {
  getMobileFenceVehicleDestAbnormal,
  mobileFenceGetNotify,
  mobileFenceSetNotify,
  MobileFenceVehicleDestAbnormalData,
} from '@/views/electronicFence/assets'
import {closeDialog, showConfirmDialog} from 'vant'
import {ref} from "vue";

let showElectronicFenceMapDestAbnormalTable = ref(false)

export interface Props {
  fenceId: number | undefined
  fenceName: string
  follow: boolean
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  showDestAbnormalPosition: [value: MobileFenceVehicleDestAbnormalData[]]
}>()

function showTable() {
  showElectronicFenceMapDestAbnormalTable.value = true
}

let mobileFenceVehicleDestAbnormalPosition = ref<MobileFenceVehicleDestAbnormalData[]>()

async function getDestAbnormalPosition() {
  if (props.fenceId) {
    let res = await getMobileFenceVehicleDestAbnormal({id: props.fenceId})
    mobileFenceVehicleDestAbnormalPosition.value = res.data
    emits('showDestAbnormalPosition', mobileFenceVehicleDestAbnormalPosition.value!)
  }
}

async function handleMobileFenceGetNotify() {
  let res = await mobileFenceGetNotify({fenceId: String(props.fenceId)})
  notice.value = res.data!
}

handleMobileFenceGetNotify()
getDestAbnormalPosition()
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
    await mobileFenceSetNotify({fenceId: String(props.fenceId), isNotify: !notice.value})
    await handleMobileFenceGetNotify()
    return true
  } else {
    return true
  }
}
</script>

<style lang="scss" scoped>
.ElectronicFenceMapDestAbnormal {

}
</style>
