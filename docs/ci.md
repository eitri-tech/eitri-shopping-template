# CI — Publicação automática de versões

A CI deste repositório publica automaticamente no Eitri cada Eitri-App cuja versão local seja maior que a última versão publicada. Toda a lógica fica em [`check_and_push.js`](../check_and_push.js); os arquivos de pipeline apenas preparam o ambiente e executam esse script.

## Quando roda

| Plataforma | Arquivo | Gatilho |
| --- | --- | --- |
| GitHub Actions | [`.github/workflows/main.yml`](../.github/workflows/main.yml) | `push` na branch `main` |
| Bitbucket Pipelines | [`bitbucket-pipelines.yml`](../bitbucket-pipelines.yml) | `push` na branch `main` |

O template já traz a pipeline pronta para uso tanto no GitHub quanto no Bitbucket.

## O que acontece em cada execução

1. **Preparação**: Node.js 18 é instalado e o `eitri-cli` é instalado globalmente (`npm install -g eitri-cli`).
2. **Autenticação**: o script troca `EITRI_CLI_CLIENT_ID` e `EITRI_CLI_CLIENT_SECRET` por um token (`client_credentials`) na API de autenticação do Eitri (`blind-guardian-api`).
3. **Descoberta dos apps**: são considerados apenas os diretórios **da raiz** do repositório que contêm um `eitri-app.conf.js`. Hoje são eles:
   - `shopping-vtex-template-shared`
   - `shopping-vtex-template-home`
   - `shopping-vtex-template-pdp`
   - `shopping-vtex-template-cart`
   - `shopping-vtex-template-checkout`
   - `shopping-vtex-template-account`
4. **Comparação de versões**: para cada app, o script lê `version` e `id` do `eitri-app.conf.js` e consulta na `eitri-manager-api` a revisão publicada mais recente (por data de criação). O app entra na fila de publicação somente se a versão local for **estritamente maior** que a publicada; se o app ainda não tiver nenhuma revisão, a versão publicada é tratada como `0.0.0`.
5. **Publicação**: os apps compartilhados (os que têm `sharedVersion` ou `sharedCompiler` no `eitri-app.conf.js`) são publicados primeiro, para que os outros apps já encontrem a nova versão do shared. Para cada app da fila, dentro do diretório dele, o script executa:
   - `eitri push-version -m '<mensagem>'`, com `--shared` nos apps compartilhados;
   - `eitri publish -e $EITRI_DEV_ENV_ID`, se a variável estiver definida.
6. **Tag git**: depois de publicar cada app, o script cria e envia (`git push origin`) uma tag no formato `<sufixo-do-app>-<versão>` (ex.: `home-1.2.0`). Se a tag não puder ser criada, a falha é só registrada no log e o pipeline segue.
7. **Resultado**: o pipeline falha (exit code 1) se a publicação de algum app der erro. Erros ao consultar a versão publicada de um app são apenas registrados no log, e esse app é ignorado nessa execução.

## O que é preciso configurar

### 1. Secrets / variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `EITRI_CLI_CLIENT_ID` | Sim | Client ID da credencial de CLI do Eitri (gerada no [Eitri Console](https://console.eitri.tech)), usado na autenticação e pelo `eitri-cli` |
| `EITRI_CLI_CLIENT_SECRET` | Sim | Client Secret da mesma credencial |
| `EITRI_DEV_ENV_ID` | Não | ID do ambiente (environment) da aplicação onde a nova versão deve ser publicada. Sem essa variável, o script só executa o `push-version` e não publica em nenhum ambiente |

A credencial precisa ter acesso à organização e à aplicação dos Eitri-Apps (`organizationId` e `applicationId` do `eitri-app.conf.js`).

**GitHub:** *Settings → Secrets and variables → Actions → New repository secret*, criando os três secrets com exatamente esses nomes. O workflow já os injeta no step de publicação.

**Bitbucket:** *Repository settings → Pipelines → Repository variables*, criando as mesmas três variáveis (marque as credenciais como *Secured*). Habilite também o Pipelines em *Repository settings → Pipelines → Settings*.

### 2. Permissões do repositório

- **GitHub:** o workflow declara `permissions: contents: write`, necessária para o `GITHUB_TOKEN` enviar as tags. Se a organização restringir as permissões padrão do token, confirme em *Settings → Actions → General → Workflow permissions* que essa permissão não está bloqueada.
- **Bitbucket:** o pipeline precisa conseguir fazer `git push` de tags no próprio repositório.

### 3. Publicação em produção (opcional)

O script tem a constante `PROD_ENV_ID`, hoje vazia (`''`) em [`check_and_push.js`](../check_and_push.js). Para que a CI também publique em produção, preencha essa constante com o ID do ambiente de produção (ou troque-a para ler uma variável, como `process.env.EITRI_PROD_ENV_ID`, e crie o secret correspondente).

## Como publicar uma nova versão

1. No `eitri-app.conf.js` do app alterado, incremente `version` (ex.: `1.0.4` → `1.0.5`).
2. Opcionalmente, preencha `versionMessage` (ou `messageVersion`) com a descrição da versão; ela vai como mensagem do `eitri push-version`. Não use aspas simples (`'`) na mensagem, porque ela é passada entre aspas simples para o shell.
3. Se alterou o app compartilhado, atualize também a versão dele nas `eitri-app-dependencies` dos apps que o consomem e incremente a versão desses apps, para que eles sejam republicados com o shared novo.
4. Faça commit e push para `main`. Apps cuja versão não mudou são ignorados.

## Rodando o script localmente

```bash
npm install -g eitri-cli
export EITRI_CLI_CLIENT_ID=...
export EITRI_CLI_CLIENT_SECRET=...
export EITRI_DEV_ENV_ID=...   # opcional
node check_and_push.js
```

Requer Node.js 18 ou superior (o script usa o `fetch` nativo). Cuidado: rodar localmente **publica de verdade** e cria/envia as tags git.
