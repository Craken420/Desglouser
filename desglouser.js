const { generarObj } = require('./Utilerias/OperadorObjetos/desglozar')
const { leerCarpetaFiltrada } = require('./Utilerias/OperadoresArchivos/readDirOnlyFile')

const carpeta = 'Testing\\'
const file = 'Testing\\FormaValor.vis'

/* Usage */ 

// Path File
generarObj(file)

// Path dir
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
