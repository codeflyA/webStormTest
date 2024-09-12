import request from "@/request/index";

import { useUserLoginInfoStore } from "@/stores/userInfo";
export interface ICoachInfo {
  success: boolean;
  message: string;
  code: number;
  result: {
    inscode: string;
    insname?: any;
    name: string;
    sex: number;
    idcard: string;
    mobile: string;
    address?: any;
    photo?: any;
    photourl?: any;
    fingerprint: string;
    drilicence: string;
    fstdrilicdate: string;
    occupationno: string;
    occupationlevel?: any;
    dripermitted: string;
    teachpermitted: string;
    employstatus: string;
    hiredate: string;
    leavedate?: any;
    auditstate: number;
    auditdate: string;
    auditreason: string;
    stopTrain: number;
    status: number;
    coachnum: string;
    istojs?: any;
    istoqg?: any;
    effectivedate?: any;
    remarks?: any;
    osspotourl?: any;
    teachtype?: number;
    platform: string;
    platformName?: any;
    remark?: any;
    isSchool?: any;
    type?: any;
    createBy?: any;
    updateTime: string;
    createTime: string;
    updateBy?: any;
    id: number;
  };
  timestamp: number;
}
export function getCoachInfo(): Promise<ICoachInfo> {
  const USER_ID = useUserLoginInfoStore().USER_ID;
  return request.get("/zlb/training/getCoachInfo", {
    params: {
      id: USER_ID,
    },
  });
}
export interface IStudentInfo {
  success: boolean;
  message: string;
  code: number;
  result: {
    msg: string;
    page: {
      records: {
        id: string;
        inscode: string;
        cardtype: string;
        idcard: string;
        nationality: string;
        name: string;
        sex: string;
        phone: string;
        address?: any;
        photo: string;
        busitype: string;
        drilicnum?: any;
        fstdrilicdate?: any;
        traintype: string;
        applydate: string;
        photopath?: any;
        insname?: any;
        stunum: string;
        bankcode?: any;
        bankname?: any;
        issigncontract: number;
        istoqg?: any;
        istojs?: any;
        perdritype?: any;
        createTime: string;
        createBy?: any;
        updateBy?: any;
        updateTime: string;
        basicCost?: any;
        secondCost?: any;
        thirdCoast?: any;
        frozenAmount?: any;
        platform: string;
        coachnum?: any;
        iscrosscity?: any;
        crosscityname?: any;
        istobank?: any;
        stutype: number;
        otherIdcard?: any;
        otherPhone?: any;
        cardid?: any;
        isold?: any;
        issignature?: any;
        istoapp?: any;
        signpath?: any;
        regfalg: string;
        stimefalg: string;
        fromarea?: any;
        district: string;
        birthday?: any;
        birthplace?: any;
        unitPrice?: any;
        archiveCost?: any;
        crossType: number;
        baseType: number;
        applydateBegin?: any;
        applydateEnd?: any;
        coachname?: any;
        contracturl?: any;
        totalamount?: any;
        unitprice2?: any;
        isSchool?: any;
        inscodes?: any;
        idnum?: any;
        subject?: any;
        vehicletime?: any;
        classtime?: any;
        filePath?: any;
        newApplyDate?: any;
      }[];
      total: number;
      size: number;
      current: number;
      orders: any[];
      optimizeCountSql: boolean;
      searchCount: boolean;
      countId?: any;
      maxLimit?: any;
      pages: number;
    };
    isSign: number;
    status: number;
  };
  timestamp: number;
}
export function getStudentInfo(): Promise<IStudentInfo> {
  const USER_ID = useUserLoginInfoStore().USER_ID;
  return request.get("/zlb/tmc/tMCoach/person", {
    data: {
      id: USER_ID,
    },
  });
}

export function recordByOrderId(certifyId): Promise<{
  success: boolean;
  message: string;
  code: number;
  result: string; // 注意：这是一个 JSON 字符串
  timestamp: number;
}> {
  return request.get(`/app/face/recordByOrderId?orderId=${certifyId}`);
}
