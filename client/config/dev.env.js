
import API_ROOT from "./localhost.json"

module.exports = {
    "process.env": {
        NODE_ENV:JSON.stringify(process.env.NODE_ENV || "development"),
        API_ROOT:JSON.stringify(API_ROOT.API_ROOT)
    }
};