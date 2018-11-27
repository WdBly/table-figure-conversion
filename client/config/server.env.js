
var API_ROOT = require("./localhost.json")

module.exports = {
    "process.env": {
        NODE_ENV:JSON.stringify(process.env.NODE_ENV || "production"),
        API_ROOT:JSON.stringify(API_ROOT.API_ROOT)
    }
};


