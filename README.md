# 🏥 SUS É TOP — apostila digital para concursos da saúde

Apostila digital e plataforma de estudos para **concursos públicos da área da saúde**,
cobrindo legislação do SUS, enfermagem e conhecimentos gerais. Instalável como aplicativo
(PWA), funciona offline e traz simulados com correção automática.

## ✨ Funcionalidades

- **21 módulos de conteúdo** em HTML, do básico ao avançado
- **Simulados e provas** com correção automática e resultado imediato
- **PWA**: instala no celular e **funciona offline** (service worker)
- Navegação por módulo, com progresso de leitura
- Interface leve, pensada para estudar pelo celular

## 📚 Conteúdo

| Bloco | Módulos |
|---|---|
| **Legislação do SUS** | CF/88 (arts. 194 e 195) · Lei 8.080 · Lei 8.142 · Princípios e diretrizes · Redes de Atenção · PNAB |
| **Prática de enfermagem** | Humanização e segurança · Biossegurança · Sinais vitais · Medicamentos · Curativos · Vacinação · Urgência e emergência |
| **Saúde por ciclo de vida** | Saúde da mulher e da criança · Saúde do adulto e do idoso |
| **Fundamentos** | Ética em enfermagem · Sistematização da Assistência (SAE) |
| **Conhecimentos gerais** | Português · Raciocínio lógico · Informática · Atualidades |

## 📸 Tela

[![SUS É TOP — apostila digital para concursos da área da saúde, desenvolvida por Alex Junior (alequizao)](https://image.thum.io/get/width/700/https://publishdev.com.br/sus/)](https://publishdev.com.br/sus/)

## 📦 Manual de instalação

### Requisitos

| Componente | Versão | Observação |
|---|---|---|
| PHP | 7.4+ | apenas para a API de simulados |
| MySQL / MariaDB | 5.7+ / 10.3+ | resultados dos simulados |
| Apache / Nginx | — | o conteúdo é HTML estático |

### 1. Arquivos

```bash
git clone https://github.com/alequizao/sus-e-top.git
cd sus-e-top
```

### 2. Configurar a API

```bash
cp api.example.php api.php
```

Edite `api.php` com os dados do banco. **Esse arquivo não vai para o Git.**

### 3. Banco

```sql
CREATE DATABASE sus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

As tabelas são criadas na primeira execução da API.

### 4. Acessar

Abra `https://seu-dominio/` — o conteúdo é servido direto, sem build. No celular, use
*Adicionar à Tela de Início* para instalar como aplicativo e estudar offline.

> Ao alterar o conteúdo, rode `./bump.sh` para versionar o service worker e invalidar o
> cache do PWA — sem isso o aparelho continua servindo a versão antiga.

---

## 👨‍💻 Desenvolvedor

Projetado e desenvolvido **100% por Alex Junior (alequizao)** — da ideia ao deploy:
levantamento, modelagem do banco, backend, interface e publicação em produção.
Analista e Desenvolvedor de Sistemas em **Maceió, Alagoas**, Brasil. Programador na
**Publish Digital**.

- **E-mail:** alequizao.dev@gmail.com
- **WhatsApp:** [(82) 98871-7072](https://wa.me/5582988717072)
- **Instagram:** [@alequizao](https://instagram.com/alequizao)
- **GitHub:** [@alequizao](https://github.com/alequizao) · [perfil completo](https://github.com/alequizao/alequizao)
- **Site:** [alequizao.com](https://alequizao.com)

Precisa de um sistema sob medida para o seu negócio? Entre em contato.

---

© Código proprietário, desenvolvido sob encomenda. Uso, cópia ou redistribuição
somente com autorização.
