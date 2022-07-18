# Pull Request Ticket Check Action

Verify that pull request description has ticket URL

## Overview

This Github Action helps ensure that all pull requests have an associated ticket URL in their body.

It can detect whether a reference ID (`#123`) is in the body, or even if a full URL is in the body.

It will fail the check if no ticket URL is found anywhere.
 
## Usage

In your `.github/workflows` folder, create a new `pull_request_linting.yml` file with the respective contents based on your needs.

The examples provided require some customizations unique to your codebase or issue tracking. If you're unfamiliar with building a regex, check out [Regexr](https://regexr.com/).

Make sure you check for the following to swap out with your values:

- `:owner` / `:org` - used in **all** examples
- `:repo` - used only in the GitHub example

## Examples

### GitHub

```yml
name: Pull Request Lint

on:
  pull_request:
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  title:
    name: ticket check
    runs-on: ubuntu-latest

    steps:
      - name: Check for ticket
        uses: shaharyar123/ticket-reference-available@master
        with:
          bodyRegex: '#(?<ticketNumber>\d+)'
          bodyURLRegex: 'http(s?):\/\/(github.com)(\/:owner)(\/:repo)(\/issues)\/(?<ticketNumber>\d+)'
```

### Jira

```yml
name: Pull Request Lint

on:
  pull_request:
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  title:
    name: ticket check
    runs-on: ubuntu-latest

    steps:
      - name: Check for ticket
        uses: shaharyar123/ticket-reference-available@master
        with:
          bodyRegex: 'PROJ-(?<ticketNumber>\d+)'
          bodyURLRegex: 'http(s?):\/\/(:org.atlassian.net)(\/browse)\/(PROJ\-)(?<ticketNumber>\d+)'
```

### Shortcut (formerly Clubhouse)

```yml
name: Pull Request Lint

on:
  pull_request:
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  title:
    name: ticket check
    runs-on: ubuntu-latest

    steps:
      - name: Check for ticket
        uses: shaharyar123/ticket-reference-available@master
        with:
          bodyRegex: '(CH|sc)(-?)(?<ticketNumber>\d+)'
          bodyURLRegex: 'https?:\/\/app\.(clubhouse.io|shortcut.com)(\/:org)\/story\/(?<ticketNumber>\d+)'
```

</details>

## Inputs

| Name              | Required | Description                                                                                                                                          | default                          |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| bodyRegex         |          | The regular expression used to search the body for a shorthand reference (example `#123`)                                                            | (CH)(-?)(?<ticketNumber>\d{3,})  |
| bodyRegexFlags    |          | The flags applied to the body regular expression when searching for a shorthand reference                                                            | gim                              |
| bodyURLRegex      |          | The regular expression used to search the body for a URL reference (example `https://github.com/octocat/hello-world/issues/1`)                       |                                  |
| bodyURLRegexFlags |          | The flags applied to the body regular expression when searching for a URL reference                                                                  | gim                              |