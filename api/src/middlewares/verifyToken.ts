import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export function verifyToken<P = {}, Q = {}, B = {}>(
	req: Request<P, Q, B>,
	res: Response,
	next: NextFunction
) {
	const token = req.header("auth-token");
	if (token) {
		try {
			if (process.env.TOKEN_SECRET) {
				const verified = <JwtPayload>verify(token, process.env.TOKEN_SECRET);
				req.headers.user = verified.id;
				next();
			} else throw new Error("Server error: Secret missing");
		} catch (error: any) {
			res.status(400).send({ error: error.message });
		}
	} else res.status(401).send({ error: "Access denied" });
}
