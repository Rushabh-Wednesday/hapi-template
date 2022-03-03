    CREATE TABLE drivers
    (
       id               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
       first_name       VARCHAR (32) NOT NULL,
       last_name        VARCHAR (32) NOT NULL,
       email            VARCHAR (32) NOT NULL UNIQUE,
       mobile_no        VARCHAR (10) NOT NULL UNIQUE,
       otp              VARCHAR (4),
       otp_generated_at DATETIME,
       current_location POINT NOT NULL ,
       cab_type_id      INT NOT NULL,
       cab_number       VARCHAR (12),
       created_at       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
       CONSTRAINT cab_type_id_fk FOREIGN KEY (cab_type_id)
       REFERENCES cab_types (id) ON UPDATE CASCADE ,
       SPATIAL INDEX (current_location),
       INDEX (cab_type_id)

    )