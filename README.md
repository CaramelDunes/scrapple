# [Scrapple - Play Here!](https://scrapple.carameldunes.fr) [![Build Status](https://api.cirrus-ci.com/github/CaramelDunes/scrapple.svg)](https://cirrus-ci.com/github/CaramelDunes/scrapple)

Yet another word game.

Powered by Svelte.

## Usage

Build the bundles.
```bash
npm install
npm run build
```

Set the following environment variables.
```bash
export PUSHER_APP_ID=""
export PUSHER_KEY=""
export PUSHER_SECRET=""
export PUSHER_CLUSTER=""
```

Games are stored as JSON files by default.
If you wish to use Firebase Realtime Database instead, set the following and make sure the default service account has the Realtime Database Admin role.
```bash
export FIREBASE_DATABASE_URL=""
```

Start the server.
```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Contributing

Feel free to report or fix any bug you might encounter.

You can also add any features such as support for other languages.

## Credits

- Ma biche, for coming up with the name Scrapple.

## License

Licensed under the MIT license. See LICENSE for more information.