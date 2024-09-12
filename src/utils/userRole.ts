import request from "@/request";
//获取实名完成的用户是否是学生还是教练
export async function handleUserRole(id: string) {
  const { result } = await request.get("/app/getPersonInfo", {
    data: {
      id,
    },
  });
  console.log(result);
  if (result.roleType === "student") {
    uni.navigateTo({
      url: "/pages/student/StudentHome",
    });
  } else if (result.roleType === "coach") {
    uni.navigateTo({
      url: "/pages/coach/coachHome",
    });
  }
}
