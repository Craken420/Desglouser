
const fs = require('fs')
const iconvlite = require('iconv-lite')

function readDemo1(file1) {
    return  recodificar(file1, 'ascii')
}

function recodificar(archivo, recodificacion) {
    return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function writeDemo2(carpetaDestino, archivo, dataDemo1) {
    fs.writeFileSync(carpetaDestino + archivo.replace(/.*\\/g, ''), dataDemo1, 'ascii')
    console.log('archivo creado')
  }

exports.copyFile = function (carpetaDestino, archivo) {

    try {
        let dataDemo1 = readDemo1(archivo)

        writeDemo2(carpetaDestino, archivo, dataDemo1)
        //console.log(dataDemo1)
    } catch (error) {
        console.error(error);
    }
}

