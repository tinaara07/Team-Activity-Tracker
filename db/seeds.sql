INSERT INTO departments (name) VALUES
( 'Investment Banking'),
( 'Asset Management'),
( 'Risk Management'),
( 'Compliance'),
( 'Wealth Management');
INSERT INTO roles (title, salary, department_id) VALUES
( 'Investment Analyst', 7000,1),
( 'Portfolio Manager', 6000,2),
( 'Risk Analyst', 5600,3),
('Compliance Officer', 4000,4),
('Financial Advisor', 5000,5);
INSERT INTO employees (first_name, last_name, role_id) VALUES
('Mathew', 'Blanco', 1),
('Ashley', 'Montgomery', 2),
('Anna', 'Garcia', 3),
('Jusus', 'Lopez', 4),
('Luis', 'Shapiro', 5);


SELECT * FROM roles
JOIN employee ON employee.role_id = roles.id;