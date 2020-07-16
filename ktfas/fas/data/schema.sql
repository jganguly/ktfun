DROP   SCHEMA IF EXISTS fas;
CREATE SCHEMA fas;
use fas;


DROP TABLE IF EXISTS  fas.rul;  --
CREATE TABLE  fas.rul (
  rid     VARCHAR(128)        NOT NULL,
  ant     VARCHAR(1280)       NOT NULL, 
  con     VARCHAR(1280)       NOT NULL, 
  rem     VARCHAR(1280)       NOT NULL, 

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk)
);
ALTER TABLE fas.rul AUTO_INCREMENT=100001;
DESC fas.rul;


DROP TABLE IF EXISTS  fas.aut;  -- For autocomplete
CREATE TABLE  fas.aut (
  cnd     VARCHAR(256)       NOT NULL, -- atomic condition for both ant and con

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk),
  UNIQUE  (cnd)
);
ALTER TABLE fas.aut AUTO_INCREMENT=100001;
DESC fas.aut;




DROP TABLE IF EXISTS  fas.cfg;  --
CREATE TABLE  fas.cfg (
  rid     VARCHAR(128)        NOT NULL,
  att     VARCHAR(128)        NOT NULL,
  val     VARCHAR(128)        NOT NULL,

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk)
);
ALTER TABLE fas.cfg AUTO_INCREMENT=100001;
DESC fas.cfg;


DROP TABLE IF EXISTS  fas.bdg;  --
CREATE TABLE  fas.bdg (
  rid     VARCHAR(128)        NOT NULL,
  sym     VARCHAR(128)        NOT NULL,
  url     VARCHAR(128)        NOT NULL,

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk)
);
ALTER TABLE fas.bdg AUTO_INCREMENT=100001;
DESC fas.bdg;


DROP TABLE IF EXISTS  fas.dat;  --
CREATE TABLE  fas.dat (
  bid     VARCHAR(128)        NOT NULL, -- Batch ID
  att     VARCHAR(128)        NOT NULL,
  val     VARCHAR(128)        NOT NULL,

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk)
);
ALTER TABLE fas.dat AUTO_INCREMENT=100001;
DESC fas.dat;



DROP TABLE IF EXISTS  fas.out;
CREATE TABLE  fas.out (
  bid     VARCHAR(128)        NOT NULL,
  att     VARCHAR(128)        NOT NULL,
  val     VARCHAR(128)        NOT NULL,

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk),
  UNIQUE (bid,att,val)
);
ALTER TABLE fas.out AUTO_INCREMENT=100001;
DESC fas.out;


DROP TABLE IF EXISTS  fas.log;
CREATE TABLE  fas.log (
  bid     VARCHAR(128)        NOT NULL,
  rid     VARCHAR(128)        NOT NULL,
  ant     VARCHAR(1280)       NOT NULL,
  con     VARCHAR(128)        NOT NULL,
  res     VARCHAR(128)        NOT NULL, -- Result - True or False

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk),
  UNIQUE (bid,rid)
);
ALTER TABLE fas.log AUTO_INCREMENT=100001;
DESC fas.log;


DROP TABLE IF EXISTS  fas.val; -- validate
CREATE TABLE  fas.val (
  aoc     VARCHAR(128)        NOT NULL, -- ant or con
  cnd     VARCHAR(128)        NOT NULL, -- condition
  sta     VARCHAR(128)        NOT NULL, -- true or false
  typ     VARCHAR(128)        NOT NULL, -- true or false

  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk)
);
ALTER TABLE fas.val AUTO_INCREMENT=100001;
DESC fas.val;




DROP TABLE IF EXISTS  fas.usr;
CREATE TABLE  fas.usr (
  uid     VARCHAR(128)     DEFAULT '' ,
  pwd     VARCHAR(128)     DEFAULT '' ,
  rol     VARCHAR(128)     DEFAULT '' ,
 
  lup     TIMESTAMP DEFAULT   CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  pmk     INT AUTO_INCREMENT  NOT NULL,
  PRIMARY KEY (pmk)
);
ALTER TABLE fas.usr AUTO_INCREMENT=100001;
DESC fas.usr;

