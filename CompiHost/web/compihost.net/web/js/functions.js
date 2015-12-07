



function redirec(capa,urll,datos){	

$.ajax({
        url: urll,
      contentType: "application/x-www-form-urlencoded",
        dataType: "html",
        error: function(objeto, quepaso, otroobj){
            alert(" vuelva a intentarlo");
        },
		data: datos,
        success: function(datos){
			$("#"+capa).html(datos); 
        },
        type: "POST"
});
  
}


function mandar(urll,datos){	

$.ajax({
        url: urll,
        contentType: "application/x-www-form-urlencoded",
        dataType: "html",
        error: function(objeto, quepaso, otroobj){
            alert(" Estas viendo esto por que falle");
            alert(" Paso lo siguiente: "+quepaso);
        },
		data: datos,
        type: "POST"
});
  return false;
}


			
function ValidaURL(url) {
var regex=/^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,3}|info|mobi|aero|asia|name)(:\d{2,5})?(\/)?((\/).+)?$/i;
return regex.test(url); 
}
			



function OcultarFilas(Fila) {
    var elementos = document.getElementsByName(Fila);
    for (k = 0; k< elementos.length; k++) {
               elementos[k].style.display = "none";
    }
}




			function vimagen(f)	{
				enviar = /\.(gif|jpg|png|ico|bmp)$/i.test(f.value);
				if (!enviar){	alert("solo imagenes gif|jpg|jpeg|png|bmp|ico");
				//limpiar();
				 return false;
				}
				return enviar;
			}
			function limpiar(archivo)	{
				f = document.getElementById(archivo);
				nuevoFile = document.createElement("input");
				nuevoFile.id = f.id;
				nuevoFile.type = "file";
				nuevoFile.name = "archivo";
				nuevoFile.size = 10;
				nuevoFile.onchange = f.onchange;
				nodoPadre = f.parentNode;
				nodoSiguiente = f.nextSibling;
				nodoPadre.removeChild(f);
				(nodoSiguiente == null) ? nodoPadre.appendChild(nuevoFile):
					nodoPadre.insertBefore(nuevoFile, nodoSiguiente);
			}
