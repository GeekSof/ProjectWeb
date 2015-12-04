<?php
    session_start();
    if($_SESSION['acceso']<>true){
        header('Location: login.php');
    } 
    $nomusu=$_SESSION['nomusu'];
      include '../util/util.php';
       $cnx=new util();
       $cn=$cnx->getConexion();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>INCISPP | Panel de Control</title>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <!-- Bootstrap 3.3.4 -->
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- Font Awesome Icons -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <!-- Ionicons -->
    <link href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css" />
    <!-- Theme style -->
    <link href="dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />
    <!-- AdminLTE Skins. We have chosen the skin-blue for this starter
          page. However, you can choose any other skin. Make sure you
          apply the skin class to the body tag so the changes take effect.
    -->
     <link rel="shortcut icon" href="../../vista/assets/ico/logo.ico">
    <link href="dist/css/skins/skin-blue.min.css" rel="stylesheet" type="text/css" />
     <link href="css/css.css" rel="stylesheet" type="text/css" />
<link href="plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css" rel="stylesheet" type="text/css" />
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  

  </head>
  <!--
  BODY TAG OPTIONS:
  =================
  Apply one or more of the following classes to get the
  desired effect
  |---------------------------------------------------------|
  | SKINS         | skin-blue                               |
  |               | skin-black                              |
  |               | skin-purple                             |
  |               | skin-yellow                             |
  |               | skin-red                                |
  |               | skin-green                              |
  |---------------------------------------------------------|
  |LAYOUT OPTIONS | fixed                                   |
  |               | layout-boxed                            |
  |               | layout-top-nav                          |
  |               | sidebar-collapse                        |
  |               | sidebar-mini                            |
  |---------------------------------------------------------|
  -->
  <body class="skin-blue sidebar-mini">
    <div class="wrapper">

      <!-- Main Header -->
      <header class="main-header">

        <!-- Logo -->
       <a href="index.php" class="logo">
          <!-- mini logo for sidebar mini 50x50 pixels -->
          <span class="logo-mini"><img src="../../assets/ico/logo2.png"></span>
          <!-- logo for regular state and mobile devices -->
          <span class="logo-lg"><img src="../../assets/img/logo.png"></span>
        </a>

        <!-- Header Navbar -->
        <nav class="navbar navbar-static-top" role="navigation">
          <!-- Sidebar toggle button-->
          <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
          </a>
          <!-- Navbar Right Menu -->
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
              <!-- Messages: style can be found in dropdown.less-->
              

             

              <!-- User Account Menu -->
              <li class="dropdown user user-menu">
                <!-- Menu Toggle Button -->
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <!-- The user image in the navbar-->
                  <img src="dist/img/user2-160x160.jpg" class="user-image" alt="User Image"/>
                  <!-- hidden-xs hides the username on small devices so only the image appears. -->
                  <span class="hidden-xs"><?php echo $nomusu;?></span>
                </a>
                <ul class="dropdown-menu">
                  <!-- The user image in the menu -->
                  <li class="user-header">
                    <img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image" />
                    <p>
                      <?php echo $nomusu;?>
                    </p>
                  </li>
                  
                  <!-- Menu Footer-->
                  <li class="user-footer">
                    <div class="pull-left">
                      <a href="perfil.php" class="btn btn-default btn-flat">Perfil</a>
                    </div>
                    <div class="pull-right">
                      <a href="../controlador/controlador.php?op=2" class="btn btn-default btn-flat">Salir</a>
                    </div>
                  </li>
                </ul>
              </li>
              <!-- Control Sidebar Toggle Button -->
               
            </ul>
          </div>
        </nav>
      </header>
      <!-- Left side column. contains the logo and sidebar -->
      <aside class="main-sidebar">

        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar">

          <!-- Sidebar user panel (optional) -->
          <div class="user-panel">
            <div class="pull-left image">
              <img src="dist/img/user2-160x160.jpg" class="img-circle" alt="User Image" />
            </div>
            <div class="pull-left info">
            <p><?php echo $nomusu;?></p>
              <!-- Status -->
              <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
            </div>
          </div>


          <!-- Sidebar Menu -->
           <ul class="sidebar-menu">
            <li class="header">Menu</li>
            <!-- Optionally, you can add icons to the links -->
            <li><a href="index.php"><i class='fa fa-institution'></i> <span>INCISPP</span></a></li>
             
             <li class="treeview">
              <a href="#">
                <i class="fa fa-graduation-cap"></i> <span>Programas Académicos</span>
                <i class="fa fa-angle-left pull-right"></i>
              </a>
              <ul class="treeview-menu">
                
                <li><a href="newprograma.php"><i class="fa fa-circle-o"></i>Nuevo</a></li>                
                <li><a href="../controlador/controlador.php?op=4"><i class="fa fa-circle-o"></i>Ver Todos</a></li>
              </ul>
            </li>
             <li class="treeview">
              <a href="#">
                <i class="fa fa-graduation-cap"></i> <span>Fondo Editorial</span>
                <i class="fa fa-angle-left pull-right"></i>
              </a>
              <ul class="treeview-menu">
                <li><a href="#"><i class="fa fa-book"></i>Libros<i class="fa fa-angle-left pull-right"></i></a>
                    <ul class="treeview-menu">
                    <li><a href="nuevolibro.php"><i class="fa fa-circle-o"></i>Nuevo</a></li>
                    <li>
                      <a href="../controlador/controlador.php?op=8"><i class="fa fa-circle-o"></i>Listar Todos</a>
                     
                    </li>
                  </ul>
                </li>
               <li><a href="#"><i class="fa fa-file"></i>Revistas<i class="fa fa-angle-left pull-right"></i></a>
                    <ul class="treeview-menu">
                    <li><a href="nuevarevis.php"><i class="fa fa-circle-o"></i>Nuevo</a></li>
                    <li>
                      <a href="../controlador/controlador.php?op=9"><i class="fa fa-circle-o"></i>Listar Todos</a>
                     
                    </li>
                  </ul>
               </li>
               <li><a href="#"><i class="fa fa-rss-square"></i>Artículos<i class="fa fa-angle-left pull-right"></i></a>
                <ul class="treeview-menu">
                    <li><a href="nuevoart.php"><i class="fa fa-circle-o"></i>Nuevo</a></li>
                    <li>
                      <a href="../controlador/controlador.php?op=10"><i class="fa fa-circle-o"></i>Listar Todos</a>
                     
                    </li>
                  </ul>
               </li>
              </ul>
            </li>
            <li><a href="investigacion.php"><i class='fa fa-eyedropper'></i> <span>Investigación</span></a></li>
            <li><a href="editaslider.php"><i class='fa fa-camera'></i> <span>Slider</span></a></li> 
            <li><a href="editaslider2.php"><i class='fa fa-camera'></i> <span>Slider 2</span></a></li> 
             <li><a href="editacontac.php"><i class='fa fa-envelope'></i> <span>Contacto</span></a></li>
             <li><a href="docentes.php"><i class='fa fa-users'></i> <span>Plana Docente</span></a></li>
             <li class="active"><a href="lemayredes.php"><i class='fa fa-tag'></i> <span>Lema y Redes Sociales</span></a></li>
              <li><a href="anuncios.php"><i class='fa fa-volume-up'></i> <span>Anuncios</span></a></li>
              <li><a href="imagenes.php"><i class='fa fa-photo'></i> <span>Actualizar Imagenes</span></a></li>
              <li><a href="clientes.php"><i class='fa fa-apple'></i> <span>Clientes</span></a></li>
               <li><a href="multimedia.php"><i class='fa fa-file-movie-o'></i> <span>Multimedia</span></a></li>
          </ul><!-- /.sidebar-menu -->
        </section>
        <!-- /.sidebar -->
      </aside>

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <section class="content-header">
          <h1>
            Panel de Control
            <small>Version 2.0</small>
          </h1>
         <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-tag"></i>Lema y Redes Sociales</a></li>
             
          </ol>
        </section>

        <!-- Main content -->
        <section class="content">

            <div class="row">
                <div class="col-lg-6">                                 
                    <div class="box box-info">
                            <div class="box-header with-border">
                                <i class="fa fa-tag"></i><h3 class="box-title">Actualizar Redes Sociales</h3>
                            </div>    
                        <?php
                                 $res=$cn->prepare("call lisredes");
                                  $res->execute();
                                            foreach ($res as $row){
                        ?>
                        <form id="formredes" class="form-horizontal" action="../controlador/valida2.php" method="post">
                            <input type="hidden" name="accion" value="editaredes">
                            <div class="box-body">
                                <div class="form-group">
                                <label  class="col-sm-2 control-label">Enlace Twiter</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" name="link1" value="<?php echo $row[0] ?>">
                                </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-sm-2 control-label">Enlace Google</label>
                                    <div class="col-sm-10">
                                        <input type="text"   name="link2" class="form-control" value="<?php echo $row[1] ?>">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-sm-2 control-label">Enlace Facebook </label>
                                    <div class="col-sm-10">
                                        <input type="text"    name="link3" class="form-control" value="<?php echo $row[2] ?>">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-sm-2 control-label">Enlace Youtube</label>
                                    <div class="col-sm-10">
                                        <input type="text" name="link4" class="form-control"  value="<?php echo $row[3] ?>">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                <label  class="col-sm-2 control-label">Enlace Linkedin</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" name="link5" value="<?php echo $row[4] ?>">
                                </div>
                                </div>
                                <div class="form-group">
                                <label  class="col-sm-2 control-label">Enlace Blog</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" name="link6" value="<?php echo $row[5] ?>">
                                </div>
                                </div>
                            </div>
                                <div class="box-footer">
                                    
                                    <button type="submit" class="btn btn-info pull-right">Actualizar</button>
                                </div>  
                        </form>
                         <?php } ?>
                    </div>
                </div> 
                <div class="col-xs-6">
                 <div class='box box-info'>
                <div class="box-header with-border">
                                <i class="fa fa-tag"></i><h3 class="box-title">Actualizar Lema</h3>
                            </div> 
                
                <div class='box-body pad'>
                  <form id="formlema"   action="../controlador/valida.php" method="post">
                      <input type="hidden" name="accion" value="editalema">
                    <textarea class="ckeditor" id="editor1" name="editor1" rows="10" cols="80">
                                   <?php
                                   $cnx=new util();
                                   $cn=$cnx->getConexion();
                                   $res2=$cn->prepare("call lislema");
                                   $res2->execute();
                                   foreach ($res2 as $row){
                                   echo $row[0];
                        }
                                   ?>
                    </textarea><br>
                      <button class="btn btn-success pull-right" onclick="CKupdate();" id="bnt1" type="submit" name="btn1">Actualizar</button>
                  </form>
                </div>
              </div><!-- /.box -->
        </div>
                
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <p class="success-message fa fa-check">
                
            </p>
            <p class="error-message fa fa-check">
              
             </p>
                </div>
            </div>
             
        
        </section><!-- /.content -->
      </div><!-- /.content-wrapper -->

      <!-- Main Footer -->
      <footer class="main-footer">
        <!-- To the right -->
         
        <!-- Default to the left -->
        <strong>Desarrollado Por <a target="_blank" href="http://www.innovatechperusac.com/">INNOVATECHPERÚ.</a></strong> Copyright © 2015
      </footer>
      
      <!-- Control Sidebar -->      
      <aside class="control-sidebar control-sidebar-dark">                
        <!-- Create the tabs -->
         
        <!-- Tab panes -->
         
      </aside><!-- /.control-sidebar -->
      <!-- Add the sidebar's background. This div must be placed
           immediately after the control sidebar -->
       
    </div><!-- ./wrapper -->

    <!-- REQUIRED JS SCRIPTS -->

    <!-- jQuery 2.1.4 -->
    <script src="plugins/jQuery/jQuery-2.1.4.min.js"></script>
        <script src="js/lemayleyes.js"></script>
    <!-- Bootstrap 3.3.2 JS -->
    <script src="bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
    <!-- AdminLTE App -->
    <script src="dist/js/app.min.js" type="text/javascript"></script>
 
     <script src='plugins/fastclick/fastclick.min.js'></script>
    <script src="plugins/ckeditor/ckeditor.js"></script>
  
    <!-- Optionally, you can add Slimscroll and FastClick plugins.
          Both of these plugins are recommended to enhance the
          user experience. Slimscroll is required when using the
          fixed layout. -->
  </body>
</html>