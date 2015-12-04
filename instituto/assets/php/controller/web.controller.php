<?php 
require_once 'assets/php/model/web.model.php';

class webController 
{
	private $model;

	function __construct()
	{
		$this->model = new webModel();
	}		
	/*----------------------------------*/
	function lista_incispp(){
		return $this->model->lista_incispp();
	}
	function lista_programa(){
		return $this->model->lista_programa();
	}
	function lista_DetProgram($cod){
		return $this->model->lista_DetProgram($cod);
	}
	function lista_UltiProgram(){
		return $this->model->lista_UltiProgram();
	}
	function lista_CadProgram($cod){
		return $this->model->lista_CadProgram($cod);
	}
	function lista_Contacto(){
		return $this->model->lista_Contacto();
	}
	function lista_lema(){
		return $this->model->lista_lema();
	}
	function lista_docente(){
		return $this->model->lista_docente();
	}
	function lista_perfil(){
		return $this->model->lista_perfil();
	}
	function lista_anuncio(){
		return $this->model->lista_anuncio();
	}
	function lista_investigacion(){
		return $this->model->lista_investigacion();
	}
	function lista_DetInvestigacion($cod){
		return $this->model->lista_DetInvestigacion($cod);
	}
	function lista_redes(){
		return $this->model->lista_redes();
	}
	function lista_album(){
		return $this->model->lista_album();
	}
	function lista_fotos($cod){
		return $this->model->lista_fotos($cod);
	}
	function lista_videos($cod){
		return $this->model->lista_videos($cod);
	}
}
