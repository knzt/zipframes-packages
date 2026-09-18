# @zipframes/value-objects

Value objects genéricos e a base para criar os seus dentro de cada serviço.

## O que é

- value objects universais: e-mail, telefone, CPF, CNPJ, CEP e endereço
- a base que padroniza criação validada, imutabilidade, igualdade por valor, serialização e branded type

## O que não é

- value objects com regra de um contexto, como `Password`, `VideoStatus` ou `FileName`
- dependência de bibliotecas de validação ou de framework

## Estrutura

```
src/address
src/base
src/contact
src/document
test
```

O contrato da base está em [docs/value-objects.md](../../docs/value-objects.md).

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
