# @zipframes/test-toolkit

Base para os testes de integração dos serviços.

## O que é

- containers prontos de PostgreSQL, RabbitMQ, Redis e storage compatível com S3
- helpers de ciclo de vida, como subir, migrar e limpar entre testes
- builders e dados de apoio

## O que não é

- fixtures de domínio de um serviço, que ficam nele
- qualquer coisa usada em tempo de execução

## Estrutura

```
src/containers
src/fixtures
test
```

Sempre declarado como `devDependency` nos serviços.

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
