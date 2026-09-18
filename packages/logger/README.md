# @zipframes/logger

Logs estruturados em JSON com correlation ID.

## O que é

- logger estruturado, com serviço, versão e nível
- propagação de `correlationId` entre requisições e mensagens
- redação de campos sensíveis

## O que não é

- métricas e tracing, que vivem em `@zipframes/telemetry`
- envio de logs para um destino específico

## Estrutura

```
src/correlation
src/logger
test
```

É dependência de todo serviço desde o primeiro dia, então é deliberadamente leve: não carrega o SDK do OpenTelemetry junto.

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
