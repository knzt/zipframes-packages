# @zipframes/authorizer

Validação de JWT via JWKS.

## O que é

- busca e cache das chaves públicas publicadas pelo auth-service
- verificação de assinatura, emissor, audiência e expiração
- extração das claims para o contexto da requisição

## O que não é

- emissão de tokens, que pertence ao auth-service
- autorização por regra de negócio, como "só o dono vê o vídeo"

## Estrutura

```
src/jwks
src/verify
test
```

Valida o token e diz quem é o usuário. O que esse usuário pode fazer é decisão do serviço.

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
