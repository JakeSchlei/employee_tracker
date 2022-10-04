
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    dept_name VARCHAR(30)
);

CREATE TABLE emp_role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    dept_id INT,
    CONSTRAINT fk_department FOREIGN KEY (dept_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES emp_role(id) 
);