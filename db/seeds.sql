INSERT INTO department (name)
VALUES ( "Engineering"),
( "Sales"),
( "Legal");
       
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 1),
("Software Engineer", 100000, 1),
("Sales Lead", 100000, 2),
("Sales Person", 80000, 2),
("Legal Team Lead", 250000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Warfa", "Hassan", 1, null),
("John", "Doe", 2, 1),
("Mike", "Chan", 3, null),
("Ashley", "Rodriguez", 4, 3);
     