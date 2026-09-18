# ZipFrames Packages

Pacotes npm compartilhados pelos serviços do [ZipFrames](https://github.com/knzt/zipframes).

Eles vivem fora do repositório da aplicação de propósito: publicados e versionados, cada serviço declara a versão que usa e adota uma mudança quando decide subir de versão, em vez de ser afetado no mesmo instante em que o pacote muda.

## Pacotes

| Pacote                                               | Conteúdo                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| [`@zipframes/schemas`](packages/schemas)             | Contratos de eventos e de API, organizados por serviço em `src/services` |
| [`@zipframes/value-objects`](packages/value-objects) | Value objects genéricos e o value object base                            |
| [`@zipframes/core`](packages/core)                   | `Result`, branded types e erros base                                     |
| [`@zipframes/communication`](packages/communication) | Publisher, consumer, retry e DLQ                                         |
| [`@zipframes/logger`](packages/logger)               | Logs estruturados com correlation ID                                     |
| [`@zipframes/telemetry`](packages/telemetry)         | Métricas Prometheus e tracing OpenTelemetry                              |
| [`@zipframes/authenticator`](packages/authenticator) | Validação de JWT via JWKS                                                |
| [`@zipframes/test-toolkit`](packages/test-toolkit)   | Base de testes de integração com Testcontainers                          |

## O que entra aqui

Um CPF válido é o mesmo em qualquer sistema do mundo, então a validação é biblioteca. Já a política de senha, as extensões de vídeo aceitas e o `VideoStatus` são regras de um contexto específico e ficam dentro do serviço que as define.

Entra aqui:

- o que é universal, definido por uma norma, uma RFC ou um órgão externo;
- o que é puramente técnico, sem regra de negócio de nenhum contexto;
- contratos que mais de um serviço precisa enxergar da mesma forma.

## Documentação

| Documento                                           | Conteúdo                                             |
| --------------------------------------------------- | ---------------------------------------------------- |
| [Estrutura](docs/estrutura.md)                      | Organização do repositório e de cada pacote          |
| [Value objects](docs/value-objects.md)              | O contrato do value object base e como criar os seus |
| [Versionamento e publicação](docs/versionamento.md) | Semver, changesets e o fluxo de release              |

## Estrutura

```
zipframes-packages/
├── packages/
│   ├── schemas/
│   ├── value-objects/
│   ├── core/
│   ├── communication/
│   ├── logger/
│   ├── telemetry/
│   ├── authenticator/
│   └── test-toolkit/
└── docs/
```

## Status

O repositório está na fase de estrutura e documentação. Setup, configurações base e implementação dos pacotes ainda não foram feitos.
