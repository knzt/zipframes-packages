# @zipframes/communication

Publicação e consumo de eventos, com retry e DLQ, encapsulando o broker.

## O que é

- publisher com confirms e suporte ao outbox relay
- consumer com ack manual e prefetch configurável
- retry com backoff e roteamento para a DLQ
- declaração de exchanges, filas e bindings

## O que não é

- decisão sobre o que fazer com a mensagem, que é do use case
- schemas dos eventos, que vivem em `@zipframes/schemas`

## Estrutura

```
src/consumer
src/publisher
src/retry
src/topology
test
```

Nenhum serviço importa `amqplib` diretamente: o broker fica atrás das interfaces deste pacote.

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
