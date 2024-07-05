import http from '@/api/axios'
export type MobileFenceVehicleDestAbnormalData = {
  abnormalType?: string
  bizStatus?: number
  companyId?: string
  destination?: string
  direction: number
  id?: number
  idCard?: string
  latitude: number
  longitude: number
  orderId?: string
  orderStatus?: string
  positionTime?: string
  vehicleNo?: string
  fwlx: string
  vehicleCfcs: number
  driverCfcs: number
}
export const getMobileFenceVehicleDestAbnormal = (params: { id: number }) =>
  http.get<{
    code?: number
    data?: MobileFenceVehicleDestAbnormalData[]
    msg?: string
  }>('/mobile/fence/vehicle/destAbnormal', { params })
export const mobileFenceSetNotify = (params: { fenceId?: string; isNotify?: boolean }) =>
  http.get<{
    code?: number
    data?: boolean
    msg?: string
  }>('/mobile/fence/setNotify', { params })
export const mobileFenceGetNotify = (params: { fenceId?: string }) =>
  http.get<{
    code?: number
    data?: boolean
    msg?: string
  }>('/mobile/fence/getNotify', { params })
