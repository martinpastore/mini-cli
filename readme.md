# Mayo CLI

### Installation

To start using mayo-cli

```sh
$ npm install -g mayo-cli
```

### Usage

To start a new project, you should use 
```sh
$ mayo init --name test
```
> name is an optional parameter for your project, by default, the name will be burgerjs-test.

To create a new component/page, you should use
```sh
$ mayo new --name home --type page
```
> name is an obligatory parameter to set the name of the component.
> type is an obligatory parameter to define if it will be a component or a page.

To build your bundle, you should use
```sh
$ mayo build
```

To run your project, you should use
```sh
$ mayo run --port 3000
```
> port is an optional parameter to set the port, by default, the project will be initialized in port 8080.

### License
MIT
