CREATE TABLE driver_location
 (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL ,
    current_location GEOMETRY NOT NULL,
    status ENUM ('active','inactive'),
    SPATIAL INDEX (current_location),
    CONSTRAINT driver_id_fk FOREIGN KEY (driver_id)
    REFERENCES drivers (id)
 )