

const routerTable = {
    api:{
        main:{
            "table":{
                ctrl:"mainController",
                method:"GET",
                need_auth:false
            },
            "sheet":{
                ctrl:"sheetController",
                method:"POST",
                need_auth:false
            },
            "login":{
                ctrl:"loginController",
                method:"POST",
                need_auth:false
            },
            "upload":{
                ctrl:"uploadController",
                method:"POST",
                need_auth:true
            }
        }
    }
}

module.exports = routerTable














