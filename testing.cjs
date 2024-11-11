
setInterval(() => {
    console.log('Refreshing Token');
    const rand = require("crypto").randomBytes(64).toString("hex");
    console.log(rand);
}, 1000 * 30);