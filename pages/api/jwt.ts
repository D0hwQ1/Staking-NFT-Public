import jwt from "jsonwebtoken";
var fs = require("fs");

const whitelist = ["http://localhost:10005", "http://mal-staking.com/", "https://mal-staking.com/", "http://mal-staking.com", "https://mal-staking.com"];

export default async (req: any, res: any) => {
    if (whitelist.indexOf(req.headers.origin) === -1 || !req.headers.origin) {
        return res.status(404).send("not allowed");
    }

    const Priv = fs.readFileSync(`${__dirname}/../../../../key/priv.key`, "utf8");

    var addr: string = req.body.addr;

    return res.json({
        token: jwt.sign(
            {
                addr: addr,
            },
            Priv,
            {
                expiresIn: "1h",
                algorithm: "RS256",
            }
        ),
    });
};
