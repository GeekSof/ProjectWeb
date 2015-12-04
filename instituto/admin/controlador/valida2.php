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
    case 'editaredes':
    $enl1=$_REQUEST['link1'];
    $enl2=$_REQUEST['link2'];
    $enl3=$_REQUEST['link3'];
    $enl4=$_REQUEST['link4'];
    $enl5=$_REQUEST['link5'];
    $enl6=$_REQUEST['link6'];
     if($enl1 =='' or $enl2 =='' or $enl3 =='' or $enl4 =='' or $enl5=='' or $enl6==''){
        $array = array();
    $array['valid'] = 0;
    $array['message'] = ' <font class="msg">Tiene que llenar todos los campos!</font>';
    echo json_encode($array);
    }elseif($enl1 ==' ' or $enl2 ==' ' or $enl3 ==' ' or $enl4 ==' ' or $enl5==' ' or $enl6==' '){
        $array = array();
    $array['valid'] = 0;
    $array['message'] = ' <font class="msg">Tiene que llenar todos los campos!</font>';
    echo json_encode($array);
    }else{
        $array = array();
    $array['valid'] = 1;
    $array['message'] = '  <font class="msg"> Se actualizo correctamente!</font>';
        echo json_encode($array);
    $res=$cn->prepare("call editaredes(:l1, :l2, :l3, :l4, :l5, :l6)");
    $res->bindParam(":l1", $enl1);
    $res->bindParam(":l2", $enl2);
    $res->bindParam(":l3", $enl3);
    $res->bindParam(":l4", $enl4);
    $res->bindParam(":l5", $enl5);
    $res->bindParam(":l6", $enl6);
    $res->execute();
     }
    break;
    
    case 'editalema':
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
        $res=$cn->prepare("call editalema(:lem)");
        $res->bindParam(":lem", $texto);
        $res->execute();  
        }
        break;
        
         case 'eliminaslider':
            $arc=$_REQUEST['arcborra'];
            
        unlink('../../vista/assets/img/slider2/'.$arc);
           header('Location: ../vista/editaslider2.php');
          
            break;
        
        case 'subeslider2':
            $formatos=array('.jpg', '.png');
	$directorio='../../vista/assets/img/slider2/';
	if(isset($_POST['boton'])){
		$nombreArchivo= $_FILES['archivo']['name'];
		$nombreTmpArchivo= $_FILES['archivo']['tmp_name'];
		$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));
		if(in_array($ext, $formatos)){
			if(move_uploaded_file($nombreTmpArchivo, "$directorio/$nombreArchivo")){
				header('Location: ../vista/editaslider2.php');
			}else{
				header('Location: ../vista/editaslider2.php');
			}
		}else{
			header('Location: ../vista/editaslider2.php');
		}
	}
            break;
            
            case 'actdatos':            
            $nom=$_REQUEST['name'];
                $_SESSION['nomusu']=$nom;
            $user=$_REQUEST['email'];
            $pass=$_REQUEST['pass'];
            if($nom == '' or $user == '' or $pass == ''){
           $array = array();
        $array['valid'] = 0;
        $array['message'] = ' <font class="msg">Tiene que llenar todos los campos!</font>';
        echo json_encode($array);
        }if($nom == ' ' or $user == ' ' or $pass == ' '){
           $array = array();
        $array['valid'] = 0;
        $array['message'] = ' <font class="msg">Tiene que llenar todos los campos!</font>';
        echo json_encode($array);
        }else{
          $array = array();
        $array['valid'] = 1;
        $array['message'] = '  <font class="msg"> Se actualizo correctamente!</font>';
         echo json_encode($array);
        $res=$cn->prepare("call editaperfil(:nom, :usu, :pas)");
        $res->bindParam(":nom", $nom);
        $res->bindParam(":usu", $user);
        $res->bindParam(":pas", $pass);
        $res->execute();
          
        }
        break;
        
         case 'editaanuncio':
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
        $res=$cn->prepare("call editaanuncio(:cuer)");
        $res->bindParam(":cuer", $texto);
        $res->execute();  
        }      
        }
        break;
        
        case 'estado':
        $est=$_REQUEST['est'];
        $res=$cn->prepare("call actdesanuncio(:est)");
        $res->bindParam(":est", $est);
        $res->execute();
        header('Location: ../vista/anuncios.php');
        break;
    
        case 'borradocente':
        $codoc=$_REQUEST['codoc'];
        $res=$cn->prepare("call borradocente(:codoc)");
        $res->bindParam(":codoc", $codoc);
        $res->execute();
        unlink('../../vista/assets/img/team/'.$codoc.'.jpg');
        header('Location: ../vista/docentes.php');  
        break;
        
        case 'newdocente':
        $nom=$_REQUEST['nom'];
        $texto=$_REQUEST['editor1'];
        $ruta2="../../vista/assets/img/team";
        $archivo=@$_FILES['img']['tmp_name'];
        $res=$cn->prepare("call newdocente(:nom, :tex)");
        $res->bindParam(":nom", $nom);
        $res->bindParam(":tex", $texto);
        $res->execute();
       foreach ($res as $row){
            $fotocur=$row[1];
             move_uploaded_file($archivo, $ruta2 . "/" . $fotocur);
        } 
        header('location: ../vista/docentes.php');
        break;
        
        case 'newinvest':
        $nom=$_REQUEST['nom'];
        $texto=$_REQUEST['editor1'];
        $ruta2="../../vista/assets/img/investigacion";
        $archivo=@$_FILES['img']['tmp_name'];
        $res=$cn->prepare("call newinvest(:nom, :tex)");
        $res->bindParam(":nom", $nom);
        $res->bindParam(":tex", $texto);
        $res->execute();
       foreach ($res as $row){
            $fotocur=$row[1];
             move_uploaded_file($archivo, $ruta2 . "/" . $fotocur);
        } 
        header('location: ../vista/investigacion.php');
        break;
        
        case 'borrainvest':
        $codin=$_REQUEST['codin'];
        $res=$cn->prepare("call borrainvest(:codin)");
        $res->bindParam(":codin", $codin);
        $res->execute();
        unlink('../../vista/assets/img/investigacion/'.$codin.'.jpg');
        header('Location: ../vista/investigacion.php');  
        break;
        
        case 'editainvesti':
        $cod=$_REQUEST['cod'];
        $nom=$_REQUEST['nom'];
        $texto=$_REQUEST['editor1'];
        $ruta3="../../vista/assets/img/investigacion";
        $archivo=@$_FILES['img']['tmp_name'];
        move_uploaded_file($archivo, $ruta3 . "/" . $cod.'.jpg');
        $res=$cn->prepare("call editainvesti(:cod, :nom, :tex)");
        $res->bindParam(":cod", $cod);
        $res->bindParam(":nom", $nom);
        $res->bindParam(":tex", $texto);
        $res->execute();
        header('location: ../vista/investigacion.php');
        break;
    
    case 'subeclients':
            $formatos=array('.jpg', '.png');
	$directorio='../../vista/assets/clients/';
	if(isset($_POST['boton'])){
		$nombreArchivo= $_FILES['archivo']['name'];
		$nombreTmpArchivo= $_FILES['archivo']['tmp_name'];
		$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));
		if(in_array($ext, $formatos)){
			if(move_uploaded_file($nombreTmpArchivo, "$directorio/$nombreArchivo")){
				header('Location: ../vista/clientes.php');
			}else{
				header('Location: ../vista/clientes.php');
			}
		}else{
			header('Location: ../vista/clientes.php');
		}
	}
            break;
            
            case 'borraclients':
            $arc=$_REQUEST['arcborra'];
            
        unlink('../../vista/assets/clients/'.$arc);
           header('Location: ../vista/clientes.php');
          
            break;
        
         case 'cambimagen':
            $formatos=array('.jpg', '.png');
	$directorio='../../vista/assets/img/';
	if(isset($_POST['boton'])){
                $nombre=$_REQUEST['nombre'];
		$nombreArchivo= $_FILES['archivo']['name'];
		$nombreTmpArchivo= $_FILES['archivo']['tmp_name'];
		$ext = substr($nombreArchivo, strrpos($nombreArchivo, '.'));
		if(in_array($ext, $formatos)){
			if(move_uploaded_file($nombreTmpArchivo, "$directorio/$nombre$ext")){
				header('Location: ../vista/imagenes.php');
			}else{
				header('Location: ../vista/imagenes.php');
			}
		}else{
			header('Location: ../vista/imagenes.php');
		}
	}
            break;
            
         case 'borraalbum':
        $codalb=$_REQUEST['codalb'];
        $res=$cn->prepare("call borraalbum(:cod)");
        $res->bindParam(":cod", $codalb);
        $res->execute();
        unlink('../../vista/assets/img/albumes/'.$codalb.'.jpg');
        header('Location: ../vista/multimedia.php');  
        break;   
            
        case 'newalbum':
        $nom=$_REQUEST['nom'];
        $rutaalb="../../vista/assets/img/albumes";
        $archivo=@$_FILES['img']['tmp_name'];
        $res=$cn->prepare("call newalbum(:nom)");
        $res->bindParam(":nom", $nom);
        $res->execute();
       foreach ($res as $row){
            $fotoalb=$row[1];
             move_uploaded_file($archivo, $rutaalb . "/" . $fotoalb);
        } 
        header('location: ../vista/multimedia.php');
        break;
        
         case 'newfoto':
        $nom=$_REQUEST['nom'];
        $codalb=$_REQUEST['codalb'];
        $rutafoto="../../vista/assets/img/albumes/detalbum";
        $archivo=@$_FILES['img']['tmp_name'];
        $res=$cn->prepare("call newfoto(:nom, :calb)");
        $res->bindParam(":nom", $nom);
        $res->bindParam(":calb", $codalb);
        $res->execute();
       foreach ($res as $row){
            $enlace=$row[1];
             move_uploaded_file($archivo, $rutafoto . "/" . $enlace);
        } 
        header("location: ../vista/detaalbum.php?codalb=$codalb");
        break;
        
         case 'newvideo':
        $nom=$_REQUEST['nom'];
        $enlace=$_REQUEST['enlace'];
        $codalb=$_REQUEST['codalb'];
        $res=$cn->prepare("call newvideo(:nom, :enla, :calb)");
        $res->bindParam(":nom", $nom);
        $res->bindParam(":enla", $enlace);
        $res->bindParam(":calb", $codalb);
        $res->execute();
        header("location: ../vista/detaalbum.php?codalb=$codalb");
        break;
        
        case 'borradetalb':
        $codal=$_REQUEST['codal'];
        $codalb=$_REQUEST['codalb'];
        $res=$cn->prepare("call borradetalb(:cod)");
        $res->bindParam(":cod", $codal);
        $res->execute();
        unlink('../../vista/assets/img/albumes/detalbum/'.$codal.'.jpg');
        header("location: ../vista/detaalbum.php?codalb=$codalb");  
        break;  
    
    default:
           header('Location: ../vista/index.php');
        break;
    
}
?>