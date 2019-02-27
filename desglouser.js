const gt = require('./Utilerias/Abductor/cmpInObj')

const { carpetas } = require('./Utilerias/Archivos/jsonCarpetas')
const rgx = require('./Utilerias/RegEx/jsonRgx')
const { decode } = require('./Utilerias/OperadorObjetos/decode')
const { extraerContenidoRecodificado } = require('./Utilerias/Codificacion/contenidoRecodificado')
const { unirCamposConsecutivosComponente } = require('./Utilerias/OperarCadenas/unirConsecutivoPorComponente')
const { desglozar } = require('./Utilerias/OperadorObjetos/desglozar')

const pathFile = './Testing\\DM0269OrdenadorRutaDeRepartoFrm.frm'

let obj = {}

obj[rgx.Borrar.clsRuta(pathFile)] = desglozar(
    decode(
        rgx.Borrar.clsComentariosIntls(
            unirCamposConsecutivosComponente(
                extraerContenidoRecodificado(pathFile)
            )
        ).replace(/&/g, '') + '\n['
    )
)

// console.log(obj)

for (key in obj) {
    // console.log(obj[key])
    for (key2 in obj[key]) {
        //console.log(obj[key][key2])
    }
}