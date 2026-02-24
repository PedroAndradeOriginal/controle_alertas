function atualizarRelogio() {
  const agora = new Date();
  document.getElementById("relogio").innerText =
    agora.toLocaleDateString() + " " + agora.toLocaleTimeString();
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Data padrão
document.getElementById("dataAlerta").valueAsDate = new Date();

// Hora padrão
const campoHora = document.getElementById("horaAlerta");
if (campoHora) {
  campoHora.value = new Date().toTimeString().slice(0, 5);
}
