import jwt from 'jsonwebtoken';

const secret = "secretKey";

export default {
    sign: payload => jwt.sign(payload, secret),
    verify: token => jwt.verify(token, secret)
}