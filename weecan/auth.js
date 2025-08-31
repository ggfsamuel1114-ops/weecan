// auth.js - 通用登录验证脚本

// 检查用户是否已登录
async function checkAccess() {
  const token = localStorage.getItem("token");

  if (!token) {
    // 没有 token → 跳回登录
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/protected", {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();

    if (res.ok) {
      console.log("✅ 验证成功，当前用户:", data.user);

      // 如果页面里有 #welcome 元素，就显示欢迎语
      const welcomeEl = document.getElementById("welcome");
      if (welcomeEl) {
        welcomeEl.innerText = "欢迎你，" + data.user + " 🎉";
      }

    } else {
      console.warn("❌ Token 无效:", data);
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("🚨 验证请求失败:", err);
    window.location.href = "login.html";
  }
}

// 退出登录
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ✅ 确保函数能在 HTML onclick 调用
window.logout = logout;

// 页面加载时自动执行验证
document.addEventListener("DOMContentLoaded", checkAccess);
