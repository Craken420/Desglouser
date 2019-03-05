[Forma]
Clave=CXCFacturaCteMavi
Nombre=<T>Movimientos Pendientes<T>
Icono=67
Modulos=(Todos)
ExpresionesAlCerrar=EJECUTARSQL(<T>SpActualizaPropreArtFamFam<T>)
FormulaSQL=SELECT dbo.fnDiasVencidosCXCMavi(Cxc.ID)
CarpetaPrincipal=Hoja
SQL=EXEC xpInactividad {Comillas(Info.Agente)},{Comillas(Info.Institucion)},{Comillas(Info.AgenteEquipo)},{Comillas(Info.AgenteFamMavi)},{Comillas(Mavi.Categorias)},{Info.Inactivo},{Info.CAgente},{Info.IRuta}
PosicionInicialAlturaCliente=352
PosicionInicialAncho=688
VentanaTipoMarco=Sencillo
VentanaPosicionInicial=Centrado
VentanaEscCerrar=S
AccionesTamanoBoton=15x5
AccionesDerecha=S
PosicionInicialIzquierda=296
PosicionInicialArriba=317
ListaCarpetas=Hoja
ListaAcciones=Aceptar<BR>QuitarSeleccion<BR>CobroSeguro
BarraHerramientas=S
BarraAyuda=S
BarraAyudaBold=S
VentanaEstadoInicial=Normal
VentanaSiempreAlFrente=S
Comentarios=Info.Acreditado
ExpresionesAlMostrar=EjecutarSQL( <T>spOrigenVentaPMMavi :tEmp, :tCte, :nEst, :nTipoCobro<T>,  Empresa,  Info.Acreditado, EstacionTrabajo, Info.Cantidad )<BR>SI(Info.Cantidad2 <> 1,Asigna(Info.Veces,SQL(<T>Select dbo.fn_MaviDM0169cobroSegurosvida(:tCli)<T>,Info.Acreditado)),Asigna(Info.Veces,1))<BR><BR>ejecutarsql(/**<T>SP_MaviAngelos<T>*/)<BR>fin

[Hoja.Columnas]
0=46
1=94
2=90
3=247
4=-2
Empresa=45
IdCxC=64
IdOrigeN=64
IdCxCOrigen=124
IdCxCOrigenMov=124
ConFormaPrevia=S
FormaPrevia=RM0211AneRecMercFrm
Cliente=64
5=-2
Expresion=Ejecutar(<T>PlugIns\FichasTecnicasxArt\FichasTecnicasSIP.exe <T>+ usuario)
6=-2
[Hoja]
Estilo=Iconos
Clave=Hoja
MostrarConteoRegistros=S
Zona=A1
Vista=CXCFacturaCteMavi
Fuente={Tahoma, 8, Negro, []}
CampoColorLetras=Negro
CampoColorFondo=Blanco
CarpetaVisible=S
ListaEnCaptura=IdCxCOrigenMov<BR>IdCxCOrigen<BR>Articulo<BR>CteFinal
IconosCampo=(sin Icono)
IconosEstilo=Detalles
IconosAlineacion=de Arriba hacia Abajo
ElementosPorPagina=200
IconosSubTitulo=<T>Reg<T>
IconosSeleccionPorLlave=S
IconosSeleccionMultiple=S
Filtros=S
FiltroPredefinido=S
FiltroNullNombre=(sin clasificar)
FiltroEnOrden=S
FiltroTodoNombre=(Todo)
FiltroAncho=20
FiltroRespetar=S
FiltroTipo=General
AlineacionAutomatica=S
AcomodarTexto=S
IconosNombre=CXCFacturaCteMavi:IdOrigeN
Expresion=Asigna(Mavi.Reporte,<T>DM0242AuxDialogRep<T>)<BR>Entonces<BR>  ReporteExcel(<T>DM0269FactRutaRepartoRep<T>)<BR><BR> ReporteImpresora(<T>RM0847EAutDesViaNominaARepImp<T>),<T><T>)<BR><BR>    fin<BR><BR><BR>Sino<BR>    GuardarCambios<BR>
FiltroGeneral=CXCFacturaCteMavi.Empresa = <T>{Empresa}<T> AND<BR>{Si(ConDatos(Info.Acreditado), <T>Cliente=<T>+Comillas(Info.Acreditado), <T>1=1<T>)}  and<BR>{Si(Info.Veces = 0 , <T> IdCxCOrigenMov=<T>+Comillas(<T>Seguro Vida<T>), <T>1=1<T>)}
[Hoja.IdCxCOrigenMov]
Carpeta=Hoja
Clave=IdCxCOrigenMov
Editar=S
LineaNueva=S
ValidaNombre=S
3D=S
Tamano=20
ColorFondo=Blanco
ColorFuente=Negro
Expresion=SI  SQL(<T>Select dbo.fnDM0138validaCte(:tCte,:tUsr)<T>,Info.Acreditado, Usuario) =<T>SI<T><BR> Entonces<BR>      Asigna(Mavi.DM0138Modulo,<T>CXC<T>) <BR>      Forma(<T>DM0138CapturaCorreo<T>)<BR><BR> Sino<BR>SI((Vacio(Info.CxcMovID,Nulo) = Nulo), (EJECUTARSQL(<T>EXEC spConsecutivoGral :nID, :tMod, :bApl<T> ,Info.ID, <T>CXC<T>, Info.CxcAplica)))<BR>    Si  Vacio( Info.Usuario) entonces Asigna(Info.Usuario,  Usuario )  Fin<BR><BR>    Si ((Info.ABC = <T>4<T>) y (Info.Numero = <T>0<T>)) Entonces  error(<T>Por favor Autorizar nuevamente<T>)<BR>        AbortarOperacion<BR>    Fin<BR><BR>    Asigna(Info.ABC, Nulo)<BR>    Asigna(Info.ABC, SQL(<T>spValidaAutorizacionCondMAVI :nID, :tUsuario, :tEstacion<T>,Info.ID, Info.Usuario,  EstacionTrabajo ))<BR><BR>    Si Info.ABC en (<T>2<T>,<T>3<T>,<T>0<T>)<BR>     Entonces<BR>          Asigna(Info.Descripcion,  SQL( <T>spGeneraCobroSugeridoMAVI :tMod, :nId,  :tUsua, :nEst<T>, <T>CXC<T>, Info.ID,  Usuario ,  EstacionTrabajo))<BR>          Informacion(Info.Descripcion)<BR>          Si ((ConDatos(Info.Descripcion)) y (Info.Descripcion = <T>Proceso concluido..<T>))<BR>           entonces<BR>             Caso  Info.Respuesta1<BR>                  Es <T>Cliente<T> Entonces EJECUTARSQL(<T>EXEC SP_DM0244InsertaTipoCobro :nID,:tCte,:tTipo,:tN1,:tN2<T>,Info.ID,Info.Acreditado,Info.Respuesta1,nulo,nulo)<BR>                  Es <T>Dima<T> Entonces EJECUTARSQL(<T>EXEC SP_DM0244InsertaTipoCobro :nID,:tCte,:tTipo,:tN1,:tN2<T>,Info.ID,Info.Acreditado,Info.Respuesta1,nulo,nulo)<BR>                  Es <T>Cliente final<T> Entonces EJECUTARSQL(<T>EXEC SP_DM0244InsertaTipoCobro :nID,:tCte,:tTipo,:nAval,:tIDDoc<T>,Info.ID,Info.Acreditado,Info.Respuesta1,nulo,Mavi.Folio)<BR>                  Es <T>Aval<T>  Entonces EJECUTARSQL(<T>EXEC SP_DM0244InsertaTipoCobro :nID,:tCte,:tTipo,:tAval,:tN3<T>,Info.ID,Info.Acreditado,Info.Respuesta1,Info.Respuesta2,nulo )<BR>                  Sino<BR>                      Falso<BR>                  Fin<BR>            sino<BR>               Informacion(Info.Descripcion)<BR>           fin<BR>      Si(Info.FormaPago=<T>DEPOSITO EN CTA<T>,EjecutarSQL(<T>EXEC SP_DM0243ActualizaSaldo :nIdvalida, :tCte, :nimp, :nID, :tUsr<T>,Info.folio,Info.Acreditado,Info.Importe,Info.ID, Usuario),Falso)<BR>      //SI(SQL(<T>Select Count(Aval) from AsignacionAvalesClientesJob Where Aval=:tcli<T>,Info.Acreditado) > 0 ,Ejecutar(<T>PlugIns\Inte602.exe <T>+Info.Acreditado+<T> <T>+ Usuario +<T> N 0 S <T>+Info.UEN,Verdadero),Falso)<BR><BR>    Sino<BR>        Si Info.ABC = <T>1<T>  entonces<BR>          Precaucion(<T>Ha sobrepasado el % Autorizado para condonar..<T>)<BR>        Sino<BR>          Precaucion(<T>No hay autorizacion para condonar...Verifique<T>)<BR>        Fin<BR>    Fin<BR><BR>    Forma.Accion( <T>Cerrar<T>)<BR>    OtraForma( <T>Cxc<T>,  ActualizarVista  )<BR> Forma.ActualizarVista(<T>RM0847CredilanaVis<T>)<BR>Forma.ActualizarVista(<T>RM0847PrestamosPersonalesVis<T>)<BR>Forma.ActualizarVista(<T>RM0847facturasVis<T>)<BR>Forma.ActualizarVista(<T>RM0847facturasViuVis<T>)<BR>Asigna(Info.ID,MaviServicredCredVis:Id)<BR>Asigna(Info.Mov,MaviServicredCredVis:Mov)<BR>Asigna(Info.Movid,MaviServicredCredVis:Movid)<BR>Asigna(Info.Situacion,MaviServicredCredVis:Situacion)<BR>Asigna(Mavi.TipoCliente,MaviServicredCredVis:MaviTipoVenta)<BR>Asigna(Info.Estatus,MaviServicredCredVis:Estatus)Si Vacio(DM0174EmbPisoTbl.Agente) Entonces <T>El Agente debe tener un valor<T><BR>Sino DM0174EmbPisoTbl.Vehiculo+<T>  Inválido, Verifique que el Vehiculo Asigna( Info.Cantidad, 1 )<BR>Si<BR>    Mavi.DM0500BCuotasPer=<T>DETALLE<T><BR>Entonces<BR>     ReportePantalla(<T>DM0230RecupTelDetalladoREP<T>)<BR>Sino<BR>    ReportePantalla(<T>DM0230RecupTelConcentradoREP<T>)<BR>FIN
EjecucionCondicion=Si<BR>  ConDatos(Info.Ejercicio) y ConDatos(Mavi.quincena) y ConDatos(Mavi.DM0500BCuotasPer)<BR>Entonces<BR>  Verdadero<BR>Sino<BR>  Error(<T>Los filtros Ejercicio, Quincena y Reporte General, son obligatorios<T>)<BR>  Falso<BR>Fin<BR>Fin
EjecucionCondicion=0 = SQL(<T>SELECT COUNT(U.Usuario) FROM TablaStD T INNER JOIN Usuario U ON T.TablaSt = :tTabla AND T.Nombre = U.Acceso AND U.Usuario = :tUsr<T>,<T>PRELIMINAR DE NEGOCIACION<T>,Usuario)
EjecucionMensaje=<T>Su usuario no cuenta con los permisos para generar Cobros...<T>
AntesExpresiones=Asigna(Mavi.DM0169Dialogo,SQL(<T>Select dbo.fn_MaviDM0243Valida(:nID,:tCte,:nImp)<T>,Info.ID,Info.Acreditado,Info.Importe))<BR>Asigna(Info.Folio,SQL(<T>Select case When Valor=<T>+Comillas(<T><T>)+<T> Then 0 else Isnull(Valor,0) End From MovCampoExtra Where Mov=:tMov and ID=:nId and Modulo=:tmod<T>,<T>Cobro<T>,Info.ID,<T>CXC<T>))<BR>Si<BR>  Mavi.DM0169Dialogo <> <T>NA<T><BR>Entonces<BR>  Error(Mavi.DM0169Dialogo)<BR>  Abortaroperacion<BR>Sino<BR>  Verdadero    <BR>Fin
[Acciones.Aceptar]
Nombre=Aceptar
Boton=23
NombreDesplegar=&Aceptar
EnBarraAcciones=S
TipoAccion=Expresion
Activo=S
Visible=S
TipoAccion=Reportes Impresora
ClaveAccion=AsigCtasCobMenMavi
NombreDesplegar=&Excel
EnBarraHerramientas=S
TipoAccion=Reportes Excel
ClaveAccion=AsigCtasCobMenMavi
TipoAccion=Reportes Pantalla
ClaveAccion=AsigCtasDetalleMavi
NombreDesplegar=TXT
AyudaForma=NivelCobListaMavi
AyudaVista=NivelCobranzaMavi
EnBarraHerramientas=S
TipoAccion=Reportes Impresora
ClaveAccion=AsigCtasCobMenMaviTXT
Activo=S
NombreEnBoton=S
EnBarraHerramientas=S
Multiple=S
Expresion=Si<BR>  Compra:Prov.GarantiaCostos y (MovTipo(<T>COMS<T>, Compra:Compra.Mov) = COMS.O) y (Compra:Compra.Estatus en (EstatusSinAfectar, EstatusPorConfirmar))<BR>Entonces<BR>   Si(Confirmacion(<T>Desea Ejecutar la Garantía de Costos<T>, BotonSi, BotonNo)=BotonSi, ProcesarSQL(<T>spCompraGarantiaCostos :nID<T>, Compra:Compra.ID))<BR>Fin<BR><BR>Si<BR>  (MovTipo(<T>COMS<T>, Compra:Compra.Mov)<>COMS.R) o Config.CompraProveedorRequisicion<BR>Entonces<BR>  Si(Vacio(Compra:Compra.Proveedor), Error(<T>Falta Indicar el Proveedor<T>) AbortarOperacion)<BR>Fin<BR><BR>Asigna(Afectar.Modulo, <T>COMS<T>)<BR>Asigna(Afectar.ID, Compra:Compra.ID)<BR>Asigna(Afectar.Mov, Compra:Compra.Mov)<BR>Asigna(Afectar.MovID, Compra:Compra.MovID)<BR>Asigna(Info.MovTipo, MovTipo(<T>COMS<T>, Compra:Compra.Mov))<BR>Si<BR>  (Info.MovTipo=COMS.C) y (Compra:Compra.Estatus=EstatusPorConfirmar)<BR>Entonces<BR>  Dialogo(<T>GenerarCotizacionCompra<T>)<BR>Sino<BR>  Si<BR>    Compra:Compra.Estatus en (EstatusSinAfectar, EstatusBorrador, EstatusPorConfirmar, EstatusPorAutorizarE)<BR>  Entonces<BR>    Si <BR>     (MovTipo(<T>COMS<T>,Compra:Compra.Mov) noen (COMS.R, COMS.PR, COMS.EST)) y Vacio(Compra:Compra.Proveedor)<BR>    Entonces<BR>     Informacion(<T>Falta Indicar el Proveedor<T>, BotonAceptar)<BR>    Sino<BR>      Si(Config.CompraVentaSinIVA y (Suma(CompraD:Impuesto)=0.0) y (Suma(CompraD:Importe)>0.0), Si(Confirmacion(<T>Movimiento sin Impuestos<T>+NuevaLinea+<T>¿ Es Correcto ?<T>,BotonSi,BotonNo)=BotonNo,AbortarOperacion))<BR>      Afectar(Afectar.Modulo, Afectar.ID, Afectar.Mov, Afectar.MovID, <T>Todo<T>, <T><T>, <T>Compra<T>)<BR>      EjecutarSQL(<T>EXEC SP_ContelectronicaAsociacionCFDI :nID, :tMod<T>, Compra:Compra.ID,<T>COMS<T>)<BR>        Si Afectar.Mov =  <T>Solicitud Compra<T><BR>         Entonces<BR>              Ejecutar(<T>PlugIns\DM0285CorreoSolicitudCompra\DM0285CorreoSolicitudCompra.exe<T>+<T> <T>+<T>CorreoAfectado<T>+<T> <T>+ Afectar.ID)<BR>         Fin<BR><BR>    Fin<BR>  Sino<BR>    Asigna(Info.Modulo, <T>COMS<T>)<BR>    Asigna(Info.Mov, Compra:Compra.Mov)<BR>    Asigna(Info.MovID, Compra:Compra.MovID)<BR>    Asigna(Afectar.Base, <T>Pendiente<T>)<BR>    Asigna(Afectar.GenerarMov, <T><T>)<BR>    Asigna(Afectar.FormaCaptura, <T>Compra<T>)<BR>    Si<BR>      ConfigModulo(Info.Modulo, <T>FlujoAbierto<T>) = <T>Si<T><BR>    Entonces<BR>      Si<BR>        Forma(<T>GenerarMovFlujo<T>)<BR>      Entonces<BR>        Asigna(Afectar.GenerarMov, Info.MovGenerar)<BR>        Asigna(Info.TituloDialogo, <T>Generar <T>+Comillas(Info.MovGenerar)+<T> de <T>+Comillas(Info.Mov))<BR>        Dialogo(<T>GenerarCompraPendiente<T>)<BR>      Fin<BR>    Sino<BR>      Caso Info.MovTipo<BR>        Es COMS.PR Entonces Dialogo(<T>GenerarCompraPresupuesto<T>) <BR>        Es COMS.R  Entonces Dialogo(<T>GenerarRequisicion<T>)<BR>        Es COMS.C  Entonces Dialogo(<T>GenerarCotizacionCompra<T>)<BR>        Es COMS.O  Entonces Dialogo(Info.Dialogo) <BR>        Es COMS.OI Entonces Dialogo(Info.Dialogo)<BR>        Es COMS.OG Entonces Dialogo(<T>GenerarOrdenGarantia<T>)<BR>        Es COMS.OD Entonces Dialogo(<T>GenerarOrdenDevolucion<T>)<BR>        Es COMS.IG Entonces Dialogo(<T>GenerarIntercambioGarantia<T>)<BR>        Es COMS.CC Entonces Dialogo(<T>GenerarCompraConsignacion<T>)<BR>      Fin<BR>    Fin<BR>  Fin<BR>Fin<BR>//PlugIn ITALIKA<BR>si Compra:Compra.Mov = <T>Entrada Compra<T> Y (SQL(<T>select Valor from TablaStD where TablaSt = :tTab AND Nombre = :tNom <T>, <T>ITALIKA<T>, <T>ACTIVO<T> ) = 1)<BR>entonces<BR>Ejecutar(<T>PlugIns\italika\Italika.exe <T>+<T>1<T>+<T> <T>+Vacio(Compra:Compra.ID,<T>0<T>)+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>)
EjecucionCondicion=GuardarCambios<BR><BR>SI SQL(/**<T>SELECT dbo.FN_encomentario(:nID,:tMod)<T>,Compra:Compra.ID,<T>COMS<T>)=<T>**/1<T><BR>ENTONCES<BR>ConDatos(Compra:Compra.Mov) y ConDatos(Compra:Compra.Almacen)<BR>SINO<BR>1=0<BR>Error(<T>El Movimiento contiene un articulo tipo juego<T>)<BR>FIN<BR><BR>si Compra:Compra.Concepto nulo<BR>    entonces<BR>        botoncancelar(<T>El concepto es obligatorio<T>)<BR>fin<BR><BR><BR>Caso  Mavi.RM1100Bandera<BR><BR>  Es <T>VERDADERO<T> Entonces<BR>     Asigna(Info.Dialogo,<T><T>)<BR>     Asigna(Info.Dialogo,SQL(<T>SP_RM1100ValidaReferencia :tMov, :nID, :tRef<T>,Compra:Compra.Mov,Compra:Compra.ID,Compra:Compra.Referencia))<BR>      Si<BR>        Info.Dialogo = <T>OK<T><BR>      Entonces<BR>       Verdadero<BR>      Sino<BR>        Informacion(Info.Dialogo)<BR>        Dialogo(<T>RM1100Opcionesdlg<T>)<BR>        AbortarOperacion                                        <BR>      Fin<BR><BR>  Es <T>AFECTA<T> Entonces<BR>     Si<BR>       SQL(<T>SELECT COUNT(*) FROM RM1100AutorizAfectacion WITH(NOLOCK) WHERE IDMovimiento =:nID<T>,Compra:Compra.ID)>0<BR>     Entonces<BR>       EjecutarSQL(<T>SP_RM1100Autorizafectacion :nID, :tUsr, :nOpc<T>,Compra:Compra.ID,Mavi.RM1100Usuario,2)<BR>       Verdadero<BR>     Sino<BR>       EjecutarSQL(<T>SP_RM1100Autorizafectacion :nID, :tUsr, :nOpc<T>,Compra:Compra.ID,Mavi.RM1100Usuario,1)<BR>       Verdadero<BR>     Fin                <BR>Fin<BR><BR>        <BR>Si<BR> (Compra:Compra.Mov en(<T>Compra ActivoFijo<T>,<T>Compra Admva<T>,<T>Compra Mantto<T>,<T>Compra Papeleria<T>,<T>Compra Publicidad<T>,<T>Compra Sistemas<T>,<T>Compra Taller<T>)) y (Compra:Compra.Mov <><T>Entrada Compra<T>))<BR>Entonces<BR>   Asigna(Info.Dialogo,<T><T>)<BR>   Asigna(Info.Dialogo,SQLEnLista(<T>SP_RM1100ValidaReferenciaGasComs :nID, :tAcreedor, :tMod<T>,Compra:Compra.ID,Compra:Compra.Proveedor,<T>COMS<T>))<BR>Sino<BR>  Asigna(Info.Dialogo,<T>OK<T>)<BR>Fin<BR><BR>Si<BR> Info.Dialogo =<T>OK<T><BR>Entonces<BR>   Verdadero                                                              <BR>Sino<BR>  Error(Info.Dialogo)<BR>  AbortarOperacion<BR>Fin
ListaAccionesMultiples=Aceptar<BR>Cerrar
GuardarAntes=S
[Acciones.QuitarSeleccion]
Nombre=QuitarSeleccion
Boton=75
NombreDesplegar=&Quitar Seleccion
EnBarraHerramientas=S
TipoAccion=Controles Captura
ClaveAccion=Quitar Seleccion
Activo=S
Visible=S
EspacioPrevio=S
[Acciones.Aceptar.Aceptar]
Nombre=Aceptar
Boton=0
TipoAccion=Expresion
Activo=S
Visible=S
Expresion=RegistrarListaSt(<T>Hoja<T>,<T>IdOrigen<T>)<BR>Asigna(Info.Mensaje, <T>0<T>)<BR>Asigna(Info.Mensaje, SQL(<T>spValidaNumFactSelMAVI :nID, :nEst, :nTipoCobro<T>,  Info.ID, EstacionTrabajo, Info.Cantidad ))<BR>Asigna(Mavi.Folio,SQL(<T>SELECT Clave FROM ListaSt WHERE Estacion=:nEst<T>,EstacionTrabajo))<BR>Asigna(Info.Cantidad,SQL(<T>SELECT C = CASE WHEN DBO.FN_MAVIRM0906CobxPol(:tId) = <T>+Comillas(<T>SI<T>)+<T> THEN 1 ELSE 0 END<T>,Mavi.Folio))<BR>Asigna(Info.Importe,SQL(<T>EXEC SP_MAVIDM0043SugerirMonto :tIDFac, :nEst, :nIdcob,:tImp<T>,Mavi.Folio, EstacionTrabajo,Info.ID,Info.Importe))<BR>Asigna(Info.CanalVentaMAVI,SQL(<T>select V.EnviarA From Venta V With(NoLock) Inner Join Cxc C With(Nolock) ON V.Mov=C.Mov and C.MovID=V.MovID Where C.ID=:nid<T>,Mavi.Folio))<BR>Asigna(Info.Cantidad3,SQL(<T>Select ID From VentasCanalMAVI Where Cadena=:tVal<T>,<T>VENTA VALE<T>))<BR>Asigna(Info.Respuesta5,SQL(<T>SELECT * FROM  FN_MAVIDM0244ExisteAsignacionCliente (:tOpcion ,:tIdPadre,:tCliente)<T>,1,Mavi.Folio,Info.Acreditado)))<BR>Asigna(Mavi.DM0244IndicaAccion, <T>SI<T>)<BR>Asigna(Info.CantidadInventario,SQL(<T>Select dbo.fnDM0305validaTelCte(:tCte,:tUsr)<T>,Info.Acreditado,Usuario))<BR>Si<BR>  Info.CantidadInventario <> 0<BR>Entonces                             <BR>   Ejecutar(<T>PlugIns\DM0305ValidaTelefono.exe <T>+Info.Acreditado+<T> <T>+ Usuario+<T> <T>+Info.CantidadInventario)<BR>   AbortarOperacion<BR> Fin<BR><BR>Si<BR>  Info.CanalVentaMAVI=Info.Cantidad3<BR>    Entonces<BR>      Si (Info.Mensaje = <T>0<T>)<BR>      Entonces<BR>          Si (Info.Respuesta5 = <T>SI<T>)<BR>              entonces<BR>                  Forma(<T>DM0244PreNipCobroFrm<T>)              <BR>              Sino<BR>                  Forma(<T>DM0244NipCobroFrm<T>)<BR>           fin<BR>       sino<BR>          Informacion( Info.Mensaje)<BR>          Asigna(Mavi.DM0244IndicaAccion, <T>NO<T>)<BR>      Fin<BR>    Sino<BR>      Si (Info.Mensaje = <T>0<T>)<BR>      Entonces<BR>          Si (Info.Respuesta5 = <T>NO<T>)<BR>              entonces<BR>                  Forma(<T>NegociaMoratoriosMavi<T>) <BR>              Sino<BR>                  Forma(<T>DM0244PreNipCobroFrm<T>)<BR>           fin<BR>       Sino                          <BR>            Informacion( Info.Mensaje)<BR>            Asigna(Mavi.DM0244IndicaAccion, <T>NO<T>)<BR>      Fin<BR>Fin

[Acciones.Aceptar.Cerrar]
Nombre=Cerrar
Boton=0
TipoAccion=Ventana
ClaveAccion=Cerrar
Activo=S
Visible=S
[Compra.frm/Acciones.Afectar]
NombreEnBoton=S
Expresion=Ejecutar(<T>PlugIns\EtiquetasPerfumeria.exe <T>+<T> <T>+Compra:Compra.MovID)
ActivoCondicion=Compra:Compra.Mov en('Orden Compra') y (Compra:Compra.Estatus en ('PENDIENTE'))
EjecucionCondicion=ConDatos( Compra:Compra.Mov) y ConDatos( Compra:Compra.MovId)
ConCondicion=S
[Hoja.IdCxCOrigen]
Carpeta=Hoja
Clave=IdCxCOrigen
Editar=S
LineaNueva=S
ValidaNombre=S
3D=S
Expresion=Asigna(Afectar.Modulo, <T>VTAS<T>)<BR>Asigna(Afectar.ID, Venta:Venta.ID)<BR>Asigna(Afectar.Mov, Venta:Venta.Mov) <BR>Asigna(Afectar.MovID, Venta:Venta.MovID)<BR>Asigna(Afectar.FormaCaptura, <T>Venta<T>)<BR>Asigna(Info.MovTipo, MovTipo(<T>VTAS<T>, Venta:Venta.Mov))<BR>Asigna(Info.Estatus, Venta:Venta.Estatus)<BR>Si <BR>  (Info.MovTipo en (VTAS.N,VTAS.FM)) y (Info.Estatus noen (EstatusSinAfectar, EstatusBorrador, EstatusPorConfirmar))<BR>Entonces<BR>  Asigna(Info.TituloDialogo, <T>Cancelar: <T>+Afectar.Mov+<T> <T>+Afectar.MovID)<BR>  Dialogo(<T>CancelarNota<T>)<BR>Sino<BR>  Si <BR>    (Info.Estatus=EstatusPendiente) y (Info.MovTipo en (VTAS.P,VTAS.S))<BR>  Entonces<BR>    Asigna(Info.TituloDialogo, <T>Cancelar: <T>+Afectar.Mov+<T> <T>+Afectar.MovID)<BR>    Dialogo(<T>CancelarVentaPendiente<T>)<BR>  Sino<BR>    Si<BR>      Asigna(Temp.Texto, <T><T>)<BR>      Si <BR>        (Config.CancelarFactura<><T>No<T>) y Vacio(Venta:Venta.AnticiposFacturados) y (Info.Estatus noen (EstatusSinAfectar, EstatusBorrador, EstatusPorConfirmar))<BR>      Entonces<BR>        Asigna(Temp.Fecha, SQL(<T>SELECT GETDATE()<T>))<BR>        Si<BR>          Info.MovTipo en (VTAS.F, VTAS.FAR)<BR>        Entonces<BR>          Si             <BR>            (Mes(Temp.Fecha) > Mes(Venta:Venta.FechaEmision)) o (Año(Temp.Fecha) > Año(Venta:Venta.FechaEmision)) o ((Config.CancelarFactura=<T>Cambio Dia<T>) y (Dia(Temp.Fecha) > Dia(Venta:Venta.FechaEmision)))<BR>          Entonces<BR>            Asigna(Temp.Texto, <T>Nota: Esta Cancelación va a Generar un Movimiento Contrario.<T>+NuevaLinea+NuevaLinea+NuevaLinea+NuevaLinea+NuevaLinea+NuevaLinea)<BR>          Fin<BR>        Fin<BR>      Fin<BR>      Precaucion(Temp.Texto+<T>¿ Esta seguro que desea cancelar el movimiento ?<T>+NuevaLinea+NuevaLinea+Afectar.Mov+<T> <T>+Afectar.MovID, BotonSi, BotonNo ) = BotonSi<BR>   Entonces<BR>      Cancelar(<T>VTAS<T>, Venta:Venta.ID, Afectar.Mov, Afectar.MovID, <T>Todo<T>, <T><T>, Afectar.FormaCaptura)<BR><BR>      /*Si<BR>        Empresa.CFD y SQL(<T>spVerMovTipoCFD :tEmpresa, :tModulo, :tMov<T>, Empresa, Afectar.Modulo, Afectar.Mov)<BR>      Entonces<BR>        Si(no CFD.Generar(Afectar.Modulo, Afectar.ID), AbortarOperacion)<BR>        Si(SQL(<T>SELECT EnviarAlAfectar FROM EmpresaCFD WHERE Empresa=:tEmpresa<T>, Empresa), CFD.Enviar(Afectar.Modulo, Afectar.ID))<BR>      Fin*/<BR><BR>    Fin<BR>  Fin<BR>Fin
Tamano=20
ColorFondo=Blanco
ColorFuente=Negro
[Hoja.Articulo]
Carpeta=Hoja
Clave=Articulo
Editar=S
LineaNueva=S
ValidaNombre=S
Expresion=Si<BR>  Compra:Prov.GarantiaCostos y (MovTipo(<T>COMS<T>, Compra:Compra.Mov) = COMS.O) y (Compra:Compra.Estatus en (EstatusSinAfectar, EstatusPorConfirmar))<BR>Entonces<BR>   Si(Confirmacion(<T>Desea Ejecutar la Garantía de Costos<T>, BotonSi, BotonNo)=BotonSi, ProcesarSQL(<T>spCompraGarantiaCostos :nID<T>, Compra:Compra.ID))<BR>Fin<BR><BR>Si<BR>  (MovTipo(<T>COMS<T>, Compra:Compra.Mov)<>COMS.R) o Config.CompraProveedorRequisicion<BR>Entonces<BR>  Si(Vacio(Compra:Compra.Proveedor), Error(<T>Falta Indicar el Proveedor<T>) AbortarOperacion)<BR>Fin<BR><BR>Asigna(Afectar.Modulo, <T>COMS<T>)<BR>Asigna(Afectar.ID, Compra:Compra.ID)<BR>Asigna(Afectar.Mov, Compra:Compra.Mov)<BR>Asigna(Afectar.MovID, Compra:Compra.MovID)<BR>Asigna(Info.MovTipo, MovTipo(<T>COMS<T>, Compra:Compra.Mov))<BR>Si<BR>  (Info.MovTipo=COMS.C) y (Compra:Compra.Estatus=EstatusPorConfirmar)<BR>Entonces<BR>  Dialogo(<T>GenerarCotizacionCompra<T>)<BR>Sino<BR>  Si<BR>    Compra:Compra.Estatus en (EstatusSinAfectar, EstatusBorrador, EstatusPorConfirmar, EstatusPorAutorizarE)<BR>  Entonces<BR>    Si <BR>     (MovTipo(<T>COMS<T>,Compra:Compra.Mov) noen (COMS.R, COMS.PR, COMS.EST)) y Vacio(Compra:Compra.Proveedor)<BR>    Entonces<BR>     Informacion(<T>Falta Indicar el Proveedor<T>, BotonAceptar)<BR>    Sino<BR>      Si(Config.CompraVentaSinIVA y (Suma(CompraD:Impuesto)=0.0) y (Suma(CompraD:Importe)>0.0), Si(Confirmacion(<T>Movimiento sin Impuestos<T>+NuevaLinea+<T>¿ Es Correcto ?<T>,BotonSi,BotonNo)=BotonNo,AbortarOperacion))<BR>      Afectar(Afectar.Modulo, Afectar.ID, Afectar.Mov, Afectar.MovID, <T>Todo<T>, <T><T>, <T>Compra<T>)<BR>      EjecutarSQL(<T>EXEC SP_ContelectronicaAsociacionCFDI :nID, :tMod<T>, Compra:Compra.ID,<T>COMS<T>)<BR>        Si Afectar.Mov =  <T>Solicitud Compra<T><BR>         Entonces<BR>              Ejecutar(<T>PlugIns\DM0285CorreoSolicitudCompra\DM0285CorreoSolicitudCompra.exe<T>+<T> <T>+<T>CorreoAfectado<T>+<T> <T>+ Afectar.ID)<BR>         Fin<BR><BR>    Fin<BR>  Sino<BR>    Asigna(Info.Modulo, <T>COMS<T>)<BR>    Asigna(Info.Mov, Compra:Compra.Mov)<BR>    Asigna(Info.MovID, Compra:Compra.MovID)<BR>    Asigna(Afectar.Base, <T>Pendiente<T>)<BR>    Asigna(Afectar.GenerarMov, <T><T>)<BR>    Asigna(Afectar.FormaCaptura, <T>Compra<T>)<BR>    Si<BR>      ConfigModulo(Info.Modulo, <T>FlujoAbierto<T>) = <T>Si<T><BR>    Entonces<BR>      Si<BR>        Forma(<T>GenerarMovFlujo<T>)<BR>      Entonces<BR>        Asigna(Afectar.GenerarMov, Info.MovGenerar)<BR>        Asigna(Info.TituloDialogo, <T>Generar <T>+Comillas(Info.MovGenerar)+<T> de <T>+Comillas(Info.Mov))<BR>        Dialogo(<T>GenerarCompraPendiente<T>)<BR>      Fin<BR>    Sino<BR>      Caso Info.MovTipo<BR>        Es COMS.PR Entonces Dialogo(<T>GenerarCompraPresupuesto<T>) <BR>        Es COMS.R  Entonces Dialogo(<T>GenerarRequisicion<T>)<BR>        Es COMS.C  Entonces Dialogo(<T>GenerarCotizacionCompra<T>)<BR>        Es COMS.O  Entonces Dialogo(Info.Dialogo) <BR>        Es COMS.OI Entonces Dialogo(Info.Dialogo)<BR>        Es COMS.OG Entonces Dialogo(<T>GenerarOrdenGarantia<T>)<BR>        Es COMS.OD Entonces Dialogo(<T>GenerarOrdenDevolucion<T>)<BR>        Es COMS.IG Entonces Dialogo(<T>GenerarIntercambioGarantia<T>)<BR>        Es COMS.CC Entonces Dialogo(<T>GenerarCompraConsignacion<T>)<BR>      Fin<BR>    Fin<BR>  Fin<BR>Fin<BR>//PlugIn ITALIKA<BR>si Compra:Compra.Mov = <T>Entrada Compra<T> Y (SQL(<T>select Valor from TablaStD where TablaSt = :tTab AND Nombre = :tNom <T>, <T>ITALIKA<T>, <T>ACTIVO<T> ) = 1)<BR>entonces<BR>Ejecutar(<T>PlugIns\italika\Italika.exe <T>+<T>1<T>+<T> <T>+Vacio(Compra:Compra.ID,<T>0<T>)+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>+<T> <T>+<T>0<T>)
EjecucionCondicion=GuardarCambios<BR><BR>SI SQL(<T>SELECT dbo.FN_MAVIDM0169ValidaAlmArt(:nID,:tMod)<T>,Compra:Compra.ID,<T>COMS<T>)=<T>1<T><BR>ENTONCES<BR>ConDatos(Compra:Compra.Mov) y ConDatos(Compra:Compra.Almacen)<BR>SINO<BR>1=0<BR>Error(<T>El Movimiento contiene un articulo tipo juego<T>)<BR>FIN<BR><BR>si Compra:Compra.Concepto nulo<BR>    entonces<BR>        botoncancelar(<T>El concepto es obligatorio<T>)<BR>fin<BR><BR><BR>Caso  Mavi.RM1100Bandera<BR><BR>  Es <T>VERDADERO<T> Entonces<BR>     Asigna(Info.Dialogo,<T><T>)<BR>     Asigna(Info.Dialogo,SQL(<T>SP_RM1100ValidaReferencia :tMov, :nID, :tRef<T>,Compra:Compra.Mov,Compra:Compra.ID,Compra:Compra.Referencia))<BR>      Si<BR>        Info.Dialogo = <T>OK<T><BR>      Entonces<BR>       Verdadero<BR>      Sino<BR>        Informacion(Info.Dialogo)<BR>        Dialogo(<T>RM1100Opcionesdlg<T>)<BR>        AbortarOperacion                                        <BR>      Fin<BR><BR>  Es <T>AFECTA<T> Entonces<BR>     Si<BR>       SQL(<T>SELECT COUNT(*) FROM RM1100AutorizAfectacion WITH(NOLOCK) WHERE IDMovimiento =:nID<T>,Compra:Compra.ID)>0<BR>     Entonces<BR>       EjecutarSQL(<T>SP_RM1100Autorizafectacion :nID, :tUsr, :nOpc<T>,Compra:Compra.ID,Mavi.RM1100Usuario,2)<BR>       Verdadero<BR>     Sino<BR>       EjecutarSQL(<T>SP_RM1100Autorizafectacion :nID, :tUsr, :nOpc<T>,Compra:Compra.ID,Mavi.RM1100Usuario,1)<BR>       Verdadero<BR>     Fin                <BR>Fin<BR><BR>        <BR>Si<BR> (Compra:Compra.Mov en(<T>Compra ActivoFijo<T>,<T>Compra Admva<T>,<T>Compra Mantto<T>,<T>Compra Papeleria<T>,<T>Compra Publicidad<T>,<T>Compra Sistemas<T>,<T>Compra Taller<T>)) y (Compra:Compra.Mov <><T>Entrada Compra<T>))<BR>Entonces<BR>   Asigna(Info.Dialogo,<T><T>)<BR>   Asigna(Info.Dialogo,SQLEnLista(<T>SP_RM1100ValidaReferenciaGasComs :nID, :tAcreedor, :tMod<T>,Compra:Compra.ID,Compra:Compra.Proveedor,<T>COMS<T>))<BR>Sino<BR>  Asigna(Info.Dialogo,<T>OK<T>)<BR>Fin<BR><BR>Si<BR> Info.Dialogo =<T>OK<T><BR>Entonces<BR>   Verdadero                                                              <BR>Sino<BR>  Error(Info.Dialogo)<BR>  AbortarOperacion<BR>Fin
EjecucionMensaje=<T>Es obligatorio indicar movimiento,concepto y almacen<T>
Visible=S
3D=S
Tamano=10
ColorFondo=Blanco
ColorFuente=Negro
[Acciones.CobroSeguro.forma]
Nombre=forma
Boton=0
Expresion=Ejecutar(<T>PlugIns\EtiquetaCalzado\EtiquetasCalzado.exe <T>+<T> <T>+Compra:Compra.MovID)
ActivoCondicion=Compra:Compra.Mov en(<T>Orden Compra<T>)
EjecucionCondicion=ConDatos( Compra:Compra.Mov) y ConDatos( Compra:Compra.MovId)
Visible=S
TipoAccion=Formas
ClaveAccion=DM0169UsuarioAutorizaCobro
Activo=S
Visible=S
[Acciones.CobroSeguro]
Nombre=CobroSeguro
Boton=83
NombreEnBoton=S
NombreDesplegar=Quitar Cobro Obligado A &Seguro
Multiple=S
EnBarraHerramientas=S
EspacioPrevio=S
ListaAccionesMultiples=forma<BR>cerrar
Activo=S
Visible=S
Expresion=ejecutar(<T>PlugIns\MAPAS.exe <T>+<BR><T> <T>+ Info.Cliente+<BR><T> <T>+ CteCtoDireccion:CteCtoDireccion.Tipo+<BR><T> <T>+ Reemplaza( <T> <T>, <T>%20<T>, CteCtoDireccion:CteCtoDireccion.Direccion+ <T> <T> +CteCtoDireccion:CteCtoDireccion.MaviNumero)+<BR><T> <T>+ Reemplaza( <T> <T>, <T>%20<T>, CteCtoDireccion:CteCtoDireccion.Colonia)+<BR><T> <T>+ Reemplaza( <T> <T>, <T>%20<T>, CteCtoDireccion:CteCtoDireccion.Poblacion)+<BR><T> <T>+ Reemplaza( <T> <T>, <T>%20<T>, CteCtoDireccion:CteCtoDireccion.Estado)+<BR><T> <T>+ CteCtoDireccion:CteCtoDireccion.ID+<BR><T> <T>+ NumEnTexto(sql(<T>SELECT Uen FROM ventascanalmavi WHERE id=:nCan<T>,Info.CanalVentaMAVI)))
[Acciones.CobroSeguro.cerrar]
Nombre=cerrar
Boton=0
TipoAccion=Ventana
ClaveAccion=Cerrar
Activo=S
Visible=S
[Hoja.CteFinal]
Carpeta=Hoja
Clave=CteFinal
Editar=S
LineaNueva=S
[AccesoExpirado.frm/Acciones.Aceptar]
EjecucionCondicion=SI SQL(<T> SELECT dbo.fn_DM0187ValidaContrasena(<T>+COMILLAS(USuario:Usuario.Contrasena)+<T>) <T>) = 1<BR>    ENTONCES<BR>       INFORMACION(<T>Tu contraseña debe tener Numeros y Letras<T>)<BR>       FALSO<BR>    SINO<BR>       SI SQL(<T> SELECT dbo.fn_DM0187ValidaContrasena(<T>+COMILLAS(USuario:Usuario.Contrasena)+<T>) <T>) = 3<BR>          ENTONCES<BR>            INFORMACION(<T>La Longitud debe ser mayor a 6 Caracteres<T>)<BR>            FALSO<BR>          SINO<BR>             SI SQL(<T> SELECT dbo.fn_DM0187ContrasenaInsegura(<T>+COMILLAS(Usuario:Usuario.Contrasena)+<T>) <T>) = 1<BR>                ENTONCES<BR>                  INFORMACION(<T>Contraseña Insegura,Intenta con Otra contraseña.<T>)<BR>                  FALSO<BR>             SINO<BR>                Asigna(Info.Contrasena,MD5(<CONTINUA>
EjecucionCondicion002=<CONTINUA>Usuario:Usuario.Contrasena))<BR>                   SI sql(<T>select Contrasena from usuario where Usuario =:tUsu<T>,Usuario:Usuario.Usuario) = Info.Contrasena<BR>                      ENTONCES<BR>                         ERROR(<T>Tu contraseña debe ser diferente a la Anterior<T>)<BR>                         FALSO<BR>                      SINO<BR>                         SI Usuario:Usuario.Contrasena <> Usuario.Contrasena<BR>                            ENTONCES<BR>                              VERDADERO<BR>                            SINO<BR>                               ERROR(<T>Es necesario que Cambie su Contraseña<T>)<BR>                               FALSO<BR>                            FIN<BR>                     FIN<BR>              FIN<BR>       FIN<BR>FIN
ValidaNombre=S
3D=S
Tamano=40
ColorFondo=Blanco
ColorFuente=Negro

