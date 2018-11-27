import routerTable from "../routers/routerTable"

async function jwtAuth(ctx, next) {
    let obj = ctx.url.split("/").filter(item=>item).reduce((prev,next) => prev[next],routerTable);

    if(!obj || !obj.need_auth){
        await next();
    }else {

        await next();
    }
}




module.exports = jwtAuth;