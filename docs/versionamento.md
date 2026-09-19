# Versionamento e publicação

## Semver, com atenção aos contratos

Cada pacote tem sua própria versão e segue [semver](https://semver.org/lang/pt-BR/):

| Mudança                                                        | Versão |
| -------------------------------------------------------------- | ------ |
| Correção sem mudar a API                                       | patch  |
| Novidade compatível, como um campo opcional ou uma função nova | minor  |
| Qualquer coisa que quebre quem já usa                          | major  |

Para o `schemas` a régua é mais rígida, porque ele é o published language entre serviços: **tornar um campo obrigatório, remover um campo ou mudar o tipo de um campo existente é major**, mesmo que o TypeScript não reclame. Quem valida a mensagem em tempo de execução vai reclamar.

Quando um contrato de evento muda de forma incompatível, a prática é publicar a nova versão do evento **ao lado** da anterior e manter as duas até todos os consumidores migrarem, em vez de trocar o schema no lugar.

## Fluxo de release

O controle é feito com [Changesets](https://github.com/changesets/changesets), automatizado pelo workflow `.github/workflows/release.yml`:

1. O pull request que muda um pacote inclui um changeset (`pnpm changeset`), descrevendo o tipo da mudança e o porquê. O arquivo gerado em `.changeset/` é só texto, então entra no mesmo PR do código.
2. No merge à `main`, o workflow encontra o changeset pendente e abre (ou atualiza) um pull request **"Version Packages"**, com as versões calculadas e o changelog já escrito.
3. Revisar e mergear esse PR é o ato de decidir publicar. Ao mergear, o mesmo workflow roda de novo, não encontra mais changesets pendentes e publica as versões daquele PR no GitHub Packages.

Esse PR intermediário existe de propósito: mesmo sozinha, ter um passo explícito entre "acumulei mudanças" e "isso vai para o registry" evita publicar algo pela metade.

O changelog sai do que foi escrito nos changesets, então vale descrever a mudança pensando em quem vai ler para decidir se atualiza.

### Sem bump automático entre pacotes

Quando `@zipframes/core` sobe de versão, `@zipframes/value-objects` (que vai depender dele) **não** ganha uma versão nova sozinho. Ele só é republicado quando tiver seu próprio changeset, descrevendo o que mudou nele.

A única exceção é mecânica, não de conteúdo: se a versão nova do `core` ficar fora da faixa (`^`) que o `value-objects` declara no `package.json`, o Changesets sobe o `value-objects` em patch só para corrigir essa faixa, sem gerar mudança de comportamento nem entrada de changelog além de "dependência atualizada". É o `updateInternalDependents: "out-of-range"` do `.changeset/config.json`, o modo mais conservador que a ferramenta oferece: nenhum pacote é tocado por conveniência, só quando a faixa declarada deixaria de fazer sentido.

## Testar antes do merge: snapshots

Todo pull request para a `main` que tenha um changeset pendente (`.github/workflows/prerelease.yml`) publica automaticamente uma versão de teste dos pacotes que ele muda, sem tocar na versão real:

1. O workflow roda `changeset status --since=origin/main`. Sem changeset novo introduzido pelo PR, ele não faz nada — é assim que se sabe que o PR é de `feat` ou `fix` sem depender de ler a mensagem do commit: a convenção deste repositório é que toda mudança visível vem com changeset, então "tem changeset" e "é feat ou fix" coincidem na prática.
2. Havendo changeset, ele roda `changeset version --snapshot pr<número>` numa cópia descartável do repositório, nunca commitada. A versão fica no formato `0.1.0-pr7-20260101120000`: o próximo número real, seguido da tag do PR e de um timestamp.
3. Publica no GitHub Packages com `changeset publish --tag pr<número>`, então o pacote fica instalável sem disputar a tag `latest` com a versão de verdade.
4. Comenta no PR a versão publicada de cada pacote, atualizando o mesmo comentário a cada novo push, em vez de acumular um por commit.

Para testar:

```bash
pnpm add @zipframes/core@pr7
```

O merge do PR não promove esse snapshot a versão real. Quem decide a versão definitiva continua sendo o changeset que já está no PR, pelo fluxo normal descrito acima.

## Onde os pacotes são publicados

No **GitHub Packages**, no escopo `@zipframes`. Consumir exige apontar o escopo para o registry do GitHub em um `.npmrc`:

```
@zipframes:registry=https://npm.pkg.github.com
```

Em repositório público, tanto a publicação quanto o consumo são gratuitos.

## Como os serviços consomem

Por faixa de versão, nunca por `workspace:*` ou por link local:

```json
{
  "dependencies": {
    "@zipframes/core": "^1.2.0",
    "@zipframes/schemas": "^2.0.0"
  }
}
```

É isso que dá autonomia ao serviço: uma mudança no pacote só chega quando o serviço decide subir de versão, com CI verde para provar que nada quebrou.

## Durante o desenvolvimento

Enquanto um pacote e um serviço evoluem juntos, `pnpm link` ou `npm link` resolvem sem publicar uma versão a cada tentativa. O link é temporário e nunca é commitado: o `package.json` do serviço continua declarando a faixa de versão.
