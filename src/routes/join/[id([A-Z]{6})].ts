import { generateCookie } from "../../lib/authentication";

export async function get(req, res) {
    const gameId = req.params.id;

    // Do not overwrite the browser's current key.
    if (!(gameId in req.cookies)) {
        res.setHeader('Set-Cookie', generateCookie(req.params.id, 1, `/game/${gameId}`));
    }

    res.setHeader('Location', `/game/${gameId}`);
    res.statusCode = 302;
    res.end();
}