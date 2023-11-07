CREATE DATABASE testdb;
CREATE TABLE testdb.`user`(
    id INT auto_increment PRIMARY KEY NOT NULL,
    name varchar(100) NOT NULL
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_general_ci;

CREATE TABLE testdb.`acl`(
    id INT auto_increment PRIMARY KEY NOT NULL,
    model varchar(255) NOT NULL,
    method varchar(255) NOT NULL,
    type ENUM('role', 'user') DEFAULT 'role' NOT NULL,
    name varchar(255) NOT NULL
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_general_ci;

CREATE TABLE testdb.`role`(
    id INT auto_increment PRIMARY KEY NOT NULL,
    name varchar(255) NOT NULL
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_general_ci;

CREATE TABLE testdb.`roleInherit` (
    roleId INT NOT NULL,
    roleInheritId INT NOT NULL,
    PRIMARY KEY(roleId, roleInheritId),
    FOREIGN KEY (roleId) REFERENCES role(id),
    FOREIGN KEY (roleInheritId) REFERENCES role(id)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_general_ci;