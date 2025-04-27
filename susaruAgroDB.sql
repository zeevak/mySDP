-- Database: susaruAgroDB
-- CREATE DATABASE susaruAgro;
-- \c susaruAgro;

-- Table: Visitor
CREATE TABLE Visitor (
    visitor_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(255) UNIQUE,
    land_size DECIMAL(10, 2),
    land_location VARCHAR(255),
    soil_type VARCHAR(50),
    geo_type VARCHAR(50),
    climate VARCHAR(50),
    eligibility_status BOOLEAN DEFAULT NULL,
    eligibility_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Customer
CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    address TEXT,
    province VARCHAR(50),
    district VARCHAR(50),
    city VARCHAR(50),
    nic_number VARCHAR(12),
    date_of_birth DATE,
    phone_number VARCHAR(15),
    email VARCHAR(255) UNIQUE NOT NULL,
    health_info TEXT,
    password_hash VARCHAR(255) NOT NULL
);

-- Table: Proposal
CREATE TABLE Proposal (
    proposal_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    payment_mode VARCHAR(12) CHECK (payment_mode IN ('full', 'installment')),
    installment_count INT DEFAULT NULL,
    installment_amount DECIMAL(10, 2) DEFAULT NULL,
    beneficiaries TEXT,
    contract_signed BOOLEAN DEFAULT FALSE,
    proposal_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

-- Table: Project
CREATE TABLE Project (
    project_id SERIAL PRIMARY KEY,
    staff_id INT,
    project_type VARCHAR(8) CHECK (project_type IN ('Agarwood', 'Other')) DEFAULT 'Agarwood',
    area_marked TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL
);

-- Table: Inventory
CREATE TABLE Inventory (
    inventory_id SERIAL PRIMARY KEY,
    staff_id INT,
    item_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(15) CHECK (item_type IN ('Plant', 'Fertproposalsilizer')),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL
);

-- Table: Role
CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

-- Table: Staff
CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    role_id INT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE SET NULL
);

-- Table: SuccessStory
CREATE TABLE SuccessStory (
    story_id SERIAL PRIMARY KEY,
    project_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    media_url VARCHAR(255),
    date_published DATE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE SET NULL
);

-- Table: Payment
CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    proposal_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_receipt_url VARCHAR(255),
    FOREIGN KEY (proposal_id) REFERENCES Proposal(proposal_id) ON DELETE CASCADE
);

-- Table: Notification
CREATE TABLE Notification (
    notification_id SERIAL PRIMARY KEY,
    customer_id INT,
    staff_id INT,
    message TEXT NOT NULL,
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL
);

-- Table: Request
CREATE TABLE Request (
    request_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    request_details TEXT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

-- Table: Land
CREATE TABLE Land (
    eligibility_id SERIAL PRIMARY KEY,
    visitor_id INT NOT NULL,
    eligible BOOLEAN,
    suggested_crops TEXT,
    feedback TEXT,
    checked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES Visitor(visitor_id) ON DELETE CASCADE
);

-- Table: Weather
CREATE TABLE Weather (
    weather_check_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    forecast_date DATE NOT NULL,
    weather_details TEXT,
    suggested_start_date DATE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE
);