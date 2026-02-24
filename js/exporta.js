// =============================
// CARREGAR TABELA COM PAGINAÇÃO
// =============================
async function carregarTabela() {
  const inicioRange = paginaAtual * limite;
  const fimRange = inicioRange + limite - 1;

  const { data, count } = await db
    .from("alertas")
    .select("*", { count: "exact" })
    .order("data", { ascending: false })
    .order("hora_inicio", { ascending: false })
    .range(inicioRange, fimRange);

  const tbody = document.getElementById("tabelaAlertas");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Nenhum registro encontrado</td>
      </tr>
    `;
    return;
  }

  data.forEach((alerta) => {
    const tr = document.createElement("tr");

    const inicio = new Date(alerta.hora_inicio);
    const fim = alerta.hora_fim ? new Date(alerta.hora_fim) : null;

    tr.innerHTML = `
     <td>${alerta.data.split("-").reverse().join("/")}</td>
      <td>
        <span class="badge ${getBadgeColor(alerta.tipo)}">
          ${alerta.tipo.toUpperCase()}
        </span>
      </td>
        <td>${inicio.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" })}</td>
        <td>${fim ? fim.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "-"}</td>
      <td>${alerta.vigencia_minutos ?? "-"}</td>
    `;

    tbody.appendChild(tr);
  });

  atualizarPaginacao(count);
}

// =============================
// PAGINAÇÃO
// =============================
function atualizarPaginacao(totalRegistros) {
  const totalPaginas = Math.ceil(totalRegistros / limite);

  document.getElementById("infoPagina").innerText =
    `Página ${paginaAtual + 1} de ${totalPaginas}`;

  document.getElementById("btnAnterior").disabled = paginaAtual === 0;
  document.getElementById("btnProximo").disabled =
    paginaAtual >= totalPaginas - 1;
}

document.getElementById("btnAnterior").addEventListener("click", () => {
  if (paginaAtual > 0) {
    paginaAtual--;
    carregarTabela();
  }
});

document.getElementById("btnProximo").addEventListener("click", () => {
  paginaAtual++;
  carregarTabela();
});

// =============================
// BADGE COR
// =============================
function getBadgeColor(tipo) {
  if (tipo === "vermelho") return "bg-danger";
  if (tipo === "amarelo") return "bg-warning text-dark";
  if (tipo === "verde") return "bg-success";
  return "bg-secondary";
}

// =============================
// INICIALIZAÇÃO
// =============================

async function exportarExcel() {
  try {
    const { data, error } = await db
      .from("alertas")
      .select("*")
      .order("data", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao buscar dados para exportação.");
      return;
    }

    if (!data || data.length === 0) {
      alert("Nenhum dado encontrado.");
      return;
    }

    const filtroInicio = document.getElementById("filtroInicio")?.value;
    const filtroFim = document.getElementById("filtroFim")?.value;

    let dadosFiltrados = data;

    if (filtroInicio && filtroFim) {
      dadosFiltrados = data.filter(
        (a) => a.data >= filtroInicio && a.data <= filtroFim,
      );
    }

    const dadosFormatados = dadosFiltrados.map((a) => ({
      Data: a.data.split("-").reverse().join("/"),
      Tipo: a.tipo?.toUpperCase(),
      "Hora Início": new Date(a.hora_inicio).toLocaleTimeString(),
      "Hora Fim": a.hora_fim ? new Date(a.hora_fim).toLocaleTimeString() : "",
      "Vigência (min)": a.vigencia_minutos ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alertas");

    const hoje = new Date().toISOString().slice(0, 10);

    XLSX.writeFile(workbook, `Controle_de_Alertas_${hoje}.xlsx`);
  } catch (err) {
    console.error("Erro geral exportação:", err);
    alert("Erro ao exportar arquivo.");
  }
}
const btnExportar = document.getElementById("btnExportar");

if (btnExportar) {
  btnExportar.addEventListener("click", exportarExcel);
}
