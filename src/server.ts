import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(cookieParser())
	.use(json())
	.use(urlencoded({ extended: true }))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => ({
				cookies: req.cookies
			})
		}))
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
