-- Database: susaruAgroDB
CREATE DATABASE susaruAgroDB;

-- Create sequences for auto-incrementing IDs with custom prefixes
CREATE SEQUENCE visitor_id_seq START 1;
CREATE SEQUENCE customer_id_seq START 1;
CREATE SEQUENCE staff_id_seq START 1;
CREATE SEQUENCE proposal_id_seq START 1;
CREATE SEQUENCE project_id_seq START 1;
CREATE SEQUENCE inventory_id_seq START 1;
CREATE SEQUENCE payment_id_seq START 1;
CREATE SEQUENCE notification_id_seq START 1;
CREATE SEQUENCE request_id_seq START 1;
CREATE SEQUENCE customer_land_id_seq START 1;
CREATE SEQUENCE visitor_land_id_seq START 1;
CREATE SEQUENCE message_id_seq START 1;
CREATE SEQUENCE progress_id_seq START 1;

-- Table: Visitor
CREATE TABLE visitor (
    visitor_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('VIS', NEXTVAL('visitor_id_seq')),
    title VARCHAR(5),
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    phone VARCHAR(12),
    email VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Customer
CREATE TABLE customer (
    customer_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('CUS', NEXTVAL('customer_id_seq')),
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
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Role
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

-- Table: Staff
CREATE TABLE staff (
    staff_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('STF', NEXTVAL('staff_id_seq')),
    role_id INT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_no VARCHAR(10);
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE SET NULL
);

-- Table: Proposal
CREATE TABLE proposal (
    proposal_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('PRO', NEXTVAL('proposal_id_seq')),
    customer_id VARCHAR(10) NOT NULL,
    payment_mode VARCHAR(12) CHECK (payment_mode IN ('full', 'installment')),
    installment_count INT DEFAULT NULL,
    installment_amount DECIMAL(10, 2) DEFAULT NULL,
    proposal_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Table: Project
CREATE TABLE project (
    project_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('PRJ', NEXTVAL('project_id_seq')),
    staff_id VARCHAR(10),
    proposal_id VARCHAR(10),
    project_type VARCHAR(10) CHECK (project_type IN ('Agarwood', 'Sandalwood', 'Vanilla', 'Other')) DEFAULT 'Agarwood',
    status VARCHAR(10) CHECK (status IN ('Pending', 'Ongoing', 'Completed')) DEFAULT 'Pending',
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (proposal_id) REFERENCES proposal(proposal_id) ON DELETE SET NULL
);

-- Table: Inventory
CREATE TABLE inventory (
    inventory_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('INV', NEXTVAL('inventory_id_seq')),
    staff_id VARCHAR(10),
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(15) CHECK (item_type IN ('Plant', 'Fertilizer')),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- Table: Payment
CREATE TABLE payment (
    payment_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('PAY', NEXTVAL('payment_id_seq')),
    proposal_id VARCHAR(10) NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_detail TEXT NOT NULL,
    payment_receipt_url VARCHAR(255),
    FOREIGN KEY (proposal_id) REFERENCES proposal(proposal_id) ON DELETE CASCADE
);

-- Table: Notification
CREATE TABLE notification (
    notification_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('NTF', NEXTVAL('notification_id_seq')),
    customer_id VARCHAR(10),
    staff_id VARCHAR(10),
    message TEXT NOT NULL,
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

-- Table: Request
CREATE TABLE request (
    request_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('REQ', NEXTVAL('request_id_seq')),
    customer_id VARCHAR(10) NOT NULL,
    request_details TEXT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);

-- Table: Customer_Land
CREATE TABLE customer_land (
    customer_land_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('CL', NEXTVAL('customer_land_id_seq')),
    customer_id VARCHAR(10) NOT NULL,
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
    visitor_land_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('VL', NEXTVAL('visitor_land_id_seq')),
    visitor_id VARCHAR(10) NOT NULL,
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
    message_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('MSG', NEXTVAL('message_id_seq')),
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_no VARCHAR(12),
    interested_in VARCHAR(50),
    message_text TEXT NOT NULL, -- Added message content field
    status VARCHAR(20) DEFAULT 'new', -- Added status field for tracking: 'new', 'in-progress', 'completed'
    is_read BOOLEAN DEFAULT FALSE, -- Track if the message has been read by staff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX idx_message_email ON message(email);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_message_created_at ON message(created_at);

-- Table: Progress
CREATE TABLE progress (
    progress_id VARCHAR(10) PRIMARY KEY DEFAULT CONCAT('PGS', NEXTVAL('progress_id_seq')),
    project_id VARCHAR(10) NOT NULL,
    phase VARCHAR(20) NOT NULL, -- e.g., 'Phase 01', 'Phase 02'
    date DATE NOT NULL,
    topic VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
);