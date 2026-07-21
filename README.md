# Cúpula Black · Ferramenta de Onboarding

Ferramenta web para o onboarding personalizado do Mastermind **Cúpula Black**.
Preencha os dados do advogado(a) e gere, com um clique, uma apresentação de
boas-vindas personalizada com o nome e o tratamento do membro.

## Como usar

1. Abra o arquivo **`index.html`** em qualquer navegador (Chrome, Edge, Safari…).
   Não precisa de servidor nem instalação.
2. **Etapa 1 — Cadastro:** preencha os dados do membro:
   - Nome completo do advogado(a)
   - Tratamento (Dr. / Dra. / sem tratamento)
   - Como deseja ser chamado(a)
   - Telefone / WhatsApp, e-mail
   - CPF (validado automaticamente) e data de nascimento
   - Endereço para envio do kit (opcional)
3. Clique em **"Gerar apresentação →"**. A ferramenta abre a apresentação já
   personalizada, começando pela tela **"Boas-vindas à Cúpula Black"** com o
   nome do membro (ex.: *Dra. Bianca*).

## Apresentação

A apresentação segue o material oficial 2026, com os tópicos:
Mastermind Puro · 3 Encontros (2 Nacionais + 1 Internacional) · ROI ·
Experiência · Acesso a Entregáveis da Mentoria · Rodada de Investimentos
(Precatórios) · Palco na RED · Prioridade no Acesso.

Controles: setas **← →** ou **espaço** para navegar, **F** para tela cheia,
**Esc** para sair. Também funciona com swipe no celular/tablet.

## Membros cadastrados

Cada cadastro fica salvo no próprio navegador (localStorage). Na coluna
"Membros cadastrados" é possível **reabrir a apresentação** (▶), **editar** (✎)
ou **remover** (🗑) um membro.

> Os dados ficam apenas neste navegador — nada é enviado para servidores.

## Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Estrutura da ferramenta (cadastro + apresentação) |
| `styles.css` | Identidade visual Cúpula Black (preto premium) |
| `app.js` | Validação, máscaras, armazenamento e a apresentação |

## Personalização do conteúdo

Para ajustar os textos dos slides, edite o array `SLIDES` no início de
`app.js`. Cada slide aceita: `eyebrow`, `title` (aceita HTML, use
`<span class="thin">` para texto leve), `sub` e `tag`.
