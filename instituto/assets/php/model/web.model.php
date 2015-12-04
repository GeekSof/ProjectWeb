<?php 
require_once 'assets/php/util/util.php';

class webModel
{
	private $cn;
	
	function __construct()
	{
		$db_cone = new util();
		$this->cn = $db_cone->getConexion();
	}
	/*----------------------------------*/
	function lista_incispp(){
		$res = $this->cn->prepare('call lista()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_programa(){
		$res = $this->cn->prepare('call allprogra()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_DetProgram($cod){
		$res = $this->cn->prepare('call detaprogra(?)');
		$res->execute(array($cod));
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_UltiProgram(){
		$res = $this->cn->prepare('call listcadapro()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_CadProgram($cod){
		$res = $this->cn->prepare('call programas(?)');
		$res->execute(array($cod));
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_Contacto(){		
		$res = $this->cn->prepare('call listacontacto()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_lema(){
		$res = $this->cn->prepare('call lislema()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_docente(){
		$res = $this->cn->prepare('call listdocente()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_perfil(){
		$res = $this->cn->prepare('call lisperfil()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_anuncio(){
		$res = $this->cn->prepare('call lisanuncuio()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_investigacion(){
		$res = $this->cn->prepare('call listinvesti()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_DetInvestigacion($cod){
		$res = $this->cn->prepare('call detinvestiga(?)');
		$res->execute(array($cod));
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_redes(){
		$res = $this->cn->prepare('call lisredes()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_album(){
		$res = $this->cn->prepare('call listalbum()');
		$res->execute();
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_fotos($cod){
		$res = $this->cn->prepare('call listafotos(?)');
		$res->execute(array($cod));
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
	function lista_videos($cod){
		$res = $this->cn->prepare('call listavideos(?)');
		$res->execute(array($cod));
		return $res->fetchAll(PDO::FETCH_OBJ);
	}
}