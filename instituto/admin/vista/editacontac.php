<?php
    session_start();
    if($_SESSION['acceso']<>true){
        header('Location: login.php');
    } 
    $nomusu=$_SESSION['nomusu'];
       if(isset($_SESSION['lista3'])){
        $lista3=$_SESSION['lista3'];
    }else{
        header('Location: ../controlador/controlador.php?op=5');
        
    }unset($_SESSION['lista3']);
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
             <li class="active"><a href="editacontac.php"><i class='fa fa-envelope'></i> <span>Contacto</span></a></li>
             <li><a href="docentes.php"><i class='fa fa-users'></i> <span>Plana Docente</span></a></li>
             <li><a href="lemayredes.php"><i class='fa fa-tag'></i> <span>Lema y Redes Sociales</span></a></li>
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
            <li><a href="#"><i class="fa fa-envelope"></i>Contacto</a></li>
             
          </ol>
        </section>

        <!-- Main content -->
        <section class="content">

            <div class="row">
                <div class="col-lg-6">                                 
                    <div class="box box-info">
                            <div class="box-header with-border">
                                <i class="fa fa-envelope"></i><h3 class="box-title">Actualizar Datos de Contacto</h3>
                            </div>    
                        <?php
                                            foreach ($lista3 as $row){
                        ?>
                        <form id="formcontac" class="form-horizontal" action="../controlador/valida.php" method="post">
                            <input type="hidden" name="accion" value="actcontacto">
                            <div class="box-body">
                                <div class="form-group">
                                <label  class="col-sm-2 control-label">Dirección</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" name="dire" placeholder="Dirección" value="<?php echo $row[0] ?>">
                                </div>
                                </div>
                                <div class="form-group">
                                <label  class="col-sm-2 control-label">Referencia</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" name="refe" placeholder="Referencia" value="<?php echo $row[5] ?>">
                                </div>
                                </div>
                                <div class="form-group">
                                <label  class="col-sm-2 control-label">Horario de Atención</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" name="hora" placeholder="Horario de Atención" value="<?php echo $row[6] ?>">
                                </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-sm-2 control-label">Teléfonos Fijos</label>
                                    <div class="col-sm-10">
                                        <input type="tel"   name="fijo" class="form-control"  placeholder="Teléfono" value="<?php echo $row[1] ?>">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-sm-2 control-label">RPM </label>
                                    <div class="col-sm-10">
                                        <input type="tel"  type="tel"  name="fono1" class="form-control"  placeholder="Teléfono" value="<?php echo $row[2] ?>">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="col-sm-2 control-label">RPC</label>
                                    <div class="col-sm-10">
                                        <input type="tel"type="tel" name="fono2" class="form-control"  placeholder="Teléfono" value="<?php echo $row[3] ?>">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                <label  class="col-sm-2 control-label">Email</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" name="email" placeholder="Email" value="<?php echo $row[4] ?>">
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
        <script src="js/validaciones.js"></script>
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