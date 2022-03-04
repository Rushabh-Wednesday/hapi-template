    CREATE TABLE bookings 
     (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        driver_id INT NOT NULL,
        booking_attempt_id INT NOT NULL UNIQUE,
        CONSTRAINT fk_driver_id FOREIGN KEY (driver_id)
        REFERENCES drivers (id),
        CONSTRAINT booking_attempt_id FOREIGN KEY (booking_attempt_id)
        REFERENCES booking_attempts (id) 
     )