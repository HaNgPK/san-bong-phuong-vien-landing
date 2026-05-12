fetch("http://localhost:3000/api/sheet", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test",
    amount: 100000,
    message: "Test message",
    category: "Cá nhân",
    date: "12/5/2026"
  })
}).then(r => r.text()).then(console.log).catch(console.error);
