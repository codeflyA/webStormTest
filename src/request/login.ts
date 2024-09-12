// 上述请求和以下等同
import request from "@/request/index";

function login() {
  return request.get("/user", {
    params: {
      ID: "12345",
    },
  });
}
function login2(username, password) {
  return request.post("/login", { username, password });
}
