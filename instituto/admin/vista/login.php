<?php
    session_start();
    if(isset($_SESSION['acceso'])){
        header('Location: vista/index.php');
    }
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>INCISPP | Log in</title>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <!-- Bootstrap 3.3.4 -->
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- Font Awesome Icons -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <!-- Theme style -->
    <link href="dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />
    <!-- iCheck -->
    <link rel="shortcut icon" href="../../vista/assets/ico/logo.ico">
    <link href="plugins/iCheck/square/blue.css" rel="stylesheet" type="text/css" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
     <style>
      .saludo{
		width: 100%;
	height: 100%;
	 
	position: fixed;
	background-color: #F3F3F3;
	top: 0;
	left: 0;
 
        z-index: 100;
	}
  .gif{
		width: 60px;
		margin: 0 auto;
	}
	.saludo .uno{
		width: 500px;
		height: 233px;
 		 margin: 18% auto 0;
	}
     
	.saludo .dos{
             
		width: 60px;
 		 margin: 5% auto;
	}
	.img{
		width: 500px;
	}
	 .p{
            width: 180px;  
            padding-left: 30%;
        }
        .contlo2 {
 
  
  width: 515px;
  margin: 0 auto;
   
 
  margin-top: 200px;
}
.contmsg{
    width: 100%;
    
    height: 10px;
}
.msg{
    width: 150px;
    margin: 0 auto;
    padding-top: 15px;
    height: 10px;
    color:red;
    font-size: 14px;
   
}
  </style>
  </head>
 
  <body class="login-page">
    <div class="login-box">
      <div class="login-logo">
          <a href="../../vista/index.php"><img src="../../assets/img/logo.png"></a>
      </div><!-- /.login-logo -->
      <div class="login-box-body">
        <p class="login-box-msg">Iniciar Sesión </p>
        <form autocomplete="on" action="../controlador/controlador.php" method="post">
          <div class="form-group has-feedback">
            <input name="username" type="email" class="form-control" placeholder="Email"/>
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input name="password" type="password" class="form-control" placeholder="Password"/>
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="row">
            <div class="col-xs-8">    
                                      
            </div><!-- /.col -->
              <div class="col-xs-8">    
                  <?php
        if(isset($_SESSION['msg'])){
    ?>
    <p class="msg">
        <?php echo $_SESSION['msg'];?>
</p>
    <?php } 
    ?>                      
            </div>
      
            <div class="col-xs-4">
                
              <button type="submit" class="btn btn-primary btn-block btn-flat">Ingresar</button>
            </div><!-- /.col -->
          </div>
            <input type="hidden" name="op" value="1">
        </form>

      

         
      </div><!-- /.login-box-body -->
    </div><!-- /.login-box -->

 <p class="contlo2">Desarrollado Por <a target="_black" href="http://www.innovatechperusac.com/">INNOVATECHPERÚ</a>.  Copyright © 2015, Todos Los Derechos Reservados
</p>
 <div class="saludo">
    <div class="uno">
      <img class="img" src="../../assets/img/logo-inverted.png">    
    </div>
       
     
    <div class="dos">

    <img class="gif" src="../../assets/img/loading.gif" alt="">
    </div>
</div>
    <!-- jQuery 2.1.4 -->
    <script src="plugins/jQuery/jQuery-2.1.4.min.js"></script>
    <!-- Bootstrap 3.3.2 JS -->
    <script src="bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
    <!-- iCheck -->
    <script src="plugins/iCheck/icheck.min.js" type="text/javascript"></script>
    
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    setTimeout(function() {
        $(".saludo").fadeOut(1500);
    },1000);

});
</script>
  </body>
</html>