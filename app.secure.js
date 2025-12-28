// v2 Secure Logic using WebCrypto AES-GCM
const enc = new TextEncoder();
const dec = new TextDecoder();

async function getKey() {
  const material = await crypto.subtle.importKey(
    "raw",
    enc.encode("MASWORY_SECURE_KEY"),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode("maswory"), iterations: 100000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt","decrypt"]
  );
}

async function saveData(data){
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    {name:"AES-GCM", iv},
    key,
    enc.encode(JSON.stringify(data))
  );
  localStorage.setItem("secureData", JSON.stringify({iv:Array.from(iv),data:Array.from(new Uint8Array(cipher))}));
}

async function loadData(){
  const raw = localStorage.getItem("secureData");
  if(!raw) return [];
  const parsed = JSON.parse(raw);
  const key = await getKey();
  const plain = await crypto.subtle.decrypt(
    {name:"AES-GCM", iv:new Uint8Array(parsed.iv)},
    key,
    new Uint8Array(parsed.data)
  );
  return JSON.parse(dec.decode(plain));
}

document.getElementById("login-btn").onclick = async ()=>{
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("main-app").classList.remove("hidden");
};

async function addRow(){
  const rows = await loadData();
  rows.push({price:0,qty:1});
  await saveData(rows);
  render();
}

async function render(){
  const rows = await loadData();
  const tbody = document.getElementById("data-rows");
  tbody.innerHTML = "";
  let total = 0;
  rows.forEach((r,i)=>{
    const sub = r.price*r.qty;
    total += sub;
    tbody.innerHTML += `<tr><td>${i+1}</td><td>—</td><td>${r.price}</td><td>${r.qty}</td><td>${sub}</td></tr>`;
  });
  document.getElementById("grand-total").innerText = total;
}

render();