window.addEventListener("load", () => {
  // Data padrão
  document.getElementById("dataAlerta").valueAsDate = new Date();

  // Hora padrão
  document.getElementById("horaAlerta").value = new Date()
    .toTimeString()
    .slice(0, 5);

  carregarTabela();
  carregarDashboard();
});

document
  .getElementById("btnFiltrar")
  .addEventListener("click", carregarDashboard);

let graficoMensal;

async function carregarDashboard() {
  const { data } = await db
    .from("alertas")
    .select("*")
    .order("data", { ascending: true });

  if (!data) return;

  const filtroInicio = document.getElementById("filtroInicio").value;
  const filtroFim = document.getElementById("filtroFim").value;

  let dadosFiltrados = data;

  if (filtroInicio && filtroFim) {
    dadosFiltrados = data.filter((a) => {
      return a.data >= filtroInicio && a.data <= filtroFim;
    });
  }

  let totalMinutos = 0;
  let maiorAlerta = 0;
  const horasIncidencia = {};
  const horasPorMes = {};

  dadosFiltrados.forEach((a) => {
    const minutos = a.vigencia_minutos || 0;
    totalMinutos += minutos;

    if (minutos > maiorAlerta) maiorAlerta = minutos;

    const hora = new Date(a.hora_inicio).getHours();
    horasIncidencia[hora] = (horasIncidencia[hora] || 0) + 1;

    const mes = a.data.substring(0, 7); // YYYY-MM
    horasPorMes[mes] = (horasPorMes[mes] || 0) + minutos;
  });

  // Hora com mais incidência
  let horaCritica = "--";
  let maxIncidencia = 0;

  for (let h in horasIncidencia) {
    if (horasIncidencia[h] > maxIncidencia) {
      maxIncidencia = horasIncidencia[h];
      horaCritica = h.padStart(2, "0") + ":00";
    }
  }

  const totalHoras = (totalMinutos / 60).toFixed(1);

  document.getElementById("cardTotalHoras").innerText = totalHoras + "h";
  document.getElementById("cardQtdAlertas").innerText = dadosFiltrados.length;
  document.getElementById("cardHoraCritica").innerText = horaCritica;
  document.getElementById("cardMaiorAlerta").innerText = maiorAlerta;

  gerarGraficoMensal(horasPorMes);
}

// =============================
// GRÁFICO
// =============================

function gerarGraficoMensal(horasPorMes) {
  const ctx = document.getElementById("graficoMensal");

  if (graficoMensal) graficoMensal.destroy();

  const labels = Object.keys(horasPorMes);
  const valores = Object.values(horasPorMes).map((v) => (v / 60).toFixed(1));

  graficoMensal = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Horas Perdidas",
          data: valores,
          backgroundColor: "#0d6efd",
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}
function gerarGrafico(vermelho, amarelo) {
  const ctx = document.getElementById("graficoAlertas");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Vermelho", "Amarelo"],
      datasets: [
        {
          label: "Quantidade no Mês",
          data: [vermelho, amarelo],
          backgroundColor: ["#dc3545", "#ffc107"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
    },
  });
}
