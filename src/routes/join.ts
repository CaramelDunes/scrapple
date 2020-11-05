import { generateCookie } from "../lib/authentication";

export async function get(req, res) {
    res.setHeader('Set-Cookie', generateCookie(req.query.id, 1));
    res.setHeader('Location', `/game/${req.query.id}`);
    res.statusCode = 302;
    res.end();
}