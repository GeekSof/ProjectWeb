<?php
include '../util/util.php';
class dao {
  public function logeUsu(){
       $cnx=new util();
       $cn=$cnx->getConexion();
       $usu=$_SESSION['usu'];
       $pass=$_SESSION['pass'];
       $res=$cn->prepare("call LogeUsu (:usu, :pass)");
       $res->bindParam(":usu", $usu);
       $res->bindParam(":pass", $pass);       
       $res->execute();
       foreach ($res as $row){
           $logeusu[]=$row;
       }
       return $logeusu;
   }
   public function lista(){
       $cnx=new util();
       $cn=$cnx->getConexion();
       $res=$cn->prepare('call lista');
       $res->execute();
       foreach ($res as $row){
           $lista[]=$row;
       }
       return $lista;
   }
  
    public function lista2(){
       $cnx=new util();
       $cn=$cnx->getConexion();
       $res=$cn->prepare('call allprogra');
       $res->execute();
       foreach ($res as $row){
           $lista2[]=$row;
       }
       return $lista2;
   }
    public function lista3(){
       $cnx=new util();
       $cn=$cnx->getConexion();
       $res=$cn->prepare('call listacontacto');
       $res->execute();
       foreach ($res as $row){
           $lista3[]=$row;
       }
       return $lista3;
   }
   public function lista4(){
       $codi=$_SESSION['codi'];
       $cnx=new util();
       $cn=$cnx->getConexion();
       $res=$cn->prepare("call detaprogra(:codi)");
       $res->bindParam(":codi", $codi);
       $res->execute();
       foreach ($res as $row){
           $lista4[]=$row;
       }
     return $lista4;
        }
     
     public function lista5(){
       $codi=$_SESSION['codi'];
       $cnx=new util();
       $cn=$cnx->getConexion();
       $res=$cn->prepare("call detinvestiga(:codi)");
       $res->bindParam(":codi", $codi);
       $res->execute();
       foreach ($res as $row){
           $lista5[]=$row;
       }
     return $lista5;
        }   
   
}
?>