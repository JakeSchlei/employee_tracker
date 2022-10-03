INSERT INTO department (dept_name)
VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO emp_role (title, salary, dept_id)
VALUES
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3),
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jake', 'Schlei', 2, 1),
('Stephen', 'Ward', 1, null),
('Krissy', 'Lough', 3, null),
('Christian', 'Tovar', 4, 3),
('Tyler', 'Schlei', 5, null),
('Riley', 'Carter', 6, 5),
('Sebastian', 'Davis', 7, null),
('David', 'Carter', 8, 7);