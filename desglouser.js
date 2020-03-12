const { generarObj } = require('./Utilerias/OperadorObjetos/desglozar')
const { leerCarpetaFiltrada } = require('./Utilerias/OperadoresArchivos/readDirOnlyFile')

const carpeta = 'Testing\\'
const file = 'Testing\\DM0269OrdenadorRutaDeRepartoFrm.frm'

/* Usage */ 

// Operar Archivo
console.log( generarObj(file) )

//Param1: Carpeta a operar; Param2: Extensiones permitidas
leerCarpetaFiltrada(carpeta, ['.frm', '.tbl', '.vis', '.dlg', '.rep'])
.then(archivos => {
    
    archivos.forEach(x => {
        console.log('----------------------------------------------------------')
        console.log(x.replace(/.*\\/g, ''))
        console.log('----------------------------------------------------------')
        // generarObj(x)
        console.log(generarObj(x))
    })
})
