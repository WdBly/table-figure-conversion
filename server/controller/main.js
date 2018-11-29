
const xl =require('xlsx');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,"../../");
import responseJson from "../util/responseJson";

async function getAllTables(ctx) {
    return new Promise((resolve, reject) => {
        fs.readdir(`${root}/table`, function(err, picFiles) {
            if(err){
                ctx.throw(err)
            };
            resolve(picFiles.filter(item => /\.xlsx$/.test(item) && !/^~/.test(item)));
        })
    })
}



const mainController = async function (ctx,body) {

    var table_names = await getAllTables(ctx);
    table_names = table_names.length && table_names.map(item => {

        var workbook =  xl.readFile(`${root}/table/${item}`);

        return {
            value: item,
            label: item,
            children: workbook.SheetNames.map(name => ({
                value: name, 
                label: name
            }))
        }         
    })

    ctx.body = responseJson(200, table_names, "success");
}

const sheetController = async function (ctx,body) {

    var workbook =  xl.readFile(`${root}/table/${body[0]}`);

    var data = {
        row: xl.utils.sheet_to_json(workbook.Sheets[body[1]]).length + 1,
        column: [...new Set(Object.keys(workbook.Sheets[body[1]]).filter(item => !/^\!/.test(item)).map(item => item.replace(/\d+$/,"")))],
        json: xl.utils.sheet_to_json(workbook.Sheets[body[1]]),
        data: workbook.Sheets[body[1]]
    }

    ctx.body = responseJson(200, data, "success");
}


const loginController = async function (ctx,body) {

    let data = 0;
    if(body.name === "cxr" && Number(body.password) === 123456){
        data = 1;
    }
    ctx.body = responseJson(200, data, "success");
}


const user_ctrl = {
    mainController,
    sheetController,
    loginController
}

module.exports = user_ctrl;