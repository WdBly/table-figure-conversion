import Router from "koa-router";
import routerTable from "./routerTable"
import controller from "../controller"

const router = new Router();

function mapObject(obj,name) {
    name += "/";
    var is_child_object = false;
    for(let item in obj){
        is_child_object = false;
        for(let value in obj[item]){
            if(typeof obj[item][value] === "object"){
                is_child_object = true;
            }
        }
        if(is_child_object){
            mapObject(obj[item],name+item)
        } else {
            bindRouter(obj[item], name+item, obj[item][""]);
        }
    }
}

function bindRouter(item,url) {

    switch (item["method"]) {
        case "GET":
            router.get(url, async (ctx, next) => {
                await controller[item["ctrl"]](ctx,ctx.request.body);
                next();
            });
            break;
        case "POST":
            router.post(url, async (ctx, next) => {
                await controller[item["ctrl"]](ctx,ctx.request.body);
                next();
            });
            break;
        default:
            break;
    }

}

const routers = app => {

    app.use(router.routes(), router.allowedMethods());

    mapObject(routerTable,"");

}


module.exports = routers;
