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

O controle é feito com [Changesets](https://github.com/changesets/changesets):

1. O pull request que muda um pacote inclui um changeset descrevendo o tipo da mudança e o porquê.
2. No merge, o changeset é acumulado.
3. O release consome os changesets, sobe as versões, gera o changelog e publica.

O changelog sai do que foi escrito nos changesets, então vale descrever a mudança pensando em quem vai ler para decidir se atualiza.

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
