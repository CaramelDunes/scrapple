import { generateCookie } from "../../lib/authentication";

export async function get(req, res) {
    res.setHeader('Set-Cookie', generateCookie(req.params.id, 1));
    res.setHeader('Location', `/game/${req.params.id}`);
    res.statusCode = 302;
    res.end();
}