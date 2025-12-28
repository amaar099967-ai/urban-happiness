const texts = {
  ar: { title: "تسجيل الدخول", user: "اسم المستخدم", pass: "كلمة المرور", btn: "دخول" },
  en: { title: "Login", user: "Username", pass: "Password", btn: "Login" }
};

function setLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.getElementById("title").innerText = texts[lang].title;
  document.getElementById("username").placeholder = texts[lang].user;
  document.getElementById("password").placeholder = texts[lang].pass;
  document.getElementById("loginBtn").innerText = texts[lang].btn;
}

function login() {
  alert("التطبيق يعمل بنجاح ✅");
}
