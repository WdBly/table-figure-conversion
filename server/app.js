const path = require('path');
const koa = require('koa');
const webpack = require("webpack");
const webpack_config = require("../webpack/webpack.config.js");
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
const bodyParser = require("koa-bodyparser");
const serverStatic = require("koa-static");
const views = require("koa-views");
const cors = require("koa2-cors");
const historyApiFallback = require('koa2-connect-history-api-fallback');
const router = require("./routers");
import jwtAuth from "./util/jwtAuth.js"

const app = new koa();

const compiler = webpack(webpack_config);

var publicPath = "";

app.use(historyApiFallback());

app.use(bodyParser());

if(process.env.NODE_ENV === "development") {

    publicPath = path.resolve(__dirname,"./template");

    app.use(devMiddleware(compiler,{
        publicPath:"/",
        stats: {
            colors: true
        }
    }));
    
    app.use(hotMiddleware(compiler, {
    }))

}else {
    app.use(serverStatic(path.resolve(__dirname, "../dist")));
    publicPath = path.resolve(__dirname,"../dist");
}

app.use(views(publicPath));

app.use(cors({
    origin: function(ctx) {
      if (ctx.url === '/error') {
        return false;
      }
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','Last-Access-Time'], //必须加上 Last-Access-Time 否则js拿不到
    maxAge: 5000,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','Last-Access-Time'],
}));

app.use(jwtAuth)

// api接口
router(app);

 
app.listen(process.env.PORT,() => {
    console.log("success");
});





// var workbook =  xl.readFile("./source/echarts.xlsx");

// var target_sheets = workbook.Sheets["Sheet1"];

// console.log(target_sheets);



// //返回json数据
// var dataa =xl.utils.sheet_to_json(workbook);




























