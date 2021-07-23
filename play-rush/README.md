# play-rush

## 0. install

```sh
npm i rush -g
npm i pnpm -g
```

## 1. init

```sh
$ rush init

$ mkdir packages

$ cd mkdir packages

$ npx create-react-app react-app

$ npx tsdx create tsdx-libs
```

## 2. register

```json
// rush.json
{
  "packageName": "react-app",
  "projectFolder": "packages/react-app"
},
{
  "packageName": "tsdx-libs",
  "projectFolder": "packages/tsdx-libs"
}
```

```sh
$ rush update
```

## 3. add tsdx-libs in react-app

```sh
$ cd packages/react-app

$ rush add --package tsdx-libs
```

## 4. start

```sh
$ cd packages/react-app
$ rushx start

$ cd packages/tsdx-libs
$ rushx start
```
