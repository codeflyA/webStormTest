import { defineStore } from "pinia";
import type { IStudentInfo } from "@/request/getPeopleInfo";
type userClass = IStudentInfo["result"]["page"]["records"][number];
export const useUserLoginInfoStore = defineStore(
  "userInfo",
  () => {
    const appId = ref("");
    const USER_ID = ref("");
    const ACCESS_TOKEN = ref("");
    const userClass = ref<userClass>();
    const UserIdentificationInfo = ref<{
      phone: string;
      name: string;
      idNumber: string;
    }>();
    return { appId, USER_ID, ACCESS_TOKEN, userClass, UserIdentificationInfo };
  },
  {
    persist: {
      pick: [
        "appId",
        "USER_ID",
        "ACCESS_TOKEN",
        "userClass",
        "UserIdentificationInfo",
      ],
    },
  }
);
