<?php
    session_start();
    include '../dao/dao.php';
    $op=$_REQUEST['op'];
    switch ($op){
        case 1:         
             unset($_SESSION['logeusu']); 
            $objDAO=new dao();
            $usu=$_REQUEST['username'];
            $pass=$_REQUEST['password'];
            $_SESSION['usu']=$usu;
            $_SESSION['pass']=$pass;
            $logeusu=$objDAO->logeUsu($usu, $pass);
            foreach ($logeusu as $raw){
                $nomusu=$raw[1];
                $codusu=$raw[0];
                $rol=$raw[2];
            }
            if($logeusu != null){
                $_SESSION['nomusu']=$nomusu;
                $_SESSION['codusu']=$codusu;
                $_SESSION['rol']=$rol;
                $_SESSION['acceso']=true;
                header("Location: ../vista/index.php");
            }else{
                $_SESSION['msg']='Error de Usuario';
                 header("Location: ../vista/login.php");
                }
             break;
             case 2:
            session_unset($_SESSION['acceso']);
            session_unset($_SESSION['codusu']);
            session_unset($_SESSION['rol']);
            session_unset($_SESSION['nomusu']);
            session_unset($_SESSION['msg']);
        header('Location: ../vista/login.php');
            break;
        case 3:
               unset($_SESSION['lista']); 
            $objDAO=new dao();
            $lista=$objDAO->lista();
             $_SESSION['lista']=$lista;
    header('Location: ../vista/index.php');
        break;
    case 4:
         unset($_SESSION['lista2']); 
            $objDAO=new dao();
            $lista2=$objDAO->lista2();
             $_SESSION['lista2']=$lista2;
    header('Location: ../vista/allprogra.php');
        break;
   case 5:
         unset($_SESSION['lista3']); 
            $objDAO=new dao();
            $lista3=$objDAO->lista3();
             $_SESSION['lista3']=$lista3;
    header('Location: ../vista/editacontac.php');
        break;
    case 6:
         unset($_SESSION['lista4']); 
            $objDAO=new dao();
            $codi=$_REQUEST['codi'];
            $_SESSION['codi']=$codi;
            $lista4=$objDAO->lista4($codi);
             $_SESSION['lista4']=$lista4;
             header("Location: ../vista/editaprograma.php");  
        break;
    
     case 7:
         unset($_SESSION['lista5']); 
            $objDAO=new dao();
            $codi=$_REQUEST['codi'];
            $_SESSION['codi']=$codi;
            $lista5=$objDAO->lista5($codi);
             $_SESSION['lista5']=$lista5;
             header("Location: ../vista/editainvestigacion.php");  
        break;
        default :
            header('Location: ../vista/index.php');
            break;
    }
?>