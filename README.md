# Emprego Certo

Upload de certificado PDF/JPG/PNG, leitura de formação com Gemini e descoberta de anúncios com Tavily. A pessoa revisa o curso e os cargos sugeridos, escolhe cidade/UF, modalidade e nível de carreira. Há alternativa manual e vagas salvas apenas no navegador.

## Executar

Node.js 22 ou superior:

```
npm ci
```

Copie `.env.example` para `.env` e preencha GEMINI_API_KEY e TAVILY_API_KEY. Não publique esse arquivo. Depois:

```
npm start
```

Abra http://localhost:3001. Neste computador, o servidor também pode reaproveitar a configuração privada do projeto VerificaNews, se ela existir na pasta vizinha. As credenciais não são incluídas no ZIP nem no código do navegador.

## Como funciona

- Arquivos são recebidos na memória, limitados a 8 MB. Imagens passam por validação de assinatura, tamanho e normalização. PDFs têm formato de entrada validado e são processados pela API Gemini; a API pode rejeitar documentos corrompidos, protegidos ou ilegíveis.
- O Gemini extrai curso, instituição e competências explícitas, sem devolver nome, CPF ou assinatura. Cargos são sugestões de pesquisa. A pessoa pode revisar tudo.
- Tavily consulta a web por cargo, cidade e modalidade, com busca complementar em anúncios Gupy. Os resultados são deduplicados e até três páginas são consultadas para obter mais contexto.
- O Gemini organiza somente anúncios fornecidos pela busca. Links vêm obrigatoriamente dessas fontes, não de URLs geradas pelo modelo. Páginas genéricas e anúncios explicitamente encerrados são descartados. Vagas locais precisam informar a cidade selecionada; modalidade desconhecida não é presumida.
- Curso e certificado não provam habilitação profissional, experiência ou adequação a uma vaga. Salários, modalidades e níveis ausentes não são inventados.
- Não há promessa de cobertura integral, atualização instantânea de todas as fontes, disponibilidade dos anúncios ou contratação. O usuário deve conferir os requisitos na fonte.
- Arquivo não é salvo em disco. Consultas ficam por até 30 minutos na memória do servidor e são isoladas por cookie de sessão. Não há banco obrigatório. Vagas favoritas ficam no localStorage do navegador.

## Publicar sem substituir VerificaNews

Crie outro serviço Render com o código desta pasta na raiz de um repositório. O `render.yaml` define plano Free, comando de build `npm ci --omit=dev`, start `node src/server.js` e health check `/api/status`. Cadastre GEMINI_API_KEY e TAVILY_API_KEY como variáveis secretas no painel. O hostname Render é detectado automaticamente. Para domínio próprio, configure CURSO_VAGAS_ORIGIN com o endereço HTTPS exato. SESSION_SECRET precisa permanecer estável em produção.

O pacote de publicação compacto (`curso-vagas-render`) contém `app-source.json` com os mesmos fontes e `bootstrap.mjs`, que os materializa ao iniciar e executa `src/server.js`. Esse formato permite enviar o projeto inteiro por um único upload do GitHub, sem achatar as pastas nem enviar credenciais. O ZIP de código-fonte normal continua com a estrutura convencional para desenvolvimento.

## Testar

```
npm test
```

Os testes cobrem consentimento, validação de entrada, arquivo inválido, exclusão de dados pessoais do perfil, vínculo entre resultado e fonte real, anúncios encerrados, modalidade, cidade, deduplicação, falhas de pesquisa, CSRF e isolamento entre sessões. Um certificado fictício sem validade foi usado em teste real de integração; não há dados pessoais de usuários no relatório.

## Limites do MVP

Gemini e Tavily dependem de conexão, disponibilidade e cotas das contas. O plano Free do Render pode dormir sem acessos e perder consultas temporárias ao reiniciar. Não há candidatura automática nem upload do certificado aos recrutadores. Os provedores processam os dados enviados conforme suas políticas; o operador deve revisar as condições antes de abrir o serviço a terceiros.


## Contas reais

A área de conta usa o SDK oficial do Supabase Auth. Cadastre SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY no ambiente (a chave publicável, nunca service_role). O aplicativo não cria tabelas de senha e não usa tabelas públicas de usuários. Tokens ficam em cookies assinados, HttpOnly e Secure no HTTPS, sem localStorage. Nome/e-mail são retornados para a própria sessão.

No Supabase, em Authentication > URL Configuration, use Site URL https://curso-vagas.onrender.com e autorize os redirecionamentos https://curso-vagas.onrender.com/#login e https://curso-vagas.onrender.com/#recuperar. A política de confirmação de e-mail precisa ser definida no Supabase, não apenas no código.

IMPORTANTE: o serviço de e-mail padrão do Supabase envia somente para integrantes da equipe e tem limite reduzido. Para cadastro público confirmado e recuperação de senha, configure SMTP próprio antes de liberar o site para terceiros: https://supabase.com/docs/guides/auth/auth-smtp . Não desative a confirmação de e-mail sem decidir conscientemente essa política.

Os fluxos de cadastro, entrada, saída, confirmação e redefinição estão implementados; autenticação exige configuração real do provedor. Os testes automatizados usam um cliente de autenticação controlado e não substituem validar o recebimento do e-mail no ambiente publicado.

## Cursos e tema

A aba de cursos tem 11 opções da EV.G, com carga horária e links oficiais revisados em 09/11/2026. Gratuidade de curso/certificado depende de cumprir os requisitos da instituição; inscrições e disponibilidade podem mudar. Há busca por texto e filtro por área. Cursos livres não equivalem automaticamente a diploma técnico ou superior.

O tema acompanha a preferência do sistema no primeiro acesso e pode ser alternado no cabeçalho. A escolha é persistida apenas no navegador.
