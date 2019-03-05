const gt = require('./Utilerias/Abductor/cmpInObj')

const { carpetas } = require('./Utilerias/Archivos/jsonCarpetas')
const rgx = require('./Utilerias/RegEx/jsonRgx')
const { decode } = require('./Utilerias/OperadorObjetos/decode')
const { extraerContenidoRecodificado } = require('./Utilerias/Codificacion/contenidoRecodificado')
const { unirCamposConsecutivosComponente } = require('./Utilerias/OperarCadenas/unirConsecutivoPorComponente')
const { desglozar } = require('./Utilerias/OperadorObjetos/desglozar')

const pathFile = './Testing\\DM0269OrdenadorRutaDeRepartoFrm.frm'

let obj = {}

let objFile =  decode(
    rgx.Borrar.clsComentariosSQL(rgx.Borrar.clsComentariosIntls(
        unirCamposConsecutivosComponente(
            extraerContenidoRecodificado(pathFile)
        )
    ).replace(/&/g, '')) + '\n['
)

let sendObj = JSON.parse( JSON.stringify( objFile ) )

obj[rgx.Borrar.clsRuta(pathFile)] = desglozar(sendObj)

console.log(obj)

/*** Recorrer el detalle ***/

// for (path in obj) {
//     //console.log(obj[key])
//     for (cmp in obj[path]['Detalle']) {
//         //console.log(obj[path]['Detalle'][cmp])
//         console.log('[' + cmp + ']')
//         for (field in obj[path]['Detalle'][cmp]) {
//             // console.log(obj[path]['Detalle'][cmp][field])
//             if (obj[path]['Detalle'][cmp][field]['objIntls']) {
//                 console.log(field + '= ',
//                 obj[path]['Detalle'][cmp][field]['objIntls'])
//                 // console.log('-----------------------------------------------')
//             }
//             if (obj[path]['Detalle'][cmp][field]['objSQL']) {
//                 // console.log('-----------------------------------------------')
//                 console.log(field + '= ',
//                 obj[path]['Detalle'][cmp][field]['objSQL'])
//                 // console.log('-----------------------------------------------')
//             }
//         }
//     }
// }