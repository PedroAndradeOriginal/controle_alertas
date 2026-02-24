// =============================
// CONFIG PAGINAÇÃO
// =============================
let paginaAtual = 0;
const limite = 10;
let grafico;

// =============================
// EVENTOS
// =============================
document
  .getElementById("btnVerde")
  .addEventListener("click", () => handleClique("verde"));

document
  .getElementById("btnAmarelo")
  .addEventListener("click", () => handleClique("amarelo"));

document
  .getElementById("btnVermelho")
  .addEventListener("click", () => handleClique("vermelho"));

// =============================
// BUSCAR ALERTA ATIVO
// =============================
async function getAlertaAtivo() {
  const { data, error } = await db
    .from("alertas")
    .select("*")
    .eq("status", "ativo")
    .limit(1);

  if (error) {
    console.error(error);
    return null;
  }

  return data.length ? data[0] : null;
}

// =============================
// CALCULAR MINUTOS
// =============================
function calcularMinutos(inicio, fim) {
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  const diffMs = dataFim - dataInicio;

  return Math.max(0, Math.round(diffMs / 60000));
}

// =============================
// HANDLE CLIQUE (CORRIGIDO)
// =============================
let processando = false;

function setBotoes(disabled) {
  document.getElementById("btnVerde").disabled = disabled;
  document.getElementById("btnAmarelo").disabled = disabled;
  document.getElementById("btnVermelho").disabled = disabled;
}

async function handleClique(tipo) {
  if (processando) return;

  processando = true;
  setBotoes(true);

  try {
    const dataSelecionada = document.getElementById("dataAlerta").value;
    const horaSelecionada = document.getElementById("horaAlerta").value;

    if (!dataSelecionada || !horaSelecionada) {
      alert("Selecione data e hora.");
      return;
    }

    // ✅ FORMATO CORRETO PARA timestamp without time zone
    const dataHoraString = `${dataSelecionada} ${horaSelecionada}:00`;

    const alertaAtivo = await getAlertaAtivo();

    // =============================
    // SEM ALERTA ATIVO
    // =============================
    if (!alertaAtivo) {
      if (tipo === "verde") return;

      await db.from("alertas").insert([
        {
          data: dataSelecionada,
          tipo: tipo,
          hora_inicio: dataHoraString,
          status: "ativo",
        },
      ]);
    }

    // =============================
    // COM ALERTA ATIVO
    // =============================
    else {
      if (alertaAtivo.tipo === tipo) return;

      const minutos = calcularMinutos(
        alertaAtivo.hora_inicio,
        dataHoraString
      );

      await db
        .from("alertas")
        .update({
          hora_fim: dataHoraString,
          status: "encerrado",
          vigencia_minutos: minutos,
        })
        .eq("id", alertaAtivo.id);

      if (tipo !== "verde") {
        await db.from("alertas").insert([
          {
            data: dataSelecionada,
            tipo: tipo,
            hora_inicio: dataHoraString,
            status: "ativo",
          },
        ]);
      }
    }

    await carregarTabela();
    await atualizarPainelStatus();

  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao processar alerta.");
  } finally {
    processando = false;
    setBotoes(false);
  }
}