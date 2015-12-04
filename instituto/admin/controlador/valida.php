<?php
if(isset($_REQUEST['accion'])){
        $accion=$_REQUEST['accion'];
    }else{
        header('Location: ../vista/index.php');
    }
  include '../util/util.php';
  session_start();
  $cnx=new util();
             $cn=$cnx->getConexion();

$tildes = $cn->query("SET NAMES 'utf8'");
switch ($accion) {   
  case 'edtincispp':
        
if($_POST) {
        $texto=$_REQUEST['editor1'];
       
        if($texto ==''){
           $array = array();
        $array['valid'] = 0;
        $array['message'] = ' <font class="msg">Tiene que llenar este campo!</font>';
        echo json_encode($array);
        }else{
          $array = array();
        $array['valid'] = 1;
        $array['message'] = '  <font class="msg"> Se actualizo correctamente!</font>';
         echo json_encode($array);
        $res=$cn->prepare("call editaincispp(:cuer)");
        $res->bindParam(":cuer", $texto);
        $res->execute();
          
        }
        
}
        break;
        
        case 'newprograma':
            $nom=$_REQUEST['nom'];
            $conte=$_REQUEST['editor1'];
            $conte2=$_REQUEST['editor2'];
            $conte3=$_REQUEST['editor3'];
            $codp=$_REQUEST['codp'];
            $codd=$_REQUEST['codd'];
             $ruta="../programas";
        $archivo=@$_FILES['foto']['tmp_name'];
        $archivo2=@$_FILES['foto2']['tmp_name'];
         $res=$cn->prepare("call nuevoproga(:nom, :conte, :conte2, :conte3, :codp, :codd)");
        $res->bindParam(":nom", $nom);
        $res->bindParam(":conte", $conte);
        $res->bindParam(":conte2", $conte2);
        $res->bindParam(":conte3", $conte3);
        $res->bindParam(":codp", $codp);
        $res->bindParam(":codd", $codd);
        $res->execute();
        foreach ($res as $row){
            $img1=$row[1];
            $img2=$row[2];
        move_uploaded_file($archivo, $ruta . "/" . $img1);
        move_uploaded_file($archivo2, $ruta . "/" . $img2);
        }   
        header('Location: ../vista/newprograma.php');
            break;
        
        case 'editaprograma':
            $cod=$_REQUEST['cod'];
            $nom=$_REQUEST['nom'];
            $conte=$_REQUEST['editor1'];
            $conte2=$_REQUEST['editor2'];
            $conte3=$_REQUEST['editor3'];
             $ruta="../programas";
        $archivo1=@$_FILES['foto']['tmp_name'];
        $archivo2=@$_FILES['foto2']['tmp_name'];
        $nom_archivo1=@$_FILES['foto']['name'];
        $nom_archivo2=@$_FILES['foto2']['name'];
        $ext1=  pathinfo($nom_archivo1);
        $ext2=  pathinfo($nom_archivo2);
        move_uploaded_file($archivo1, $ruta ."/". $cod .".".  @$ext1['extension']);
        move_uploaded_file($archivo2, $ruta ."/". $cod ."b." .  @$ext2['extension']);
        $res=$cn->prepare("call editaprograma(:cod, :nom, :conte1, :conte2, :conte3)");
        $res->bindParam(":cod", $cod);
        $res->bindParam(":nom", $nom);
        $res->bindParam(":conte1", $conte);
        $res->bindParam(":conte2", $conte2);
        $res->bindParam(":conte3", $conte3);
        $res->execute();
         
        header('Location: ../vista/allprogra.php');
            break;    
            
        case 'borraprograma':
            $codcpro=$_REQUEST['codcpro'];
            $res=$cn->prepare('call borraprograma(:cod)');
            $res->bindParam(':cod', $codcpro);
            $res->execute();
            unlink('../programas/'.$codcpro.'.jpg');
            unlink('../programas/'.$codcpro.'b.jpg');
            header('Location: ../vista/allprogra.php');
            break;
            
         case 'eliminaslider':
            $arc=$_REQUEST['arcborra'];
            
        unlink('../../vista/assets/img/slider/'.$arc);
           header('Location: ../vista/editaslider.php');
          
            break;
        
        case 'subeslider1':
            $formatos=array('.jpg', '.png');
	$directorio='../../vista/assets/img/slider/';
	if(isset($_POST['boton'])){
                $progra=$_REQUEST['progra'];
		$nombreArchivo= $_FILES['archivo']['name'];
		$nombreTmpArchivo= $_FILES['archivo']['tmp_name'];
		$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));
		if(in_array($ext, $formatos)){
			if(move_uploaded_file($nombreTmpArchivo, "$directorio/$progra$ext")){
				header('Location: ../vista/editaslider.php');
			}else{
				header('Location: ../vista/editaslider.php');
			}
		}else{
			header('Location: ../vista/editaslider.php');
		}
	}
            break;
        
            case 'actcontacto':
                $fijo=$_REQUEST['fijo'];
            $fono1=$_REQUEST['fono1'];
            $fono2=$_REQUEST['fono2'];
            $dire=$_REQUEST['dire'];
            $email=$_REQUEST['email'];
            $refe=$_REQUEST['refe'];
            $hora=$_REQUEST['hora'];
            if($dire =='' or $fono1 =='' or $fono2 =='' or $fijo =='' or $email=='' or $refe=='' or $hora==''){
           $array = array();
        $array['valid'] = 0;
        $array['message'] = ' <font class="msg">Tiene que llenar todos los campos!</font>';
        echo json_encode($array);
        }else{
          $array = array();
        $array['valid'] = 1;
        $array['message'] = '  <font class="msg"> Se actualizo correctamente!</font>';
         echo json_encode($array);
        $res=$cn->prepare("call editacontacto(:dire, :fijo, :tl1, :tl2, :mail, :refe, :hora)");
        $res->bindParam(":dire", $dire);
        $res->bindParam(":fijo", $fijo);
        $res->bindParam(":tl1", $fono1);
        $res->bindParam(":tl2", $fono2);
        $res->bindParam(":mail", $email);
        $res->bindParam(":refe", $refe);
        $res->bindParam(":hora", $hora);
        $res->execute();
          
        }
            break;
    default:
           header('Location: ../vista/index.php');
        break;
    
}
?>