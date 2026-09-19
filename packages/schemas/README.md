# @zipframes/schemas

Contratos de eventos e de API do ZipFrames, organizados por serviço publicador.

## O que é

- schemas dos eventos de integração, com envelope e versão
- schemas de request e response das APIs HTTP
- tipos derivados dos schemas, para uso em tempo de compilação

## O que não é

- regra de negócio de qualquer contexto
- validação que depende do estado do sistema (isso é use case)
- schemas usados por um único serviço, que ficam nele

## Estrutura

```
src/services/auth-service
src/services/notification-service
src/services/processor-worker
src/services/video-service
src/shared
test
```

A pasta de cada serviço traz os contratos que **aquele serviço publica**. Quem consome importa do publicador, o que deixa a titularidade do contrato explícita no import.

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.

Ainda não depende de `@zipframes/core`: a dependência entra no `package.json` junto com o primeiro código que a usa, não antes.
