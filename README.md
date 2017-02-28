# sdu-chiangchen

This is a terminal client of seat reservation system of Chiang Chen Library,
which is located in the central campus of Shangdong University.

## How to use this tool?

First make sure that you have Node.js installed, and clone this repo.
Then, install dependencies by npm and run:

```shell
npm install
npm run start
```

## How to configure auto login?

Just create a file named `config.json` with following content:

```json
{
  "username": "123456",
  "password": "y0ur p@ssword"
}
```

This file will not be tracked by git.

## License

MIT