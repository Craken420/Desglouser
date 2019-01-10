const fs = require('fs')
const iconvlite = require('iconv-lite')
const archivoDLGMAVI = 'C:/Users/arbolanos/Documents/MIGRACION/Intelisis5000/Reportes MAVI' +
                       '/MenuPrincipal_DLG_MAVI.esp'

const archivoMenuPrincipal = 'C:/Users/arbolanos/Documents/MIGRACION/Intelisis5000/Codigo Original/' +
                             'MenuPrincipal.dlg'
                             
let recodificacion = 'Latin1'
const acceso = ['Herramienta.DM0269OrdenadorRutaReparto']
const carpeta= 'Archivos\\'

const jsonRegEx = {

    'clsComentarios': /\;.*/g,
    'clsAmpersand':   /\&/g,
    'reducirRuta':    /.*\\/,

    'buscarSaltoLinea': /\s\n(?=\w)(?!$)/g,
    'clsSaltoLinea': /((?=[\ \t])|^\s+|$)+/mg,
    'metodos': {
      'limpiarComentarios': texto => {return texto.replace(jsonRegEx.clsComentarios, '')},
      'limpiarRuta':        ruta => { return ruta.replace(jsonRegEx.reducirRuta, '')},
      'remplazarPunto':     (arreglo, posicion) => {return arreglo[posicion].replace('.', '\\.')},
      'limpiarSaltoLinea':  texto => { return texto.replace(jsonRegEx.clsSaltoLinea, '') },
      'retornoCarroPorComa': texto => { return texto.replace(jsonRegEx.buscarSaltoLinea, ', ')},
      'prepararObjeto': texto => { 
          texto = texto.replace(/=/g, ':').replace(/\[.*?(?=\/)|\]/g, '')
          texto = texto.replace(/(?<=\/\w+)\./g, ':').replace(/\//, '')
          texto = texto.replace(/[^\w:,\.]/gm, "").replace(/,/g, ', ')
          return texto
        }

    }
}

function extraer (arreglo, texto) {
    texto = texto + '\n['
    texto = jsonRegEx.metodos.limpiarComentarios(texto)

    let extraccionReducida = ''
  
    for(let posicion = 0; posicion < arreglo.length; posicion++) {
      extraccionReducida = extraerMenu(crearExpresion(arreglo, posicion), texto)
    }
    return extraccionReducida
}

function crearExpresion (arreglo, posicion) {
    return new RegExp(`\\[.*?${jsonRegEx.metodos.remplazarPunto(arreglo, posicion)}[^*]*?(?=\\[)`, `g`)
}

function extraerMenu(expresionMenu, texto) {
    return texto.match(expresionMenu)
}

function procesarArreglo(archivo, recodificacion, arreglo) {
    return extraer(arreglo, recodificar(archivo, recodificacion))
}
  
function recodificar(archivo, recodificacion) {
    return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function enviarObj (arreglo) {

    let extraccionMenuP = procesarArreglo(archivoMenuPrincipal, recodificacion, arreglo)
    let extraccionDLGMAVI= procesarArreglo(archivoDLGMAVI, recodificacion, arreglo)

    if (extraccionMenuP != undefined) {
        
        let jsonMenuP = prepararJson(extraccionMenuP.join(''))
        let jsonDLG = prepararJson(extraccionDLGMAVI.join(''))
        
    

        for (key in jsonMenuP) {
    
           
                let propiedadObj = Object.getOwnPropertyNames(jsonDLG[key])
        
                for (key2 in propiedadObj) {
                    jsonDLG[key][ propiedadObj[key2] ] = jsonMenuP[key][ propiedadObj[key2] ]
                }
            
            delete jsonMenuP[key]
          }
        
        let objMenuPCambio = Object.assign(jsonMenuP,  jsonDLG)

        let agregacionDLG = 'Se encuentra en ambos archivos: \n\n' +
                            'extraccion del archivo MenuPrincipal: \n\n' + extraccionMenuP.join('') + 
                            'extraccion del archivo DLGMAVI: \n\n' +  extraccionDLGMAVI.join('')  + 
                            'MenuPrincipalConCambio: \n\n' +  JSON.stringify(objMenuPCambio).replace(/[{}"]/g, '').replace(/,/g, ',\n') 
        appendArchivo(carpeta + 'MenuPYDLG.txt', agregacionDLG)
        return objMenuPCambio

        
        //console.log('Existe en ambos y se combinaron las extracciones: \n','\n',objMenuPCambio)
    } else {
        let jsonDLG = prepararJson(extraccionDLGMAVI.join(''))

        let agregacionDLG = 'Se encuentra solo en DLGMAVI: \n\n' +
        'extraccion del archivo DLGMAVI: \n\n' +  extraccionDLGMAVI.join('')

        appendArchivo(carpeta + 'DLG.txt', agregacionDLG)
        return jsonDLG
    }
}


function appendArchivo (archivo, texto) {
    fs.appendFileSync(archivo, '\n' + texto, { flag:'as' })
}

function prepararJson(extraccion) {
    let cadena= jsonRegEx.metodos.retornoCarroPorComa(extraccion)
    let cadenaObj = jsonRegEx.metodos.prepararObjeto(jsonRegEx.metodos.limpiarSaltoLinea(cadena))
    //crearArchivo('objJoinMenuP', cadenaObj)
    return crearJson(cadenaObj)
}


function crearJson(texto) {
    var properties = texto.split(', ');
    var obj = {};
    properties.forEach(function(property) {
        var tup = property.split(':');
        obj[tup[0]] = tup[1];
    });
    //console.log('obj: ', obj)
    return obj
}

let objeto = enviarObj(acceso)
let cadenaObj = JSON.stringify(objeto)

let menu = cadenaObj.replace(/[{}"]/g, '').match(/(?<=Acciones:).*?(?=,)/gi).join('')
let claveAccion = cadenaObj.replace(/[{}"]/g, '').match(/(?<=ClaveAccion:).*?(?=,)/gi).join('')
let menuClave = menu + ': manda llamar a\n' + claveAccion
console.log(menuClave)
appendArchivo(carpeta + 'ObjetosEncontrados.txt', menuClave)












// if (/claveaccion/gi.test(propiedadesObj) == true) {
//     let claveAccion =  objeto.match(/claveaccion.*/gi).join('')
//     console.log(claveAccion)
// }