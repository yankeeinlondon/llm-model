# LLM Model

![screenshot](./docs/screenshot.png)

## Installation

```sh
bun install -g @yankeeinlondon/llm-model
```

## Features


### Search

- allows easy searching of Hugging Face models from command line

    ![search](./docs/search.png)

### Model Serving

- Run singular models or use _speculative sampling_ with two models running in parallel
- allows for interactive input or pure CLI model specification

    ![run](./docs/run.png)


### Benchmarking

- produces tabular format for easy comparison (JSON also available)
- caches results so that quick cross-model views are possible
- you can give a partial match for model name _or_ run interactively

    ![benchmarks](./docs/benchmarks.png)

### List and Lifecycle

- List all local models available for serving
- List any currently running servers

    ![list](./docs/list.png)

- stop servers with a `PID`,  _friendly name reference_, or stop all with `all`

    ![stop](./docs/stop.png)

