const fs = require('fs')
const iconvlite = require('iconv-lite')
const leerCopiarArchivo = require('./LeerCopiarArchivo')

const root = '../../../../Luis Angel\\Intelisis\\Intelisis5000\\'
const archivoDLGMAVI5000 = root + 'Reportes MAVI\\MenuPrincipal_DLG_MAVI.esp'

const archivoMenuPrincipal5000 = root + 'Codigo Original\\MenuPrincipal.dlg'

const archivoDLGMAVI3000 = root + 'Reportes MAVI\\MenuPrincipal_DLG_MAVI.esp'

const archivoMenuPrincipal3000 = root + 'Codigo Original\\MenuPrincipal.dlg'
const archivoVariables5000 = root + 'Variables.esp'
const archivoVariablesOriginal5000 = root + 'Codigo Original\\Variables.cfg'

                             
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

function crearExpresion (arreglo, posicion) {
    let objMenu =  new RegExp(`\\[.*?${jsonRegEx.metodos.remplazarPunto(arreglo, posicion)}[^*]*?(?=\\[)`, `g`)
    let objVariables =  new RegExp(`\\[${jsonRegEx.metodos.remplazarPunto(arreglo, posicion)}\\][^~]*?(?=\\[)`, `g`)
    return {
        objMenu: objMenu,
        objVariables: objVariables
    }
}

function extraer (arreglo, texto) {
    texto = texto + '\n['
    texto = jsonRegEx.metodos.limpiarComentarios(texto)

    let extraccionReducida = ''
  
    for(let posicion = 0; posicion < arreglo.length; posicion++) {
        let expresionMenu =  crearExpresion(arreglo, posicion)
        extraccionReducida = extraerMenu(expresionMenu.objMenu, texto)
    }
    
    return extraccionReducida
}

function extraerVariable(objVariables, texto, arreglo, posicion) {
    // appendArchivo(carpeta + '1000.-extraerVariable.txt', objVariables)
    // appendArchivo(carpeta + '1000.-extraerVariableTexto.txt', texto)
    let test = objVariables.test(texto)
    let cont = 0
    let extraccionReducida = {}
    if (test == true){
        let matching = texto.match(objVariables)
        //console.log('matching', typeof(matching))
        
            for (key in matching){
                // if (matching[key] != undefined) {
               // console.log('key',key,'match-'+matching[key]+'\nmatchend-----------------------------------------')
            //    console.log(matching[0])
                let cadena = matching[key].replace(/^\n$/gim, '')
                cadena = cadena.split('\r\n').join(', ').replace(/(?<=(^\[).*)\]/g, '').replace(/^\[/g, 'Variable:').replace(/=/g, ':').replace(/\r/g, '')
                //console.log('cadena--------------\n'+ cadena + '\n****************')
                let jsonCadena = crearJson(cadena)
                //console.log(jsonCadena)
                // for (key2 in jsonCadena)
                // {
                //     console.log('---------------\n'+jsonCadena[key2]+ '\n------------------')
                // }
                // console.log(arreglo[posicion])
                let nombreVariable = arreglo[posicion]
                extraccionReducida[nombreVariable] = jsonCadena
               
                //objeto[]
                //antes
                //return jsonCadena
            // }
        }
        // for (key2 in extraccionReducida) {
        //     console.log(key2,extraccionReducida[key2])
        // }
        return extraccionReducida
        // return matching
    }
    // appendArchivo(carpeta + '1000.-matching.txt', matching)
}

function extraerArregloVariable (arreglo, texto) {
    // appendArchivo(carpeta + '1000.-Arreglo.txt', arreglo)
    // appendArchivo(carpeta + '1000.-texto.txt', texto)
    texto = texto + '\n['
    texto = jsonRegEx.metodos.limpiarComentarios(texto)
    let extraccionVariable = {}
    contador = 0
    for (key in arreglo) {
        let expresionMenu =  crearExpresion(arreglo, key)
      
        //Funcional
        // extraccionVariable[arreglo[key]] = extraerVariable(expresionMenu.objVariables, texto)
        // //console.log(contador++)
        // extraccionReducida[contador] = extraccionVariable
        //Nuevo
        //console.log(contador)
        let objeto = extraerVariable(expresionMenu.objVariables, texto, arreglo, key)
        if(objeto != undefined){
            extraccionVariable[contador] = objeto
            contador++
        }
    }
    // for (key2 in extraccionVariable) {
    //     console.log(key2,extraccionVariable[key2])
    // }
    return extraccionVariable
    //Aqui seguirle
    // for (key2 in extraccionReducida) {
    //     console.log(extraccionReducida[key2])
    // }
   
}

function extraerMenu(expresionMenu, texto) {
    let test = expresionMenu.test(texto)
    let matching = ''
    if (test == true){
        matching = texto.match(expresionMenu).join('')
       
    }
    // appendArchivo(carpeta + '1000.-matching.txt', matching)
    return matching
}

function procesarArreglo(archivo, recodificacion, arreglo) {
    // console.log('recodificacion', recodificacion, 'arreglo', arreglo)
    return extraer(arreglo, recodificar(archivo, recodificacion))
}

function procesarVariables(archivo, recodificacion, arreglo) {
    //console.log('recodificacion', recodificacion, 'arreglo', arreglo)
    
   return extraerArregloVariable(arreglo, recodificar(archivo, recodificacion))
}
  
function recodificar(archivo, recodificacion) {
    return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function fileExists(archivo) {
    try {
        return fs.statSync(archivo).isFile();
    } catch (error) {
        // si tieene que ir console.log(archivo,'no existe')
        return false;
    }
}

function eliminarDuplicado (arreglo) {
    let set                 = new Set( arreglo.map( JSON.stringify ) )
    let arrSinDuplicaciones = Array.from( set ).map( JSON.parse );
    return arrSinDuplicaciones
    //console.log( arrSinDuplicaciones );
}

function appendArchivo (archivo, texto) {
    fs.appendFileSync(archivo, '\n' + texto, { flag:'as' })
}

function prepararJson(extraccion) {
    let cadena = jsonRegEx.metodos.retornoCarroPorComa(extraccion)
    let cadenaObj = jsonRegEx.metodos.prepararObjeto(jsonRegEx.metodos.limpiarSaltoLinea(cadena))
    //crearArchivo('objJoinMenuP', cadenaObj)
    return crearJson(cadenaObj)
}

function crearJson(texto) {
    // console.log('texto crear json', texto)
    var properties = texto.split(', ')
    var obj = {}
    properties.forEach(function(property) {
        var tup = property.split(':')
        obj[tup[0]] = tup[1]
    })
    //console.log('obj: ', obj)
    return obj
}

function extraerObjetosVariable (arreglo) {
    let extraccionVariablesOriginal = procesarVariables(archivoVariablesOriginal5000, 'ascii', arreglo)
    let extraccionVariables = procesarVariables(archivoVariables5000, recodificacion, arreglo)
    let arregloObjetos = []
    let cadenaArr = ''
    for (key in extraccionVariablesOriginal) {
        let propiedadSimilar = ''
        // console.log(extraccionVariablesOriginal[key])
        //for (key2 in extraccionVariablesOriginal[key]){
            // console.log(extraccionVariablesOriginal[key][key2])
        let propiedadObjOriginal = Object.getOwnPropertyNames(extraccionVariablesOriginal[key])
        let propiedadObjVariables = {}
        for (key2 in extraccionVariables) {
            propiedadObjVariables = Object.getOwnPropertyNames(extraccionVariables[key2])
        }
        for (key3 in propiedadObjOriginal) {
            for (key4 in propiedadObjVariables) {
                // console.log(propiedadObjVariables[key3])
                if (propiedadObjOriginal[key3] == propiedadObjVariables[key4]) {
                    //console.log('existen variables similares', propiedadObjOriginal[key3])
                    propiedadSimilar = propiedadObjOriginal[key3]
                   
                } else {
                   // console.log('distintas', propiedadObjOriginal[key3])
                }
            }
        }
        //console.log(extraccionVariablesOriginal[key][propiedadSimilar])
        let prop = {}
        if(extraccionVariablesOriginal[key][propiedadSimilar] != null |extraccionVariablesOriginal[key][propiedadSimilar]!=undefined) {
             prop = Object.getOwnPropertyNames(extraccionVariablesOriginal[key][propiedadSimilar])
        }
        // for (key7 in prop) {
        //     console.log(prop[key7])
        // }
        let  prop2 = {}
        for (key7 in extraccionVariables) {
            if(extraccionVariables[key7][propiedadSimilar] != null |extraccionVariables[key][propiedadSimilar]!=undefined) {
                prop2 = Object.getOwnPropertyNames(extraccionVariablesOriginal[key][propiedadSimilar])
            }
        }

        for (key8 in prop) {
            //console.log('prop[key8]', prop[key8])
            for (key9 in prop2) {
                //console.log('prop[key9]', prop2[key9])
                if (prop[key8] == prop2[key9]) {
                    //console.log('propiedad igual')
                    extraccionVariablesOriginal[key][propiedadSimilar][prop[key8]] = extraccionVariables[key7][propiedadSimilar][prop2[key9]]
                    //delete extraccionVariables[key7][propiedadSimilar][prop2[key9]]
                } else {
                    //console.log('propiedad distinta')
                }
            }
        }
        if (extraccionVariablesOriginal[key][propiedadSimilar] != undefined) {
        //console.log('extraccionVariablesOriginal[key][propiedadSimilar]',extraccionVariablesOriginal[key][propiedadSimilar])
        }
        
        for (key10 in extraccionVariables) {
            if (extraccionVariables[key10][propiedadSimilar] != undefined) {
                //console.log('extraccionVariables[key10][propiedadSimilar]',extraccionVariables[key10][propiedadSimilar])
                delete extraccionVariables[key10][propiedadSimilar]
                //console.log('extraccionVariables[key10][propiedadSimilar]',extraccionVariables[key10][propiedadSimilar])
            }
            for (key11 in extraccionVariables[key10]) {
                cadenaArr += JSON.stringify(extraccionVariables[key10][key11])
            }
            // console.log('extraccionVariables[key10]',extraccionVariables[key10])
            //arrSinduplex = eliminarDuplicado()
        }
        // let objMenuPCambio = Object.assign(extraccionVariablesOriginal,  extraccionVariables)
        
        // for (key10 in extraccionVariables) {
        //     console.log(objMenuPCambio[key10])
        // //   appendArchivo(carpeta + 'objMenuPCambio.txt', objMenuPCambio[key10])
        // }
    }
   
    arregloObjetos = cadenaArr.split('}')
    
    let arregloSinDuplex = eliminarDuplicado(arregloObjetos)
    //console.log('arrSinduplex', arregloSinDuplex)
    let cadenaArregloSinDuplex = ''
    for (key12 in arregloSinDuplex) {
        arregloSinDuplex[key12] = arregloSinDuplex[key12] + '}'
        cadenaArregloSinDuplex += arregloSinDuplex[key12]
        
    }
    cadenaArregloSinDuplex = cadenaArregloSinDuplex.replace(/[{"]/g, '').replace(/\}/g, '} ')
    cadenaArregloSinDuplex = cadenaArregloSinDuplex.replace(/\}\s\}/g, '').replace(/,/g, ', ')
    let newArray = cadenaArregloSinDuplex.split('}')
    //console.log(cadenaArregloSinDuplex)
   
    //console.log('newArr+ay[key13]',newArray)
    let jsonArreglo = {}
    let jsonArreglo2 = {}
    for (key13 in newArray) {
      
        //console.log('newArray[key13]',newArray[key13])
        jsonArreglo = crearJson(newArray[key13])
         //console.log(jsonArreglo)
        //jsonArregloSinDuplex[] += crearJson(newArray[key13])
        
        
    }
    appendArchivo(carpeta + 'cadenamachin.txt', cadenaArregloSinDuplex)
    for (key12 in extraccionVariablesOriginal) {
        for (key13 in extraccionVariablesOriginal[key12]) {
            jsonArreglo2 += extraccionVariablesOriginal[key12][key13]
        }
          //appendArchivo(carpeta + 'objMenuPCambio.txt', objMenuPCambio[key10])
    }
    console.log(jsonArreglo2)
    // let objMenuPCambio = Object.assign(jsonArreglo, jsonArreglo2)
    // console.log(objMenuPCambio)

}

function extraerExpresionAlMostrar(acciones) {
    // let contenidoVariables =  fs.readFileSync(archivoVariables, 'ascii')
    // contenidoVariables = contenidoVariables + '\n['

    let ExpresionesAlMostrar = /^ExpresionesAlMostrar/gim.test(acciones)
        if ( ExpresionesAlMostrar == true) {
            let expresionSDK =  acciones.match(/(^ExpresionesAlMostrar(\d{3}|))\=.*?(\).*)|(^ExpresionesAlMostrar)\=.*(?!\n)/gim).join('')
            //console.log(expresionSDK)
            let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
            
            if ( existenVariables == true) {
                let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
                // console.log(variables)
                let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
                
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tExpresionesAlMostrar:')
                for (key in variablesSinDuplicado) {
                    appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + variablesSinDuplicado[key] + ':')
                    // extraerObjetosVariable(variablesSinDuplicado[key])
                }
                extraerObjetosVariable(variablesSinDuplicado)
               // extraerObjetosVariablesMachin(variablesSinDuplicado)
                // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tExpresionesAlMostrar: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(':'))
            }

            let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
            if ( existenTablas == true) {
                let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
                // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
                // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
            }
            //console.log(resultadoExpresion)
        }
    
}

function extraerExpresionesAlCerrar (acciones) {
    let ExpresionesAlCerrar = /^ExpresionesAlCerrar/gim.test(acciones)
    if ( ExpresionesAlCerrar == true) {
        let expresionSDK =  acciones.match(/(^ExpresionesAlCerrar(\d{3}|))\=.*?(\).*)|(^ExpresionesAlCerrar)\=.*(?!\n)/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
        
        if ( existenVariables == true) {
            let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            // console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tExpresionesAlCerrar:')
            let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
            for (key in variablesSinDuplicado) {
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + variablesSinDuplicado[key] + ':')
            }
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tExpresionesAlCerrar: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(':'))
        }

        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
        
        if ( existenTablas == true) {
            let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
        }
        //console.log(resultadoExpresion)
    }
}

function extraerExpresionesAlActivar (acciones) {
    let ExpresionesAlActivar = /^ExpresionesAlActivar/gim.test(acciones)
    if ( ExpresionesAlActivar == true) {
        let expresionSDK =  acciones.match(/(^ExpresionesAlActivar(\d{3}|))\=.*?(\).*)|(^ExpresionesAlActivar)\=.*(?!\n)/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
        
        if ( existenVariables == true) {
            let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            // console.log(variables)
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tExpresionesAlActivar:')
            let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
            for (key in variablesSinDuplicado) {
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t' + variablesSinDuplicado[key] + ':')
            }
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tExpresionesAlActivar: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(':'))
        }

        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
        
        if ( existenTablas == true) {
            let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
        }
        //console.log(resultadoExpresion)
    }
}

function extraerListaEnCaptura (acciones) {
    let resultadoListaEnCaptura = /^ListaEnCaptura/gim.test(acciones)

    if ( resultadoListaEnCaptura == true) {
        let listaEnCapturaSDK =  acciones.match(/^ListaEnCaptura(\d{3}|).*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(listaEnCapturaSDK)
    
        if ( existenVariables == true) {
            let variables = listaEnCapturaSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tListaEnCaptura:')
            for (key in variablesSinDuplicado) {
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + variablesSinDuplicado[key] + ':')
            }
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tListaEnCaptura: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(':'))
        }

        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(listaEnCapturaSDK)
        
        if ( existenTablas == true) {
            let tablas = listaEnCapturaSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // //console.log(variables)
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
        }
    }
}

function extraerListaAcciones (acciones) {
    let resultadoListaAcciones = /^ListaAcciones/gim.test(acciones)
        
    if ( resultadoListaAcciones == true) {
        let listaAccionesSDK =  acciones.match(/^ListaAcciones(\d{3}|).*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(listaAccionesSDK)
    
        if ( existenVariables == true) {
            let variables = listaAccionesSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tExpresion:')
            for (key in variablesSinDuplicado) {
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + variablesSinDuplicado[key] + ':')
            }
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tListaAcciones: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(':'))
        }

        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(listaAccionesSDK)
        
        if ( existenTablas == true) {
            let tablas = listaAccionesSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            //console.log(variables)
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
        }
    }
}

function extraerExpresion (acciones) {
    let resultadoExpresion = /^Expresion\=/gim.test(acciones)
    //console.log('resultadoExpresion test', resultadoExpresion)
    if ( resultadoExpresion == true) {
        //console.log('resultadoExpresion if', resultadoExpresion)
        if (acciones.match(/^Expresion(\d{3}|)\=.*/gim) != null) {
            
            let expresionSDK =  acciones.match(/^Expresion(\d{3}|)\=.*/gim).join('')
            //console.log(expresionSDK)
            let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(expresionSDK)
            
            if ( existenVariables == true) {
                let variables = expresionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
                //console.log(variables)
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tExpresion:')
                let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
                for (key in variablesSinDuplicado) {
                    appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + variablesSinDuplicado[key] + ':')
                }
                // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tExpresion: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(':'))
            }

            let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(expresionSDK)
            
            if ( existenTablas == true) {
                let tablas = expresionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
                // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
                //console.log(resultadoExpresion)
                // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
            }
        }
    }
}

function extraerEjecucionCondicion (acciones) {
    let resultadoEjecucionCondicion = /^EjecucionCondicion/gim.test(acciones)
    if ( resultadoEjecucionCondicion == true) {
        let ejecucionCondicionSDK =  acciones.match(/^EjecucionCondicion(\d{3}|)\=.*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(ejecucionCondicionSDK)
        
        if ( existenVariables == true) {
            let variables = ejecucionCondicionSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            //console.log(variables)
            let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tEjecucionCondicion:')
            for (key in variablesSinDuplicado) {
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + variablesSinDuplicado[key] + ':')
            }
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tEjecucionCondicion: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(':'))
        }

        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(ejecucionCondicionSDK)
        
        if ( existenTablas == true) {
            let tablas = ejecucionCondicionSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
        }
        //console.log(resultadoExpresion)
        
    }
}

function extraerEjecucionMensaje (acciones) {
    let resultadoEjecucionMensaje = /^EjecucionMensaje(\d{3}|)/gim.test(acciones)
    if ( resultadoEjecucionMensaje == true) {
        let ejecucionMensajeSDK =  acciones.match(/^EjecucionMensaje(\d{3}|)\=.*/gim).join('')
        //console.log(expresionSDK)
        let existenVariables = /(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi.test(ejecucionMensajeSDK)
        
        if ( existenVariables == true) {
            let variables = ejecucionMensajeSDK.match(/(?<=asigna\().*?(?=,)|(?<!\w)\w+\.(?=dm|rm)\w+|(?<!\w)(rm|dm)\w+/gi).join(',')
            //console.log(variables)
            let variablesSinDuplicado = eliminarDuplicado(variables.split(','))
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tVista:')
            for (key in variablesSinDuplicado) {
                appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + variablesSinDuplicado[key] + ':')
            }// appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tEjecucionMensaje: {\n\t\t\t\t\t' + eliminarDuplicado(variables.split(',')).join(': {\n\t\t\t\t\t')) + '\n\t\t\t\t\t}'
        }

        let existenTablas = /(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gim.test(ejecucionMensajeSDK)
        
        if ( existenTablas == true) {
            let tablas = ejecucionMensajeSDK.match(/(?<=(from|join)\s)\w+|(?<=(from|join)\s\w+\,\s)\w+/gi).join(',')
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(','))
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\t\tTablas:' + eliminarDuplicado(tablas.split(',')).join(',')) + '\n\t\t\t\t\t}'
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
        }
        //console.log(resultadoExpresion)
    }
}

function extraerVista (acciones) {
    let resultadoVista = /(?<=^Vista=)(?!\(Variables\)).*/gim.test(acciones)
    if ( resultadoVista == true) {
        //console.log('resultadoVista', resultadoVista)
        let vistaSDK =  acciones.match(/(?<=^Vista=)(?!\(Variables\)).*/gim).join(',')
        //console.log('vistaSDK', vistaSDK)
        let vistasSinDuplicado = eliminarDuplicado(vistaSDK.split(','))
        appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tVista:')
        for (key in vistasSinDuplicado) {
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + vistasSinDuplicado[key] + ':')
        }
        // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tVista:' + eliminarDuplicado(vistaSDK.split(',')).join(':'))
        // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
    }
}

function extraerForma (acciones) {
    let resultadoForma = /^Forma\=/gim.test(acciones)
    if ( resultadoForma == true) {
        //console.log('resultadoForma', resultadoForma)
        let formaSDK =  acciones.match(/(?<=^Forma\=).*/gim).join(',')
        //console.log('FormaSDK', formaSDK)
        let formasSinDuplicado = eliminarDuplicado(formaSDK.split(','))
        appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\tForma:')
        for (key in formasSinDuplicado) {
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t\t\t' + formasSinDuplicado[key] + ':')
        }
        // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t{\n\t\t\t\tForma:' + eliminarDuplicado(formaSDK.split(',')).join(':'))
        // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t}')
    }
}

function extraerObjetosDeAccion (acciones) {
    extraerExpresionAlMostrar(acciones)

    extraerExpresionesAlCerrar(acciones)

    extraerExpresionesAlActivar(acciones)

    extraerListaEnCaptura(acciones)

    extraerListaAcciones(acciones)

    extraerExpresion(acciones)

    extraerEjecucionCondicion(acciones)

    extraerEjecucionMensaje(acciones)

    extraerVista(acciones)

    extraerForma(acciones)
}

function extraerAccionesDelContenido (archivoCreado) {
    let contenidoArchivo = fs.readFileSync(archivoCreado, 'ascii')
    contenidoArchivo = contenidoArchivo + '\n['

    let acciones = contenidoArchivo.match(/\[.*?.*?[^*]*?(?=\[)/g)
    for (key in acciones) {
        //appendArchivo(carpeta + '4.-Acciones.txt', accion)
        let nombreAccion = acciones[key].match(/(?!\[\])\[.*?\]/g)

        if (nombreAccion != null) {
            appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', '\t\t' + nombreAccion + ':')
            // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t\t\"' + nombreAccion + '\":')
        }

        if (acciones[key] != null) {
            extraerObjetosDeAccion(acciones[key])
        }
    }
    // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', '\t\t}\n\t}\n}' )
}

function crearNombreObjeto (tipoAccion, claveAccion) {
    //console.log('tipoAccion', tipoAccion)

    if (/Reportes/gi.test(tipoAccion)){
        tipoAccion = tipoAccion.replace(/(?<=Reportes).*/gi, '')
    }

    switch (tipoAccion) {
        case 'Formas': {
            //console.log('claveAccion', claveAccion, claveAccion + '.frm' )
            return claveAccion + '.frm'
        }
        case 'Dialogos': {
            return claveAccion + '.dlg'
        }
        case 'Reportes': {
            return claveAccion + '.rep'
        }
        default:  {
            return claveAccion
        }
    }
}

function comprobarCrear(tipoAccion, claveAccion) {
    let nombreObjeto = crearNombreObjeto(tipoAccion, claveAccion)
    let banderaArchivoExiste = fileExists(carpetaPrueba + nombreObjeto)
    //console.log('banderaArchivoExiste', banderaArchivoExiste)
    if (banderaArchivoExiste == false) {
        leerCopiarArchivo.copyFile(carpetaPrueba, carpetaReportesMAVI3000 + nombreObjeto)
        // si tiene que ir console.log(nombreObjeto + ' Se creo en la version 5000')
        appendArchivo(carpeta + '4.-ObjetosDe3000A5000.txt', nombreObjeto)
        return carpetaPrueba + nombreObjeto
    } else {
        //si tiene que ir console.log(nombreObjeto + ' Ya existe en la version 5000')
        return carpetaPrueba + nombreObjeto
    }
}

function extraerAccionYObjetos (cadenaObj) {

    cadenaObj = cadenaObj.replace(/[{}"]/g, '').split(',').join('\n')

    // appendArchivo(carpeta + '3000.-cadenaObj.txt', cadenaObj)

    let existenAccones = /^Acciones/gim.test(cadenaObj.replace(/[{}"]/g, ''))
    // si tiene que ir console.log('existenAccones', existenAccones)
    if ( existenAccones == true) {

        let menu = cadenaObj.match(/(?<=Acciones:).*/gi).join('')
        // console.log('menu:', menu)

        let claveAccion = cadenaObj.match(/(?<=ClaveAccion:).*/gi).join('')
        // console.log('claveAccion:', claveAccion)
        let menuClave = menu + ':\n\t' + claveAccion + '\t\t' 
        // let menuClaveJson = '{\n\t\"' + menu + '\":\n\t{\t\t\n\t\t\"' + claveAccion +'\": \n\t\t{' 
        // console.log('menuClave:', menuClave)

        let tipoAccion = cadenaObj.match(/(?<=TipoAccion:).*/gi).join('')
        // console.log('tipoAccion:', tipoAccion)

        appendArchivo(carpeta + '3.-ObjetosEncontrados.txt', menuClave)
        // appendArchivo(carpeta + '4.-ObjetosEncontradosJSON.txt', menuClaveJson)

        let archivoCreado = comprobarCrear(tipoAccion, claveAccion)

        //Si tiene que ir console.log('Ruta del archivo creado o existente:', archivoCreado)

        extraerAccionesDelContenido(archivoCreado)
    }  else {
        //Si tiene que ir console.log('No se encontraron acciones')
    }
}

function buscarEnAchivos (extraccionMenuP, extraccionDLGMAVI) {
    let opcion = 0
    let cont = 1
    if (cont == 1) {
        if (extraccionMenuP != undefined && extraccionDLGMAVI != undefined|extraccionMenuP != null && extraccionDLGMAVI != null) {
            cont = 2
            let jsonMenuP = prepararJson(extraccionMenuP)
            let jsonDLG = prepararJson(extraccionDLGMAVI)

                for (key in jsonMenuP) {
                    if (jsonMenuP[key] != undefined |jsonMenuP[key] != null) {
                    {
                        let propiedadObj = Object.getOwnPropertyNames(jsonDLG[key])
                
                        for (key2 in propiedadObj) {
                            jsonDLG[key][ propiedadObj[key2] ] = jsonMenuP[key][ propiedadObj[key2] ]
                        }

                        delete jsonMenuP[key]
                    }
                }

                let objMenuPCambio = Object.assign(jsonMenuP,  jsonDLG)
                opcion = 1
                return {
                    objMenuPCambio:objMenuPCambio,
                    opcion: opcion
                }
            }
        } else if (extraccionMenuP != undefined) {
            cont = 3
            let jsonMenuP = prepararJson(extraccionMenuP)
            opcion = 2
            return {
                jsonMenuP: jsonMenuP,
                opcion: opcion
            }

        } else if (extraccionDLGMAVI != undefined) {
            cont = 4
            let jsonDLG = prepararJson(extraccionDLGMAVI)
            opcion = 3
            return {
                jsonDLG: jsonDLG,
                opcion: opcion
            }

        } else {
            //Si tiene que ir console.log('No se encuentra en ningun archivo de la version 5000')
        // let contenidoArchivo = fs.readFileSync(archivo, 'ascii')
        }
    } else {
        //si tiene que ir console.log('extraccionDLGMAVI con mayor a 1', extraccionMenuP, extraccionDLGMAVI)
    }
}

function enviarObj (arreglo) {

    let extraccionMenuP = procesarArreglo(archivoMenuPrincipal5000, recodificacion, arreglo)
    let extraccionDLGMAVI = procesarArreglo(archivoDLGMAVI5000, recodificacion, arreglo)

    let objeto = buscarEnAchivos(extraccionMenuP, extraccionDLGMAVI)

    switch (objeto.opcion) {
        case 1: {
            let agregacionDLG = 'Se encuentra en ambos archivos: \n\n' +
            'extraccion del archivo MenuPrincipal: \n\n' + extraccionMenuP + 
            'extraccion del archivo DLGMAVI: \n\n' +  extraccionDLGMAVI  + 
            'MenuPrincipalConCambio: \n\n' +  JSON.stringify(objeto.objMenuPCambio).replace(/[{}"]/g, '').replace(/,/g, ',\n') 
        
            appendArchivo(carpeta + '1.-MenuPYDLG.txt', agregacionDLG)
        
            // si tiene que ir console.log('Existe en ambos y se combinaron las extracciones')
            return objeto.objMenuPCambio
        }
        case 2: {
            let agregacionMenuP = 'Se encuentra solo en MenuP: \n\n' +
            'extraccion del archivo MenuP: \n\n' +  extraccionMenuP

            appendArchivo(carpeta + '2.-MenuP.txt', agregacionMenuP)

            //si tiene que ir console.log('Se encuentra solo en MenuP')
            return objeto.jsonMenuP
        }
        case 3:{
            let agregacionDLG = 'Se encuentra solo en DLGMAVI: \n\n' +
            'extraccion del archivo DLGMAVI: \n\n' +  extraccionDLGMAVI
    
            appendArchivo(carpeta + '2.-DLG.txt', agregacionDLG)
    
            //si tiene que ir console.log('Se encuentra solo en DLGMAVI')
            return objeto.jsonDLG
        }
        default: {
            return console.log('Ninguna opcion')
        }
    }
}

let objeto = enviarObj(acceso)
//console.log('objeto', objeto, typeof(objeto))
if (objeto != undefined) {

    let cadenaObj = JSON.stringify(objeto)

    extraerAccionYObjetos(cadenaObj)
} else {
    //si tiene que ir console.log('No existe en la version 5000')
}

