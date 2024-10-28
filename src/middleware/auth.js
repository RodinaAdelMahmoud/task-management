import userModel from './../../db/models/user.model.js';
import jwt from 'jsonwebtoken';

export const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(400).json({ msg: "Token not provided" });
            }

            if (!token.startsWith(process.env.BearerKey)) {
                return res.status(400).json({ msg: "Invalid token format" });
            }

            const newToken = token.split(process.env.BearerKey)[1];

            if (!newToken) {
                return res.status(400).json({ msg: "Invalid token" });
            }

            const decoded = jwt.verify(newToken, process.env.signatureKey);

            if (!decoded?.email) {
                return res.status(400).json({ msg: "Invalid token payload" });
            }

            const user = await userModel.findOne({ email: decoded.email });

            if (!user) {
                return res.status(409).json({ msg: "User does not exist" });
            }

            if (!roles.includes(user.role)) {
                return res.status(400).json({ msg: "You don't have permission" });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(400).json({ msg: "Token verification failed", error });
        }
    };
};
