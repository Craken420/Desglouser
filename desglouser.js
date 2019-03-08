const { generarObj } = require('./Utilerias/OperadorObjetos/desglozar')
const { leerCarpetaFiltrada } = require('./Utilerias/OperadoresArchivos/readDirOnlyFile')

const carpeta = 'Testing\\'
const file = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes MAVI\\FormaValor.vis'
const carpetaReportes = 'C:\\Users\\lapena\\Documents\\Luis Angel\\Sección Mavi\\Intelisis\\Intelisis5000\\Reportes MAVI'

// generarObj(file)

leerCarpetaFiltrada(carpetaReportes, ['.frm', '.tbl', '.vis', '.dlg', '.rep'])
.then(archivos => {
    
    archivos.forEach(x => {
        console.log('----------------------------------------------------------')
        console.log(x.replace(/.*\\/g, ''))
        console.log('----------------------------------------------------------')
        // generarObj(x)
        console.log(generarObj(x))
    })
})
