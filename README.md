# Gerador de Certificados - Loja Maçônica Monte Sinai

Sistema web estático para geração de certificados de presença da Augusta Respeitável Benfeitora e Excelsa Loja Simbólica Monte Sinai.

## Funcionalidades

- Login de administrador
- Geração de certificados personalizados
- Sistema de busca por iniciais
- Armazenamento local de dados
- Gerenciamento de sessões, graus, nomes, obreiros e potências
- Geração de PDF dos certificados

## Como Usar

### Acesso ao Sistema

1. Abra o arquivo `index.html` no navegador
2. Use as credenciais de login:
   - **Usuário:** admin
   - **Senha:** admin123

### Gerar Certificado

1. Na aba "Gerar Certificado", preencha os campos:
   - Tipo de Sessão
   - Grau
   - Nome do Irmão
   - Obreiro da Loja
   - Potência
   - Data
2. Clique em "Visualizar Certificado"
3. Clique em "Baixar PDF" para salvar o certificado

### Gerenciar Dados

1. Acesse a aba "Gerenciar Dados"
2. Adicione novos itens em cada categoria
3. Os dados são salvos automaticamente no navegador
4. Use a busca por iniciais ao digitar nos campos

## Deploy no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos:
   - index.html
   - styles.css
   - script.js
3. Vá em Settings > Pages
4. Em "Source", selecione "Deploy from a branch"
5. Escolha a branch "main" e a pasta "/ (root)"
6. Clique em "Save"
7. Seu site estará disponível em: `https://seu-usuario.github.io/nome-do-repositorio`

## Estrutura do Projeto

```
new-project/
├── index.html      # Estrutura principal
├── styles.css      # Estilos visuais
├── script.js       # Lógica e funcionalidades
└── README.md       # Este arquivo
```

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- html2pdf.js (geração de PDF)
- LocalStorage (armazenamento de dados)

## Suporte

Para alterar as credenciais de login, edite as constantes no arquivo `script.js`:
```javascript
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';
```
