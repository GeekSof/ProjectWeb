
create database incispp2;

use incispp2;

create table usuario(
codusu char(3) primary key not null,
nomusu varchar(50) not null,
rol char(1) default 'A' unique not null,
usuar varchar(20) not null,
pass varchar(20) not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


insert into usuario (codusu,nomusu,usuar,pass) values ('ad1','Richard Loarte ','admin123@gmail.com','admin123');
select * from usuario;

create table incispp(
cuerpo MEDIUMTEXT not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into incispp values('lol');

create table departamentos(
coddepa char(4) primary key not null,
nombre varchar(50)  not null,
estado char(2) not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into departamentos values ('de01','CIENCIAS POLÃTICAS Y ADMINISTRATIVAS ','A');
insert into departamentos values ('de02','CIENCIAS JURÃDICAS','A');
insert into departamentos values ('de03','CIENCIAS SOCIALES','A');

create table programa(
codpro char(5) primary key not null,
nombre varchar(500)  not null,
estado char(2) not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into programa values('pr001','DIPLOMADOS','A');
insert into programa values('pr002','CURSOS','A');
insert into programa values('pr003','SEMINARIOS Y CONFERECNIAS','A');
insert into programa values('pr004','CONGRESOS','A');	
insert into programa values('pr005','Cursos Virtuales','A');
insert into programa values('pr006','IN HOUSE','A');


create table cadaprogra(
codcada char(5) primary key not null,
nombre varchar(200) not null,
contenido mediumtext not null,
contenido2 mediumtext not null,
contenido3 mediumtext not null,
codpro char(5) not null,
coddepa char(5)  not null,
estado char(2) default 'A' not null,
img varchar(20) not null,
img2 varchar(20) not null,
fechain  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
foreign key(codpro) references programa(codpro),
foreign key(coddepa) references departamentos(coddepa)
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into cadaprogra (codcada,nombre,contenido,contenido2,contenido3,codpro,coddepa,img,img2) values
('cp001','GESTIÃ“N PÃšBLICA','lolllll','lolllll','lolllll','pr001','de03','cp001.jpg','cp001b.jpg');
insert into cadaprogra (codcada,nombre,contenido,contenido2,contenido3,codpro,coddepa,img,img2) values
('cp002','CONTRATACIONES DEL ESTADO','lolllll2','lolllll','lolllll','pr001','de01','cp002.jpg','cp002b.jpg');
 

create table contacto(
direccion varchar(500) not null,
fijo varchar(100) not null,
rpm varchar(12) not null,
rpc varchar(12) not null,
email varchar(100) not null,
refe varchar(500) not null,
hora varchar(200) not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into contacto
values('Jr. Lampa 1115. Of 802 - Cercado de Lima Lima Perú','4264254 / 6733023','#971327348','941393977','informes@incispp.edu.pe');



create table lema(
lemma mediumtext
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into lema values ('sd');	



create table docentes(
coddoce char(5) primary key not null,
nomdoce varchar(100) not null,
texto mediumtext not null,
foto varchar(50) not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into docentes values('dc001','lol','sdsadsadsad','dc001.jpg');


create table anuncio(
cuerpo mediumtext not null,
estado char(1) not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into anuncio values ('asdsadsadsadsadssad','A');

create table investigacion(
codin char(5) primary key not null,
titulo varchar(100) not null,
cuerpo mediumtext not null,
fecha  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
foto varchar(50) not null
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


/* ultimos cambios */
/* agregar en registro Cursos Virtuales a la tabla programa*/
create table redes(
twiter mediumtext,
google mediumtext,
face mediumtext,
youtu mediumtext,
linken mediumtext,
blog mediumtext
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into redes values ('sd','sad','sad','sad','sad','sad');	


create table album(
codalb char(5) primary key not null,
nombre varchar(100) not null,
foto char(10) not null,
fecha  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into album (codalb,nombre,foto)values ('al001','Album de prueba','al001.jpg');





create table detalbum(
codm char(5) primary key not null,
nombre varchar(100) not null,
tipo varchar(5) not null,
enlace varchar(50) not null,
codalb char(5) not null,
foreign key(codalb) references album(codalb)
)DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

insert into detalbum values('da001','Foto1','F','da001.jpg','al001');
insert into detalbum values('da002','Video1','V','etAIpkdhU9Q','al001');





incispp