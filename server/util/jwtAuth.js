import routerTable from "../routers/routerTable"

async function jwtAuth(ctx, next) {
    let obj = ctx.url.split("/").filter(item=>item).reduce((prev,next) => prev[next],routerTable);

    if(!obj || !obj.need_auth){
        await next();
    }else {

        let token = ctx.header.authorization;
        if(token === "cxrloginsuccess"){
            await next();
        }else {
            ctx.body = {code: 10001, data: null, message: "未登录"};
        }
    
    }
}




module.exports = jwtAuth;