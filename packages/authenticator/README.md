# @zipframes/authenticator

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

Autenticação, não autorização: o pacote diz **quem** é o usuário, verificando o token. **O que** ele pode fazer é regra de cada serviço, como "só o dono vê o vídeo".

## Status

Estrutura e documentação definidas. Setup, configuração e implementação pendentes.
