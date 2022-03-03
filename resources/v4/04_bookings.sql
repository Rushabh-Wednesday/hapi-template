    CREATE TABLE booking
    (
        id              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id         INT NOT NULL ,
        driver_id       INT, 
        pickup_location POINT NOT NULL,
        drop_location   POINT NOT NULL,
        ride_status     ENUM ('pending','accepted','completed','cancelled'),
        fare            INT NOT NULL,
        created_at       DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT user_id_fk FOREIGN KEY (user_id)
        REFERENCES users (id),
        CONSTRAINT driver_id_fk FOREIGN KEY (driver_id)
        REFERENCES drivers (id),
        INDEX (user_id),
        INDEX (driver_id)

    )