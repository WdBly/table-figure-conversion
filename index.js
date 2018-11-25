// var xlsx = require('node-xlsx');
// var fs = require('fs')

// var target_sheets = xlsx.parse("./target/target.xlsx");
// var source_sheets = xlsx.parse("./source/test2.xlsx");

// var file_data = target_sheets[0].data.filter((item, index) => item.length > 0 && index < 2);

// var source_data = source_sheets[2].data.filter((item, index) => index !== 0);

// console.log(source_data[4][18]);

// const range = [
//     {s: {c: 0, r:0 }, e: {c:2, r:0}},
//     {s: {c: 3, r:0 }, e: {c:5, r:0}},
//     {s: {c: 7, r:0 }, e: {c:8, r:0}}
// ]; 
// const option = {'!merges': range};

// var buffer = xlsx.build([{name: "mySheetName", data: [...file_data, ...source_data]}],option);

// console.log(buffer);


// fs.writeFile('./target/target.xlsx', buffer, function (err){
//     if (err) throw err;
//     console.log('Write to xls has finished');
// });


var xl =require('xlsx');
var workbook =  xl.readFile("./source/echarts.xlsx");

var target_sheets = workbook.Sheets["Sheet1"];

console.log(target_sheets);



//返回json数据
var dataa =xl.utils.sheet_to_json(workbook);
