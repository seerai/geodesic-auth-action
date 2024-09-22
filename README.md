# Geodesic Auth Action

Authenticate the Geodesic API with an API key from a github secret.

## Usage

To use this action, simply include the following step in your github action
workflow

```yaml
   - name: Authenticate Geodesic
      uses: seerai/geodesic-auth-action@v1
      with:
         api-key: ${{ secrets.GEODESIC_API_KEY }}
```

It doesnt matter if this action comes before or after you install the Geodesic
Python API but it will need to come before any actions are taking that will
touch the geodesic server.

A full github action job might look like:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.10

      - name: Setup Geodesic
        run: |
          python -m pip install geodesic-api

      - name: Authenticate Geodesic
        uses: seerai/geodesic-auth-action@v1
          with:
            api-key: ${{ secrets.GEODESIC_API_KEY }}

      - name: Do something with Geodesic
        run: |
          python my_geodesic_script.py
```

## Inputs

- `api-key`: (Required) The API key to use with Geodesic. This should always be
  a github secret so that no API keys get leaked. Do not put plain text keys in
  actions, even if they are private repos.

- `geodesic-host`: (Optional) The Geodesic API you wish to use. If not provided
  this defaults to the SaaS platform at https://api.geodesic.seerai.space. If
  you are using a self hosted version of Geodesic you can use this option to
  specify the location of the root API.

## Development

If you wish to contribute to this action, the following are the steps to install
and test it locally.

### Initial Setup

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop your action.

You will need nodejs installed. This is easy to with conda.

```bash
conda create -n gha nodejs=21.6.2
conda activate gha
```

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

1. :building_construction: Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. :white_check_mark: Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```

> [!NOTE]
>
> Everytime you make changes to any of the typescript, you must run
> `npm run bundle` before pushing or the CI will fail. It is also recommended
> that you run `npm test` and `npx prettier --write .` before commiting to make
> sure there are no errors and that the linter CI will pass.
