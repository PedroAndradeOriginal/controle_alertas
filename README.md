# 🚨 Controle de Alertas

<p align="center">
Sistema web para <strong>registro, controle e análise de alertas operacionais</strong>, 
com encerramento automático, rastreabilidade cronológica e exportação de dados.
</p>

<p align="center">
🔗 <a href="https://pedroandradeoriginal.github.io/controle_alertas/" target="_blank">
Acessar Sistema Online
</a>
</p>

---

## 📌 Sobre o Projeto

O **Controle de Alertas** foi desenvolvido para gerenciar eventos operacionais classificados como:

- 🔴 **Vermelho**
- 🟡 **Amarelo**
- 🟢 **Verde**

O sistema garante:

- ✔ Integridade cronológica  
- ✔ Encerramento automático de eventos  
- ✔ Rastreabilidade completa  
- ✔ Controle preciso de data e hora  

---

## ⚙️ Regras de Negócio

- Alertas **vermelhos e amarelos iniciam** um evento.
- Um alerta **verde encerra automaticamente** o alerta ativo anterior.
- Eventos **não se sobrepõem**.
- Um alerta termina exatamente quando o próximo começa.
- Controle rigoroso de timestamp.
- Correção aplicada para evitar inconsistência de **timezone na exportação Excel**.

---

## 🗄 Banco de Dados

O sistema utiliza banco relacional SQL (PostgreSQL via Supabase).

### 📋 Estrutura da Tabela `alertas`

| Campo        | Tipo               | Descrição                         |
|--------------|-------------------|-----------------------------------|
| `id`         | SERIAL / IDENTITY | Identificador único               |
| `data`       | DATE              | Data do evento                   |
| `hora_inicio`| TIMESTAMP         | Início do alerta                 |
| `hora_fim`   | TIMESTAMP         | Encerramento do evento           |
| `tipo`       | VARCHAR           | vermelho / amarelo / verde       |
| `status`     | VARCHAR           | ativo / encerrado                |

### 🔎 Observações Técnicas

- Tratamento para evitar `NULL` em `hora_inicio`
- Encerramento automático via atualização do registro anterior
- Testes estruturais com `TRUNCATE ... RESTART IDENTITY`
- Ajuste de timezone na exportação para Excel

---

## 📊 Funcionalidades

- 📌 Registro de alertas com data e hora  
- 🔁 Encerramento automático via alerta verde  
- 📄 Paginação de registros  
- 📊 Dashboard com gráfico dinâmico  
- 📥 Exportação para Excel  
- 🕒 Relógio em tempo real  
- 📚 Histórico estruturado para análise  

---

## 🛠 Tecnologias Utilizadas

- HTML5  
- CSS3  
- JavaScript  
- Supabase (PostgreSQL)  
- GitHub Pages (deploy do front-end)

---

## 📁 Estrutura do Projeto

```bash
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
