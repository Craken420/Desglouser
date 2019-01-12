const fs = require('fs')
const iconvlite = require('iconv-lite')
const leerCopiarArchivo = require('./LeerCopiarArchivo')

const root = '../../../../Luis Angel\\Intelisis\\Intelisis5000\\'
const archivoDLGMAVI5000 = root + 'Reportes MAVI\\MenuPrincipal_DLG_MAVI.esp'

const archivoMenuPrincipal5000 = root + 'Codigo Original\\MenuPrincipal.dlg'

const archivoDLGMAVI3000 = root + 'Reportes MAVI\\MenuPrincipal_DLG_MAVI.esp'

const archivoMenuPrincipal3000 = root + 'Codigo Original\\MenuPrincipal.dlg'
                             
const carpetaReportesMAVI5000 = root + 'Reportes MAVI\\'
const carpetaReportesMAVI3000 = root + 'Reportes MAVI\\'

const carpeta = 'Archivos\\'
const carpetaPrueba = 'Archivos5000\\'

let recodificacion = 'Latin1'
const acceso = ['Herramienta.DM0269OrdenadorRutaReparto']

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

    let extraccionMenuP = procesarArreglo(archivoMenuPrincipal5000, recodificacion, arreglo)
    let extraccionDLGMAVI= procesarArreglo(archivoDLGMAVI5000, recodificacion, arreglo)

    if (extraccionMenuP != undefined && extraccionDLGMAVI != undefined) {
        
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
        
        appendArchivo(carpeta + '1.-MenuPYDLG.txt', agregacionDLG)

        console.log('Existe en ambos y se combinaron las extracciones')

        return objMenuPCambio

    } else if (extraccionMenuP != undefined) {
        let jsonMenuP = prepararJson(extraccionMenuP.join(''))

        let agregacionMenuP = 'Se encuentra solo en MenuP: \n\n' +
        'extraccion del archivo MenuP: \n\n' +  extraccionMenuP.join('')

        appendArchivo(carpeta + '2.-MenuP.txt', agregacionMenuP)

        console.log('Se encuentra solo en MenuP')

        return jsonMenuP

    } else if (extraccionDLGMAVI != undefined) {
        let jsonDLG = prepararJson(extraccionDLGMAVI.join(''))

        let agregacionDLG = 'Se encuentra solo en DLGMAVI: \n\n' +
        'extraccion del archivo DLGMAVI: \n\n' +  extraccionDLGMAVI.join('')

        appendArchivo(carpeta + '2.-DLG.txt', agregacionDLG)

        console.log('Se encuentra solo en DLGMAVI')

        return jsonDLG

    } else {
        console.log('No se encuentra en ningun archivo de la version 5000')
       // let contenidoArchivo = fs.readFileSync(archivo, 'ascii')
    }
}

function fileExists(archivo) {
    try {
        return fs.statSync(archivo).isFile();
    } catch (error) {
        console.log(archivo,'no existe')
        return false;
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
    var properties = texto.split(', ')
    var obj = {}
    properties.forEach(function(property) {
        var tup = property.split(':')
        obj[tup[0]] = tup[1]
    })
    //console.log('obj: ', obj)
    return obj
}

function crearNombreObjeto (claveAccion) {
    return claveAccion.replace(claveAccion, x => {
        let determinarExtension = /(frm|vis|tbl|dlg|rep)/gi.test(x)
        console.log(x)
        //console.log(determinarExtension)
        if (determinarExtension == true) {
            console.log(x + '.' + x.replace(/.*?(?!\w{4})/g, '').toLowerCase())
            return x + '.' + x.replace(/.*?(?!\w{4})/g, '').toLowerCase()
        }
    })
}

function comprobarCrear(claveAccion) {
    let nombreObjeto = crearNombreObjeto(claveAccion)
    let banderaArchivoExiste = fileExists(carpetaPrueba + nombreObjeto)
    //console.log(banderaArchivoExiste)

    if (banderaArchivoExiste == false) {
        leerCopiarArchivo.copyFile(carpetaPrueba, carpetaReportesMAVI3000 + nombreObjeto)
        console.log(nombreObjeto + ' Se creo en la version 5000')
        appendArchivo(carpeta + '4.-ObjetosDe3000A5000.txt', nombreObjeto)
        return carpetaPrueba + nombreObjeto
    } else {
        console.log(nombreObjeto + ' Ya existe en la version 5000')
        return carpetaPrueba + nombreObjeto
    }
}

function extraerAccionYObjetos (cadenaObj) {
    let acciones = /^Acciones/gim.test(cadenaObj.replace(/[{}"]/g, ''))
    if ( acciones == true) {

        let menu = cadenaObj.replace(/[{}"]/g, '').match(/(?<=Acciones:).*?(?=,)/gi).join('')
        let claveAccion = cadenaObj.replace(/[{}"]/g, '').match(/(?<=ClaveAccion:).*?(?=,)/gi).join('')
        let menuClave = menu + ': manda llamar a\n\t' + claveAccion
        
        //console.log(menuClave)
        appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', menuClave)
        let archivoCreado = comprobarCrear(claveAccion) 
        console.log(archivoCreado)
        
        let contenidoArchivo = fs.readFileSync(archivoCreado, 'ascii')
        extraerObjetoDelContenido(contenidoArchivo)
    }    else {
        console.log('No se encontraron acciones')
    }
}

function extraerObjetoDelContenido (contenidoArchivo) {
    let ExpresionesAlMostrar = /^ExpresionesAlMostrar/gim.test(contenidoArchivo)
    if ( ExpresionesAlMostrar == true) {
        let expresionSDK =  contenidoArchivo.match(/(^ExpresionesAlMostrar(\d{3}|))\=.*?(\).*)|(^ExpresionesAlMostrar)\=.*(?!\n)/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
        if ( existenVariables == true) {
            let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            // console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tExpresionesAlMostrar:' + variables)
        }
        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
        if ( existenTablas == true) {
            let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
        }
        //console.log(resultadoExpresion)
    }

    let ExpresionesAlCerrar = /^ExpresionesAlCerrar/gim.test(contenidoArchivo)
    if ( ExpresionesAlCerrar == true) {
        let expresionSDK =  contenidoArchivo.match(/(^ExpresionesAlCerrar(\d{3}|))\=.*?(\).*)|(^ExpresionesAlCerrar)\=.*(?!\n)/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
        
        if ( existenVariables == true) {
            let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            // console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tExpresionesAlCerrar:' + variables)
        }
        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
        
        if ( existenTablas == true) {
            let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
        }
        //console.log(resultadoExpresion)
    }

    let ExpresionesAlActivar = /^ExpresionesAlActivar/gim.test(contenidoArchivo)
    if ( ExpresionesAlActivar == true) {
        let expresionSDK =  contenidoArchivo.match(/(^ExpresionesAlActivar(\d{3}|))\=.*?(\).*)|(^ExpresionesAlActivar)\=.*(?!\n)/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
        
        if ( existenVariables == true) {
            let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            // console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tExpresionesAlActivar:' + variables)
        }
        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
        
        if ( existenTablas == true) {
            let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
        }
        //console.log(resultadoExpresion)
    }

    let resultadoListaEnCaptura = /^ListaEnCaptura/gim.test(contenidoArchivo)

    if ( resultadoListaEnCaptura == true) {
        let listaEnCapturaSDK =  contenidoArchivo.match(/^ListaEnCaptura(\d{3}|).*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(listaEnCapturaSDK)
       
        if ( existenVariables == true) {
            let variables = listaEnCapturaSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tListaEnCaptura:' + variables)
        }
        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(listaEnCapturaSDK)
        
        if ( existenTablas == true) {
            let tablas = listaEnCapturaSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
            console.log(variables)
        }
    }

    let resultadoListaAcciones = /^ListaAcciones/gim.test(contenidoArchivo)
    
    if ( resultadoListaAcciones == true) {
        let listaAccionesSDK =  contenidoArchivo.match(/^ListaAcciones(\d{3}|).*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(listaAccionesSDK)
       
        if ( existenVariables == true) {
            let variables = listaAccionesSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tListaAcciones:' + variables)
        }
        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(listaAccionesSDK)
        
        if ( existenTablas == true) {
            let tablas = listaAccionesSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
            console.log(variables)
        }
    }

    let resultadoExpresion = /^Expresion/gim.test(contenidoArchivo)
    if ( resultadoExpresion == true) {
        let expresionSDK =  contenidoArchivo.match(/^Expresion(\d{3}|)\=.*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
        if ( existenVariables == true) {
            let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            //console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tExpresion:' + variables)
        }
        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
        if ( existenTablas == true) {
            let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
            //console.log(resultadoExpresion)
        }
    }

    let resultadoEjecucionCondicion = /^EjecucionCondicion/gim.test(contenidoArchivo)
    if ( resultadoEjecucionCondicion == true) {
        let ejecucionCondicionSDK =  contenidoArchivo.match(/^EjecucionCondicion(\d{3}|)\=.*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(ejecucionCondicionSDK)
        
        if ( existenVariables == true) {
            let variables = ejecucionCondicionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            //console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tEjecucionCondicion:' + variables)
        }

        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(ejecucionCondicionSDK)
        
        if ( existenTablas == true) {
            let tablas = ejecucionCondicionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
        }
        //console.log(resultadoExpresion)
    }

    let resultadoEjecucionMensaje = /^EjecucionMensaje(\d{3}|)/gim.test(contenidoArchivo)
    if ( resultadoEjecucionMensaje == true) {
        let ejecucionMensajeSDK =  contenidoArchivo.match(/^EjecucionMensaje(\d{3}|)\=.*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(ejecucionMensajeSDK)
        
        if ( existenVariables == true) {
            let variables = ejecucionMensajeSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            //console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\tEjecucionMensaje:' + variables)
        }
        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(ejecucionMensajeSDK)
        if ( existenTablas == true) {
            let tablas = ejecucionMensajeSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tTablas:' + tablas)
        }
        //console.log(resultadoExpresion)
    }
}

let objeto = enviarObj(acceso)

if (objeto != undefined){
    let cadenaObj = objeto.join('\n')

    extraerAccionYObjetos (cadenaObj)
} else {
    console.log('No existe en la version 5000')
}
