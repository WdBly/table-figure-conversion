
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
            children: workbook.SheetNames.map(name => {

                return {
                    value: name, 
                    label: name,
                    row: xl.utils.sheet_to_json(workbook.Sheets[name]).length + 1,
                    column: [...new Set(Object.keys(workbook.Sheets[name]).filter(item => !/^\!/.test(item)).map(item => item.replace(/\d+$/,"")))],
                    json: xl.utils.sheet_to_json(workbook.Sheets[name]),
                    data: workbook.Sheets[name]
                }
                
            }),
            
        }         
    })

    ctx.body = responseJson(200,table_names,"success");
}

const user_ctrl = {
    mainController
}

module.exports = user_ctrl;