// =============================
// FEATURES - PAINEL + CRONÔMETRO
// =============================

let intervaloCronometro = null;

// =============================
// ATUALIZAR PAINEL DE STATUS
// =============================
async function atualizarPainelStatus() {
  if (typeof getAlertaAtivo !== "function") return;

  const alertaAtivo = await getAlertaAtivo();
  const painel = document.getElementById("painelStatus");
  const statusTexto = document.getElementById("statusTexto");
  const cronometro = document.getElementById("cronometro");

  if (!painel) return;

  // SEM ALERTA
  if (!alertaAtivo) {
    painel.className = "card text-center mb-4 shadow bg-success text-white";
    statusTexto.innerText = "🟢 ÁREA LIVRE";
    cronometro.innerText = "";

    if (intervaloCronometro) {
      clearInterval(intervaloCronometro);
      intervaloCronometro = null;
    }

    return;
  }

  const inicio = new Date(alertaAtivo.hora_inicio);

  if (alertaAtivo.tipo === "vermelho") {
    painel.className = "card text-center mb-4 shadow bg-danger text-white";
    statusTexto.innerText = "🔴 ALERTA VERMELHO ATIVO";
  } else {
    painel.className = "card text-center mb-4 shadow bg-warning text-dark";
    statusTexto.innerText = "🟡 ALERTA AMARELO ATIVO";
  }
}

// =============================
// AUTO REFRESH A CADA 5 SEGUNDOS
// =============================
setInterval(() => {
  atualizarPainelStatus();
}, 5000);
