<!--Un trabajo de innovatechperusac
Autor: cristians bregante
Autor email: cristians159@gmail.com
-->
<?php 
    require_once 'assets/php/controller/web.controller.php';
    $controller = new webController();
    $lista_incispp = call_user_func(array($controller,'lista_incispp'));
    $lista_UltiProgram = call_user_func(array($controller,'lista_UltiProgram'));
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      
<html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         
<html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         
<html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> 
<html class="no-js"> <!--<![endif]-->
<head>
        <!-- Meta Tags -->
        <meta charset="utf-8">
        <title>Instituto</title>
        <meta name="description" content="instituto sin nombre">
        <meta name="author" content="cristians159@gmail.com">
        <!-- Mobile Meta -->
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">
        <!-- hoja de estilos principal -->
        <link rel="stylesheet" href="style.css">
        <!-- hoja de estilos responsive -->
        <link rel="stylesheet" href="assets/css/responsive.css">
        <!-- FAV & Touch Icons -->
        <link rel="shortcut icon" href="assets/img/icons/favicon.ico">
        <link rel="apple-touch-icon" href="assets/img/icons/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="72x72" href="assets/img/icons/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="114x114" href="assets/img/icons/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="144x144" href="assets/img/icons/apple-touch-icon-144x144.png">
        <!--[if lt IE 9]>
            <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
            <script>window.html5 || document.write('<script src="assets/js/vendor/html5shiv.js"><\/script>')</script>
        <![endif]-->         
    </head>
    
    <body id="home">
    <div id="fb-root"></div>

<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.5&appId=1632194757005470";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

        <div id="entire">
            <div class="loader"></div>            
            <header id="header">
                <div class="container">
                    <div class="logo-container fl clearfix">
                        <a href="#" class="ib">
                            <img src="assets/img/logo%402x.png" class="fl" alt="Logo">
                        </a>
                    </div><!-- End Logo Container -->
                    <nav class="main-navigation fr">
                        <ul class="clearfix">
                            <li class="parent-item haschild current_page_item">
                                <a href="" class="ln-tr">Inicio</a>
                            </li>
                            <li class="parent-item haschild">
                                <a href="#Nosotros" class="ln-tr">Nosotros</a>
                            </li>
                            <li class="parent-item haschild courses-menu">
                                <a href="" class="ln-tr">Programas</a>  
                                <ul class="submenu">
                                    <li class="sub-item"><a href="#Cursos" class="ln-tr">Cursos</a></li>
                                    <li class="sub-item"><a href="" class="ln-tr">Diplomados</a></li>
                                    <li class="sub-item"><a href="" class="ln-tr">Seminarios y Conferencias</a></li>
                                    <li class="sub-item"><a href="" class="ln-tr">Cursos Virtuales</a></li>
                                </ul>                              
                            </li>
                            <li class="parent-item haschild">
                                <a href="#Docente" class="ln-tr">Plana Docente</a>
                            </li>  
                            <li class="parent-item haschild">
                                <a href="#Publicaciones" class="ln-tr">Publicaciones</a>
                            </li>  
                            <li class="parent-item haschild">
                                <a href="" class="ln-tr">Campus Virtual</a>
                            </li>
                            <li class="parent-item haschild">
                                <a href="" class="ln-tr">Contáctenos</a>
                            </li>                                                                                  
                        </ul>
                    </nav><!-- End NAV Container -->
                    <div class="mobile-navigation fr">
                        <a href="#" class="mobile-btn"><span></span></a>
                        <div class="mobile-container"></div>
                    </div><!-- end mobile navigation -->
                </div>
            </header><!-- End Main Header Container -->

            <!-- SLIDER -->
            <?php include("assets/php/layout/slider.php"); ?>
            <!-- SLIDER/-->
            <div class="clearfix"></div>

            <div class="course-search">
                <div class="container">
                    <form action="http://7oroof.com/tfdemos/coursaty/10-courses-grid-1.html" id="course-search-form" class="clearfix wachito">
                        <div class="select-time ib">
                            Introduce tu email y serás uno de los primeros en obtener nuevas actualizaciones:
                        </div>
                        <input type="text" name="course-name" id="course-name" placeholder="Email">
                        <input type="submit" name="search-btn" id="search-btn" class="grad-btn ln-tr bntsuscrip" value="Enviar">
                    </form><!-- End Sourse Search Form -->
                </div>
            </div><!-- End Course Container -->

            <div class="clearfix"></div>

            <section class="full-section latest-courses-section chichico">
                <div class="container" id="Cursos">
                    <h3 class="section-title">Nuestros Últimos Cursos</h3>
                    <p class="section-description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing condimentum tristique vel, eleifend sed turpis. Pellentesque cursus arcu id magna euismod in elementum purus molestie
                    </p><!-- End Section Description -->
                </div>
                <div class="section-content latest-courses-content fadeInDown-animation">
                    <div class="container">
                        <div class="row">
                            <div id="courses-slider" class="flexslider">
                                <ul class="slides">
                                <?php foreach ($lista_UltiProgram as $row) { ?>
                                    <li class="course-slide-item clearfix">
                                        <div class="col-md-12">                                        
                                            <div class="course">
                                                <div class="featured-badge"><span>Nuevo</span></div>
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <?php if(date::date_format('')) ?>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div><!-- End Course Overlay -->
                                                    <img src="admin/programas/<?php echo $row->img; ?>" class="img-responsive" alt="Nuevo Programa de Estudio">                                                    
                                                </div><!-- End Course Image -->
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr"><?php echo $row->nombre ?></a></h3>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>                                                        
                                                    </div>
                                                </div>
                                            </div><!-- End Course -->
                                        </div><!-- End col-md-12 -->
                                    </li><!-- End 1st Slide -->
                                <?php } ?>
                                    <!-- <li class="course-slide-item clearfix">
                                        <div class="col-md-12">
                                            <div class="course">
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div>
                                                    <img src="assets/img/content/course-slider-img-2-270x178.jpg" class="img-responsive" alt="">
                                                </div>
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr">Course Name Here</a></h3>
                                                    <p class="course-description">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                                    </p>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> --><!-- End 2nd Slide -->
                                    <!-- <li class="course-slide-item clearfix">
                                        <div class="col-md-12">
                                            <div class="course">
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div>
                                                    <img src="assets/img/content/course-slider-img-3-270x178.jpg" class="img-responsive" alt="">
                                                </div>
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr">Course Name Here</a></h3>
                                                    <p class="course-description">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                                    </p>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> --><!-- End 3rd Slide -->
                                    <!-- <li class="course-slide-item clearfix">
                                        <div class="col-md-12">
                                            <div class="course">
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div>
                                                    <img src="assets/img/content/course-slider-img-4-270x178.jpg" class="img-responsive" alt="">
                                                </div>
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr">Course Name Here</a></h3>
                                                    <p class="course-description">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                                    </p>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> --><!-- End 4th Slide -->
                                    <!-- <li class="course-slide-item clearfix">
                                        <div class="col-md-12">
                                            <div class="course">
                                                <div class="featured-badge"><span>especial</span></div>
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div>
                                                    <img src="assets/img/content/course-slider-img-2-270x178.jpg" class="img-responsive" alt="">
                                                </div>
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr">Course Name Here</a></h3>
                                                    <p class="course-description">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                                    </p>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> --><!-- End 5th Slide -->
                                    <!-- <li class="course-slide-item clearfix">
                                        <div class="col-md-12">
                                            <div class="course">
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div>
                                                    <img src="assets/img/content/course-slider-img-3-270x178.jpg" class="img-responsive" alt="">
                                                </div>
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr">Course Name Here</a></h3>
                                                    <p class="course-description">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                                    </p>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> --><!-- End 6th Slide -->
                                    <!-- <li class="course-slide-item clearfix">
                                        <div class="col-md-12">
                                            <div class="course">
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div>
                                                    <img src="assets/img/content/course-slider-img-4-270x178.jpg" class="img-responsive" alt="">
                                                </div>
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr">Course Name Here</a></h3>
                                                    <p class="course-description">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                                    </p>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> --><!-- End 7th Slide -->
                                    <!-- <li class="course-slide-item clearfix">
                                        <div class="col-md-12">
                                            <div class="course">
                                                <div class="course-image">
                                                    <div class="details-overlay">
                                                        <span class="place">
                                                            <i class="fa fa-map-marker"></i>
                                                            <span class="text">Place : Alexandria, Miami</span>
                                                        </span>
                                                        <span class="time">
                                                            <i class="fa fa-clock-o"></i>
                                                            <span class="text">Time : 7 Dec, 2015</span>
                                                        </span>
                                                    </div>
                                                    <img src="assets/img/content/course-slider-img-1-270x178.jpg" class="img-responsive" alt="">
                                                </div>
                                                <div class="course-info">
                                                    <h3 class="course-title"><a href="" class="ln-tr">Course Name Here</a></h3>
                                                    <p class="course-description">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                                    </p>
                                                    <div class="buttons">
                                                        <a href="" style="margin-right:0px;" class="btn grad-btn orange-btn read-btn">Ver Más</a>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li> --><!-- End 8th Slide -->

                                </ul><!-- End ul Items -->
                            </div><!-- End Courses Slider -->
                        </div><!-- End 1st row -->
                        <div class="clearfix"></div>
                        <!-- <div class="row">
                            <div class="col-md-12">
                                <div class="add-courses">
                                    <img src="assets/img/icons/addcourse-icon.png" alt="" class="fl add-courses-icon">
                                    <a href="#" class="add-courses-title ln-tr">You Are an Instructor ? Add Your Courses Now !</a>
                                    <p class="add-courses-description">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing condimentum tristique vel, eleifend sed turpis. Pellentesque cursus arcu id magna euismod in elementum purus molestie.
                                    </p>
                                </div><!-- End Add Courses -->
                            </div>
                        </div><!-- End 2nd row --> 
                    </div><!-- End Container -->
                </div><!-- End Latest-Courses Section Content -->
            </section><!-- End Courses Section -->

            <div class="clearfix"></div>

            <section class="full-section instructors-section fancy-shadow">
                <div class="container">
                    <h3 class="section-title">Bienvenidos a </h3>
                    <p class="section-description">
                    <?php foreach ($lista_incispp as $row) { ?>
                        <?php echo $row->cuerpo ?>
                    <?php } ?>
                        <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing condimentum tristique vel, eleifend sed turpis. Pellentesque cursus arcu id magna euismod in elementum purus molestie. -->
                    </p><!-- End Section Description -->
                </div>
                <div class="section-content features-content fadeInDown-animation">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-4 col-xs-6">
                                <div class="feature-box">
                                    <div class="icon"><img src="assets/img/icons/feature-icon-1.png" class="es-tr" alt=""></div><!-- End Icon -->
                                    <h5 class="feature-title">Publicaciones</h5>
                                    <p class="feature-description">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                    </p>
                                </div><!-- End Features Box -->
                            </div>
                            <!-- <div class="col-md-3 col-xs-6">
                                <div class="feature-box">
                                <div class="icon"><img src="assets/img/icons/feature-icon-2.png" class="es-tr" alt=""></div>
                                    <h5 class="feature-title">Talk to Our Instructors</h5>
                                    <p class="feature-description">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                    </p>
                                </div>
                            </div> -->
                            <div class="col-md-4 col-xs-6">
                                <div class="feature-box">
                                    <div class="icon"><img src="assets/img/icons/feature-icon-3.png" class="es-tr" alt=""></div><!-- End Icon -->
                                    <h5 class="feature-title">Multimedia </h5>
                                    <p class="feature-description">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                    </p>
                                </div><!-- End Features Box -->
                            </div>
                            <div class="col-md-4 col-xs-6">
                                <div class="feature-box">
                                    <div class="icon"><img src="assets/img/icons/feature-icon-4.png" class="es-tr" alt=""></div><!-- End Icon -->
                                    <h5 class="feature-title">Campus Virtual</h5>
                                    <p class="feature-description">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lorem quam, adipiscing.
                                    </p>
                                </div><!-- End Features Box -->
                            </div>
                        </div>
                    </div>
                </div><!-- End Features Section Content -->                
            </section><!-- End Our Instructors Container -->


            

            <div class="clearfix"></div>

            <section class="full-section categories-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 basic-slider-box">
                            <div class="blog-posts">
                                <h6 class="head-title">Informese de Novedades</h6>
                                <div class="basic-slider flexslider">
                                    <div class="fb-page" data-href="https://www.facebook.com/EscuelaNacionalESEG/" data-width="500" data-height="350"  data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-show-posts="true"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/EscuelaNacionalESEG/"><a href="https://www.facebook.com/EscuelaNacionalESEG/">Escuela Nacional de Estudios Gubernamentales ESEG</a></blockquote></div></div>
                                </div><!-- End Posts Slider -->
                            </div><!-- End Blog Posts/Latest News -->
                        </div><!-- End col-md-6 -->
                        <div class="col-md-6">
                            <h6 class="head-title">¿Por qué nosotros?</h6>
                            <div id="accordion-container" class="accordion">
                                <h4 class="accordion-header ln-tr">¿Quiénes somos?</h4> 
                                <div class="accordion-content"> 
                                    <p>
                                        Duis dapibus aliquam mi, eget euismod scelerisque ut. Vivamus at elit quis urna adipiscing , Curabitur vitae velit in neque dictum blandit. Duis dapibus aliquam mi, eget euismod sceler ut, Duis dapibus aliquam mi, eget euismod scelerisque at elit quis urna adipiscing.
                                    </p>
                                </div><!-- End 1st Item -->
                                <h4 class="accordion-header ln-tr">¿Por qué estudiar con ?</h4> 
                                <div class="accordion-content"> 
                                    <p>
                                        Duis dapibus aliquam mi, eget euismod scelerisque ut. Vivamus at elit quis urna adipiscing , Curabitur vitae velit in neque dictum blandit. Duis dapibus aliquam mi, eget euismod sceler ut, Duis dapibus aliquam mi, eget euismod scelerisque at elit quis urna adipiscing.
                                    </p>
                                </div><!-- End 2nd Item -->
                                <h4 class="accordion-header ln-tr">¿Cuáles son nuestras características?</h4> 
                                <div class="accordion-content"> 
                                    <p>
                                        Duis dapibus aliquam mi, eget euismod scelerisque ut. Vivamus at elit quis urna adipiscing , Curabitur vitae velit in neque dictum blandit. Duis dapibus aliquam mi, eget euismod sceler ut, Duis dapibus aliquam mi, eget euismod scelerisque at elit quis urna adipiscing.
                                    </p>
                                </div><!-- End 3rd Item -->
                            </div><!-- End Accordion Container -->
                        </div><!-- End col-md-6 -->
                    </div><!-- End row -->
                </div><!-- End container -->
                <div class="container our-clients">
                    <h6 class="head-title">Enlaces de Interés</h6>
                    <div class="row">
                        <div id="clients-slider" class="flexslider">
                            <ul class="slides clearfix">
                                <li class="clients-slide-item">
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-1-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-2-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-3-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-4-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-5-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-6-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                </li><!-- End 1st Slide Item -->
                                <li class="clients-slide-item">
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-1-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-2-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-3-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-4-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-5-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                    <div class="col-md-2 col-xs-4">
                                        <div class="client"><a href="#"><img src="assets/img/content/client-img-6-170x68.jpg" alt=""></a></div><!-- End Client -->
                                    </div>
                                </li><!-- End 2nd Slide Item -->
                            </ul><!-- End ul Items -->
                        </div><!-- End Clients Slider -->
                    </div><!-- End row -->
                </div><!-- End Our Clients -->
            </section><!-- End Categories Section -->

          

            <div class="clearfix"></div>

            <?php include("assets/php/layout/footer.php"); ?>
        </div><!-- End Entire Wrap -->
        <!-- jQuery -->
        <script src="assets/js/vendor/jquery-1.11.2.min.js"></script> 
        <!-- Plugins -->
        <script src="assets/js/bsmodal.min.js"></script>
        <script src="assets/js/jquery.countdown.min.js"></script>
        <script src="assets/js/jquery.easydropdown.min.js"></script>
        <script src="assets/js/jquery.flexslider-min.js"></script>
        <script src="assets/js/jquery.isotope.min.js"></script>
        <script src="assets/js/jquery.themepunch.tools.min.js"></script>
        <script src="assets/js/jquery.themepunch.revolution.min.js"></script>
        <script src="assets/js/jquery.viewportchecker.min.js"></script>
        <script src="assets/js/jquery.waypoints.min.js"></script>
        <script src="assets/js/scripts.js"></script>
        <script src="assets/js/docs.js"></script>
    </body>
</html>