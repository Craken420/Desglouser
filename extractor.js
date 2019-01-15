
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
                extraerObjetosVariablesMachin(variablesSinDuplicado)
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
    let resultadoVista = /^Vista\=/gim.test(acciones)
    if ( resultadoVista == true) {
        //console.log('resultadoVista', resultadoVista)
        let vistaSDK =  acciones.match(/(?<=^Vista\=).*/gim).join(',')
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