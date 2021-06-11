CREATE TABLE opentutorials.`author` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    `profile` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`id`)
);


INSERT INTO opentutorials.`author` VALUES (1,'egoing','developer');
INSERT INTO opentutorials.`author` VALUES (2,'duru','database administrator');
INSERT INTO opentutorials.`author` VALUES (3,'taeho','data scientist, developer');


CREATE TABLE opentutorials.`topic` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(30) NOT NULL,
    `description` text,
    `created` datetime NOT NULL,
    `author_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO opentutorials.`topic` VALUES (1,'MySQL','MySQL is...','2018-01-01 12:10:11',1);
INSERT INTO opentutorials.`topic` VALUES (2,'Oracle','Oracle is ...','2018-01-03 13:01:10',1);
INSERT INTO opentutorials.`topic` VALUES (3,'SQL Server','SQL Server is ...','2018-01-20 11:01:10',2);
INSERT INTO opentutorials.`topic` VALUES (4,'PostgreSQL','PostgreSQL is ...','2018-01-23 01:03:03',3);
INSERT INTO opentutorials.`topic` VALUES (5,'MongoDB','MongoDB is ...','2018-01-30 12:31:03',1);

