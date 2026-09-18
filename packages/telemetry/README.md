# @zipframes/telemetry

Métricas Prometheus e tracing OpenTelemetry.

## O que é

- registro de métricas e helpers para as métricas técnicas comuns
- inicialização do OpenTelemetry
- propagação do contexto W3C em HTTP e nas mensagens

## O que não é

- métricas de negócio específicas de um serviço, que são definidas nele
- logs, que vivem em `@zipframes/logger`

## Estrutura

```
src/metrics
src/tracing
test
```

Separado do `logger` porque traz um SDK pesado e nem todo serviço precisa dele desde o começo.

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
