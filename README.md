🚨 Controle de Alertas

Sistema web para registro, controle e análise de alertas operacionais, com controle automático de encerramento, histórico estruturado e exportação de dados.

🔗 Acesse o sistema:
👉 https://pedroandradeoriginal.github.io/controle_alertas/

📌 Sobre o Projeto

O Controle de Alertas foi desenvolvido para gerenciar eventos classificados como:

🔴 Vermelho

🟡 Amarelo

🟢 Verde

O sistema garante rastreabilidade completa, impedindo sobreposição de alertas e mantendo integridade cronológica dos registros.

⚙️ Regras de Negócio

Alertas vermelhos e amarelos iniciam um evento.

Um alerta verde encerra automaticamente o alerta ativo anterior.

Eventos não se sobrepõem.

Um alerta termina exatamente quando o próximo começa.

Controle rigoroso de data e hora para evitar inconsistências.

Correção aplicada para evitar erro de exportação que alterava a data (timezone).

🗄 Banco de Dados

O sistema utiliza banco de dados relacional SQL para armazenamento persistente.

📋 Tabela alertas
Campo	Tipo	Descrição
id	SERIAL / IDENTITY	Identificador único
data	DATE	Data do evento
hora_inicio	TIMESTAMP	Início do alerta
hora_fim	TIMESTAMP	Encerramento
tipo	VARCHAR	vermelho / amarelo / verde
status	VARCHAR	ativo / encerrado
Observações Técnicas

Controle de NULL em hora_inicio

Encerramento automático via atualização do registro anterior

Testes realizados com TRUNCATE ... RESTART IDENTITY

Ajuste de timezone na exportação Excel

📊 Funcionalidades

Registro de alertas com data e hora

Encerramento automático via alerta verde

Paginação da tabela

Gráfico dinâmico

Exportação para Excel

Histórico estruturado

🛠 Tecnologias

HTML5

CSS3

JavaScript

SQL

GitHub Pages (deploy front-end)

📁 Estrutura do Projeto
controle_alertas/
│
├── assets/
│   └── logo.png
│
├── js/
│   ├── app.js
│   ├── dashboard.js
│   ├── exporta.js
│   ├── features.js
│   ├── relogio.js
│   └── supabaseClient.js
│
└── index.html

🚀 Como Executar Localmente

Clone o repositório:

git clone https://github.com/pedroandradeoriginal/controle_alertas.git

Abra o index.html no navegador.

👨‍💻 Autor

Pedro Andrade
