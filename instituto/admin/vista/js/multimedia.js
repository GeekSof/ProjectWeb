$('#formulariohide').hide();

function muestraformulario(){
    $('#formulariohide').fadeIn(500);
}

function ocultaformulario(){
    $('#formulariohide').fadeOut(500);
       $('#multimedia').trigger("reset");
}
