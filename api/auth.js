// auth.js
(function () {
  // 检查登录状态
  if (sessionStorage.getItem("loggedIn") !== "true") {
    console.warn("⛔ 未登录，重定向到 login.html");
    window.location.href = "login.html";
  }

  // 给全局暴露一个登出函数
  window.logout = function () {
    sessionStorage.removeItem("loggedIn"); // 清除登录标记
    alert("您已登出！");
    window.location.href = "login.html";   // 返回登录页
  };
})();
