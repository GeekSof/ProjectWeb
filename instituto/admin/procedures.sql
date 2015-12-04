/*Procedimientos*/

create procedure LogeUsu(usua varchar(50), pas varchar(20))
select * from usuario where usuar=usua and pass=pas;

create procedure editaincispp(
cuer mediumtext
)update incispp set cuerpo=cuer;


create procedure lista()
select * from incispp;

call lista()

create procedure allprogra()
select * from cadaprogra;

call listcadapro()

call allprogra

DELIMITER $$
 create PROCEDURE nuevoproga(	
 nom varchar(100),
 conte mediumtext,
 conte2 mediumtext,
 conte3 mediumtext,
 codp char(5),
 codd char(5)
 )	
        BEGIN
        DECLARE co CHAR(5);
        DECLARE foto varchar(20);
        DECLARE foto2 varchar(20);
            SET co = (select concat('cp',right(concat('00',right(IFNULL(max(codcada),'00'),2)+1),3)) AS COD from cadaprogra);
            SET foto =(select concat('cp',right(concat('00',right(IFNULL(max(codcada),'00'),2)+1),3),'.jpg') AS img from cadaprogra);
            SET foto2 =(select concat('cp',right(concat('00',right(IFNULL(max(codcada),'00'),2)+1),3),'b.jpg') AS img from cadaprogra);
          insert into cadaprogra (codcada,nombre,contenido,contenido2,contenido3,codpro,coddepa,img,img2)
			  values(co,nom,conte,conte2,conte3,codp,codd,foto,foto2);
           	select co,foto,foto2;
        END $$
DELIMITER;

CALL nuevoproga('planeamiento estrategico','sad','sad','sad','pr001','de03');

create procedure editaprograma(
cod char(5),
nom varchar(200),
cont1 mediumtext,
cont2 mediumtext,
cont3 mediumtext
)update cadaprogra set nombre=nom, contenido=cont1, contenido2=cont2, contenido3=cont3
where codcada=cod;


create procedure detaprogra(
cod char(5)
)select * from cadaprogra where codcada=cod;

create procedure listcadapro()
select * from cadaprogra order by fechain desc limit 6;





create procedure programas(
codp char(5)
)select * from cadaprogra where codpro=codp;


 


create procedure borraprograma(
cod char(5)
)delete from cadaprogra where codcada=cod;


create procedure editacontacto(
dire varchar(500),
fij varchar(100),
pm varchar(12),
pc varchar(12),
mail varchar(100),
ref varchar(500),
hor varchar(200)
)update contacto set direccion=dire, fijo=fij, rpm=pm, rpc=pc, email=mail, refe=ref, hora=hor;

call editacontacto ('Jr. Lampa 1115. Of 802 - Cercado de Lima Lima Perú','4264254 / 6733023','#971327348','941393977','informes@incispp.edu.pe');

create procedure listacontacto()
select * from contacto;


create procedure editalema(
lem mediumtext
)update lema set lemma=lem;

create procedure lislema()
select * from lema;


DELIMITER $$
create PROCEDURE newdocente(	
nom varchar(100),
tex mediumtext
 )	
        BEGIN
        DECLARE co CHAR(5);
        DECLARE fot varchar(20);
            SET co = (select concat('dc',right(concat('00',right(IFNULL(max(coddoce),'00'),2)+1),3)) AS COD from docentes);
            SET fot =(select concat('dc',right(concat('00',right(IFNULL(max(coddoce),'00'),2)+1),3),'.jpg') AS img from docentes);
          insert into docentes (coddoce,nomdoce,texto,foto)
			  values(co,nom,tex,fot);
           	select co,fot;
        END $$
DELIMITER;

create procedure borradocente(
cod char(5)
)delete from docentes where coddoce=cod;

create procedure listdocente()
select * from docentes;


create procedure editaperfil(
nom varchar(50),
usu varchar(20),
pas varchar(20)
)update usuario set nomusu=nom, usuar=usu, pass=pas;

create procedure lisperfil()
select * from usuario;


create procedure editaanuncio(
cue mediumtext
)update anuncio set cuerpo=cue;

create procedure actdesanuncio(
est char(1)
)update anuncio set estado=est;

create procedure lisanuncuio()
select * from anuncio;


DELIMITER $$
create PROCEDURE newinvest(	
titu varchar(100),
cuer mediumtext
 )	
        BEGIN
        DECLARE co CHAR(5);
        DECLARE fot varchar(20);
            SET co = (select concat('in',right(concat('00',right(IFNULL(max(codin),'00'),2)+1),3)) AS COD from investigacion);
            SET fot =(select concat('in',right(concat('00',right(IFNULL(max(codin),'00'),2)+1),3),'.jpg') AS img from investigacion);
          insert into investigacion (codin,titulo,cuerpo,foto)
			  values(co,titu,cuer,fot);
           	select co,fot;
        END $$
DELIMITER;




create procedure editainvesti(
cod char(5),
titu varchar(100),
cuer mediumtext
)update investigacion set  titulo=titu, cuerpo=cuer where codin=cod;

create procedure borrainvest(
cod char(5)
)delete from investigacion where codin=cod;

create procedure listinvesti()
select * from investigacion;

create procedure detinvestiga(
cod char(5)
)select * from investigacion where codin=cod;

call detinvestiga('in001');


/* ultimos cambios */

create procedure editaredes(
tw mediumtext,
go mediumtext,
fa mediumtext,
yo mediumtext,
li mediumtext,
bg mediumtext
)update redes set twiter=tw, google=go, face=fa,youtu=yo,linken=li, blog=bg;

create procedure lisredes()
select * from redes;

create procedure listalbum()
select * from album;

DELIMITER $$
create PROCEDURE newalbum(	
nom varchar(100)
 )	
        BEGIN
        DECLARE co CHAR(5);
        DECLARE fot varchar(10);
            SET co = (select concat('al',right(concat('00',right(IFNULL(max(codalb),'00'),2)+1),3)) AS COD from album);
            SET fot =(select concat('al',right(concat('00',right(IFNULL(max(codalb),'00'),2)+1),3),'.jpg') AS img from album);
          insert into album (codalb,nombre,foto)
			  values(co,nom,fot);
           	select co,fot;
        END $$
DELIMITER;

create procedure borraalbum(
cod char(5)
)delete from album where codalb=cod;



create procedure listafotos(
calb char(5)
)
select * from detalbum where tipo='F' and codalb=calb;

create procedure listavideos(
calb char(5)
)
select * from detalbum where tipo='V' and codalb=calb;

DELIMITER $$
create PROCEDURE newfoto(	
nom varchar(100),
calb char(5)
)	
        BEGIN
        DECLARE co CHAR(5);
        DECLARE enl varchar(50);
            SET co = (select concat('da',right(concat('00',right(IFNULL(max(codm),'00'),2)+1),3)) AS COD from detalbum);
            SET enl =(select concat('da',right(concat('00',right(IFNULL(max(codm),'00'),2)+1),3),'.jpg') AS img from detalbum);
          insert into detalbum (codm,nombre,tipo,enlace,codalb)
			  values(co,nom,'F',enl,calb);
           	select co,enl;
        END $$
DELIMITER;



DELIMITER $$
create PROCEDURE newvideo(	
nom varchar(100),
enl varchar(50),
calb char(5)		
)	
        BEGIN
        DECLARE co CHAR(5);
            SET co = (select concat('da',right(concat('00',right(IFNULL(max(codm),'00'),2)+1),3)) AS COD from detalbum);
          insert into detalbum (codm,nombre,tipo,enlace,codalb)
			  values(co,nom,'V',enl,calb);
        END $$
DELIMITER;

create procedure borradetalb(
cod char(5)
)delete from detalbum where codm=cod;
