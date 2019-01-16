const sql = require('mssql')
const fs = require('fs')
const iconvlite = require('iconv-lite')

const archivo= 'C:/Users/arbolanos/Documents/MIGRACION/Intelisis5000/Reportes MAVI/CteCto_TBL_MAVI.esp'

const configuracion={
    user: 'arbolanos',
    password: 'Ramona041995',
    server: '172.16.202.9',
    database: 'IntelisisTmp'
}
let consumo=[]

sql.connect(configuracion, (error) =>{
    if(error) console.log(error)
    let consu = new sql.Request()
     consu.query("select name from sys.objects where type='P'",
     (error, result) => {
         if(error) console.log(error)
         let resultSQL= result.recordset
         for(let i =0; i <resultSQL.length; i ++)
         {
             let item= resultSQL[i]['name']
             consumo.push(item)
         }
         //console.log(consumo)
         sql.close()
         let texto = recod(archivo, 'latin1')
         let sps = []
         //recorre el arreglo y crea una expresion con el contenido del arreglo y hace match
        for (key in consumo) {
            let campoRegEx = new RegExp(`${consumo[key]}`, `gim`)
            if (campoRegEx.test(texto)) {
                sps +='\n'+texto.match(campoRegEx)
            }
        }
        console.log(sps)
     })
})

function recod (archivo, recodificacion) {
    return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}