import fs from "fs";
import path from "path";

export default (req: any, res: any) => {
    function Grade(text: any) {
        if (text.trait_type === "Background" || text.trait_type === "background") {
            return true;
        }
    }

    var dirRelativeToPublicFolder = "metadata";
    var dir = path.resolve("./public", dirRelativeToPublicFolder);
    var metadatas: any = fs.readdirSync(dir);
    for (var i = 0; i < metadatas.length; i++) {
        metadatas[i] = parseInt(metadatas[i].slice(0, -5));
    }
    metadatas = metadatas.sort(function (a: any, b: any) {
        return a - b;
    });
    for (var i = 0; i < metadatas.length; i++) {
        metadatas[i] = `${metadatas[i]}.json`;
    }

    const sort: any = metadatas.map((file: any) => JSON.parse(fs.readFileSync(`${dir}/${file}`, "utf8"))["name"].split(" ")[1]);
    const grade: any = metadatas.map((file: any) =>
        JSON.parse(fs.readFileSync(`${dir}/${file}`, "utf8"))
            ["attributes"].find(Grade)
            ?.value.includes("Private")
            ? "rare"
            : "basic"
    );

    var dirRelativeToPublicFolder = "image";
    var dir = path.resolve("./public", dirRelativeToPublicFolder);
    var images: any = fs.readdirSync(dir);
    for (var i = 0; i < metadatas.length; i++) {
        images[i] = parseInt(images[i].slice(0, -4));
    }
    images = images.sort(function (a: any, b: any) {
        return a - b;
    });

    var tokenId: any = [];
    tokenId = tokenId.concat(images);

    for (var i = 0; i < images.length; i++) {
        images[i] = `${images[i]}.png`;
    }

    res.statusCode = 200;
    res.send({ tokenId: tokenId, image: images, sort: sort, grade: grade });
};
