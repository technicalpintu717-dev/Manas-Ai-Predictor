document.getElementById("btnGen").onclick = () => {
  const password = document.getElementById("masterPass").value;
  const days = +document.getElementById("days").value;

  fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, days })
  })
  .then(r => r.json())
  .then(d => {
    if(d.key){
      document.getElementById("output").innerText =
        `✅ New Key: ${d.key} (Expires: ${new Date(d.expiresAt).toLocaleString()})`;
    } else {
      document.getElementById("output").innerText = d.error || "Error";
    }
  });
};
