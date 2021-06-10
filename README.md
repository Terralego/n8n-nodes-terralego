# Terralego n8n nodes

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/docs/images/n8n-logo.png)

This packages contains n8n nodes that are used in Terralego context.

## Install

This package should be installed alongside with n8n to allow module auto discoverage. See [instructions here](https://docs.n8n.io/nodes/creating-nodes/node-dev-cli.html#create-own-custom-n8n-nodes-module)

```sh
npm install n8n-nodes-terralego
```

## Development

### Install dependencies

```sh
npm ci
```

### Build

```
npm run build # or `dev` to enable watch mode while coding
```

### Link with n8n while developing

Instructions from [here](https://docs.n8n.io/nodes/creating-nodes/node-dev-cli.html#development-testing-of-custom-n8n-nodes-module).

In this folder:

```sh
# Build the code
npm run build

# "Publish" the package locally
npm link
```

In the folder where n8n is installed and executed:

```sh
# "Install" the above locally published module
npm link n8n-nodes-terralego

# Start n8n
n8n
```

/!\ After each code modifications, you have to rebuild this package and restart n8n.

## License

[Apache 2.0 with Commons Clause](https://github.com/terralego/n8n-nodes-terralego/blob/master/LICENSE.md)
