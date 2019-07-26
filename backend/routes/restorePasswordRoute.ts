import { Router, Request, Response, NextFunction } from 'express';
const router: Router = Router();

router.get(
	'/reset-password/:token',
	async (req: Request, res: Response, next: NextFunction) => {
		const { token } = req.params;
		if (!token) return res.send('חסר טוקן, אנא נסה שנית').end();
	}
);
