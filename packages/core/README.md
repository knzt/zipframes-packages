# @zipframes/core

Tipos e utilitários de domínio sem dependência externa nenhuma.

## O que é

- `Result`, com `ok`, `err` e combinadores
- branded types
- erros base de domínio e de aplicação

## O que não é

- qualquer coisa que importe uma biblioteca externa
- helpers de infraestrutura, como cliente HTTP ou acesso a banco

## Estrutura

```
src/branded
src/errors
src/result
test
```

Junto com `value-objects`, é o único pacote que a camada de domínio dos serviços pode importar.

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
