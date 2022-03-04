 

    ALTER TABLE users 
    ADD COLUMN gender ENUM('male','female','others'), 
    ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL;

    

