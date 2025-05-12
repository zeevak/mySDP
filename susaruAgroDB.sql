-- Database: susaruAgroDB
CREATE DATABASE susaruAgroDB;

-- Table: Visitor
CREATE TABLE visitor (
    visitor_id SERIAL PRIMARY KEY,
    title VARCHAR(5),
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    phone VARCHAR(12),
    email VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Customer
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    title VARCHAR(5),
    name_with_ini VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    nic_number VARCHAR(12),
    add_line_1 TEXT,
    add_line_2 TEXT,
    add_line_3 TEXT,
    city VARCHAR(50),
    district VARCHAR(50),
    province VARCHAR(50),
    phone_no_1 VARCHAR(12),
    phone_no_2 VARCHAR(12),
    email VARCHAR(255) UNIQUE NOT NULL,
    health_info TEXT,
    password_hash VARCHAR(255) NOT NULL
);

-- Table: Role
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

-- Table: Staff
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    role_id INT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE SET NULL
);

-- Table: Project
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    staff_id INT,
    project_type VARCHAR(8) CHECK (project_type IN ('Agarwood', 'Other')) DEFAULT 'Agarwood',
    area_marked TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- Table: Proposal
CREATE TABLE proposal (
    proposal_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    payment_mode VARCHAR(12) CHECK (payment_mode IN ('full', 'installment')),
    installment_count INT DEFAULT NULL,
    installment_amount DECIMAL(10, 2) DEFAULT NULL,
    beneficiaries TEXT,
    contract_signed BOOLEAN DEFAULT FALSE,
    proposal_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Table: Inventory
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    staff_id INT,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(15) CHECK (item_type IN ('Plant', 'Fertilizer')),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- Table: Payment
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    proposal_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_detail TEXT NOT NULL,
    payment_receipt_url VARCHAR(255),
    FOREIGN KEY (proposal_id) REFERENCES proposal(proposal_id) ON DELETE CASCADE
);

-- Table: Notification
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    customer_id INT,
    staff_id INT,
    message TEXT NOT NULL,
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- Table: Request
CREATE TABLE request (
    request_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    request_details TEXT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Table: Customer_Land
CREATE TABLE customer_land (
    customer_land_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    province VARCHAR(50),
    district VARCHAR(50),
    city VARCHAR(50),
    climate_zone VARCHAR(50),
    land_shape VARCHAR(50),
    has_water BOOLEAN,
    soil_type VARCHAR(50),
    has_stones BOOLEAN,
    has_landslide_risk BOOLEAN,
    has_forestry BOOLEAN,
    land_size DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Table: Visitor_Land
CREATE TABLE visitor_land (
    visitor_land_id SERIAL PRIMARY KEY,
    visitor_id INT NOT NULL,
    province VARCHAR(50),
    district VARCHAR(50),
    city VARCHAR(50),
    climate_zone VARCHAR(50),
    land_shape VARCHAR(50),
    has_water BOOLEAN,
    soil_type VARCHAR(50),
    has_stones BOOLEAN,
    has_landslide_risk BOOLEAN,
    has_forestry BOOLEAN,
    land_size DECIMAL(10, 2),
    FOREIGN KEY (visitor_id) REFERENCES visitor(visitor_id) ON DELETE CASCADE
);

-- Table: Message
CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_no VARCHAR(12),
    interested_in TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO role (role_name) VALUES ('Admin');
INSERT INTO role (role_name) VALUES ('Manager');
INSERT INTO role (role_name) VALUES ('Staff');

-- Insert default admin user
INSERT INTO staff (role_id, name, username, password_hash, email)
VALUES (
    1,
    'Admin User',
    'admin',
    '$2b$10$1xyNu3r7FO7g5WBQhnIG6.jjD.nY1kshfnhrL2la56qPePhMI6f6y', -- password: admin123
    'admin@susaruagro.com'
);