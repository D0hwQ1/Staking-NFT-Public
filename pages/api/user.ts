import jwt from "jsonwebtoken";
var axios = require("axios");
var fs = require("fs");
var mongoose = require("mongoose");
var users = require("../../db/schema.ts");

require("dotenv").config;

export default async (req: any, res: any) => {
    const Pub = fs.readFileSync(`${__dirname}/../../../../key/pub.key`, "utf8");
    var verifyOptions: any = {
        expiresIn: "1h",
        algorithm: ["RS256"],
    };

    await mongoose
        .connect(`mongodb://${process.env.ID}:${process.env.KEY}@localhost:27017/admin`, { dbName: "staking" }, { useNewUrlParser: true })
        .catch((e: any) => console.error(e));

    switch (req.body.command) {
        case "staking":
            try {
                var addr: any = jwt.verify(req.body.addr, Pub, verifyOptions);
                addr = addr.addr;

                var result = await users.findOneAndUpdate(
                    { addr: { $regex: addr, $options: "i" } },
                    { $push: { stake: { tokenId: req.body.id, initstamp: Date.now(), prevstamp: Date.now() } } },
                    { new: true, upsert: true }
                );
                await mongoose.connection.close();

                console.log("staking", result);
                res.statusCode = 200;
                return res.send("success staking");
            } catch (e: any) {
                console.log(e);
                res.statusCode = 400;
                return res.send("fail staking");
            }
        case "unstaking":
            try {
                var addr: any = jwt.verify(req.body.addr, Pub, verifyOptions);
                addr = addr.addr;

                var result = await users.findOneAndUpdate(
                    { addr: { $regex: addr, $options: "i" } },
                    { $pull: { stake: { tokenId: req.body.id } } },
                    { new: true }
                );
                await mongoose.connection.close();

                console.log("unstaking", result);
                res.statusCode = 200;
                return res.send("success unstaking");
            } catch (e: any) {
                console.log(e);
                res.statusCode = 400;
                return res.send("fail staking");
            }
        case "login":
            var metadata = (await axios.get(`http://localhost/api/metadata`)).data;
            var data: any = (await users.find({ addr: { $regex: req.body.addr, $options: "i" } }))[0];

            if (data == undefined) {
                data = await users.findOneAndUpdate(
                    { addr: { $regex: req.body.addr, $options: "i" } },
                    { addr: req.body.addr, stake: [], point: 0 },
                    { new: true, upsert: true }
                );

                data = (await users.find({ addr: { $regex: req.body.addr, $options: "i" } }))[0];
            } else if (data.stake != []) {
                var len = data.stake.length;
                for (var i = 0; i < len; i++) {
                    var prevTime = data.stake[i].prevstamp.getTime();
                    var hours = Math.floor(Math.abs(Date.now() - prevTime) / 36e5);
                    var newstamp = new Date(prevTime + hours * 1000 * 60 * 60);
                    var grade = metadata.grade[metadata.tokenId.indexOf(parseInt(data.stake[i].tokenId))];
                    var point = grade == "rare" ? data.point + hours * 900 : data.point + hours * 300;

                    data = await users.findOneAndUpdate(
                        { "stake.tokenId": data.stake[i].tokenId },
                        {
                            $set: {
                                "stake.$.prevstamp": newstamp,
                                point: point,
                            },
                        },
                        { new: true }
                    );

                    data = (await users.find({ addr: { $regex: req.body.addr, $options: "i" } }))[0];
                }
            }

            await mongoose.connection.close();
            res.statusCode = 200;
            return res.send(data);

        case "all":
            var metadata = (await axios.get(`http://localhost/api/metadata`)).data;
            var tmp: any = await users.find();

            for (var j = 0; j < tmp.length; j++) {
                var data = tmp[j];
                if (data.stake != [] && data.stake.length > 0) {
                    var len = data.stake.length;
                    for (var i = 0; i < len; i++) {
                        var prevTime = data.stake[i].prevstamp.getTime();
                        var hours = Math.floor(Math.abs(Date.now() - prevTime) / 36e5);
                        var newstamp = new Date(prevTime + hours * 1000 * 60 * 60);
                        var grade = metadata.grade[metadata.tokenId.indexOf(parseInt(data.stake[i].tokenId))];
                        var point = grade == "rare" ? data.point + hours * 900 : data.point + hours * 300;

                        data = await users.findOneAndUpdate(
                            { "stake.tokenId": data.stake[i].tokenId },
                            {
                                $set: {
                                    "stake.$.prevstamp": newstamp,
                                    point: point,
                                },
                            },
                            { new: true }
                        );
                    }
                }
                console.log(`현황: ${j + 1}/${tmp.length}`);
            }
            console.log("all refresh");

            await mongoose.connection.close();
            res.statusCode = 200;
            return res.send(data);
    }
};
