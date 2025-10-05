BEGIN TRANSACTION;
CREATE TABLE doctors (
	doctor_id INTEGER NOT NULL, 
	full_name VARCHAR, 
	phone_number VARCHAR, 
	email VARCHAR, 
	password_hash VARCHAR, 
	specialization VARCHAR, 
	qualification VARCHAR, 
	license_number VARCHAR, 
	years_experience INTEGER, 
	availability JSON, 
	consultation_fee FLOAT, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (doctor_id), 
	UNIQUE (email), 
	UNIQUE (license_number)
);
INSERT INTO "doctors" VALUES(1,'Dr. Smith','1112223333','smith@example.com','hashed_doc1','Cardiology','MBBS, MD','LIC12345',10,'{"Mon": "9-12", "Wed": "14-18"}',500.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(2,'Dr. Brown','4445556666','brown@example.com','hashed_doc2','Dermatology','MBBS, MD','LIC67890',8,'{"Tue": "10-16", "Thu": "10-16"}',400.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(3,'Dr. Green','7778889990','green@example.com','hashed_doc3','Pediatrics','MBBS, MD','LIC13579',6,'{"Mon": "10-14", "Fri": "12-16"}',350.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(4,'Dr. White','2223334441','white@example.com','hashed_doc4','Neurology','MBBS, MD','LIC24680',12,'{"Tue": "9-12", "Thu": "14-18"}',600.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(5,'Dr. Black','3334445552','black@example.com','hashed_doc5','Orthopedics','MBBS, MD','LIC11223',9,'{"Wed": "9-13", "Fri": "10-15"}',450.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(6,'Dr. Blue','4445556663','blue@example.com','hashed_doc6','ENT','MBBS, MD','LIC44556',7,'{"Mon": "8-12", "Thu": "13-17"}',400.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(7,'Dr. Red','5556667774','red@example.com','hashed_doc7','Ophthalmology','MBBS, MD','LIC77889',5,'{"Tue": "9-12", "Wed": "14-18"}',350.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(8,'Dr. Violet','6667778885','violet@example.com','hashed_doc8','Psychiatry','MBBS, MD','LIC99001',8,'{"Mon": "10-13", "Fri": "12-16"}',500.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(9,'Dr. Orange','7778889996','orange@example.com','hashed_doc9','Gastroenterology','MBBS, MD','LIC22334',11,'{"Tue": "11-15", "Thu": "13-17"}',550.0,'2025-10-03 21:40:01');
INSERT INTO "doctors" VALUES(10,'Dr. Pink','8889990007','pink@example.com','hashed_doc10','Endocrinology','MBBS, MD','LIC55667',6,'{"Wed": "9-12", "Fri": "14-18"}',450.0,'2025-10-03 21:40:01');
CREATE TABLE users (
	user_id INTEGER NOT NULL, 
	full_name VARCHAR, 
	date_of_birth DATE, 
	gender VARCHAR, 
	phone_number VARCHAR, 
	email VARCHAR, 
	password_hash VARCHAR, 
	preferred_language VARCHAR, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (user_id), 
	UNIQUE (email)
);
INSERT INTO "users" VALUES(1,'Alice Johnson','1990-05-20','Female','1234567890','alice@example.com','hashed_pw1','English','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(2,'Bob Singh','1985-08-15','Male','9876543210','bob@example.com','hashed_pw2','Hindi','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(3,'Charlie Kumar','1992-03-10','Male','1112223334','charlie@example.com','hashed_pw3','English','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(4,'Diana Patel','1988-11-25','Female','5556667777','diana@example.com','hashed_pw4','Punjabi','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(5,'Ethan Roy','1995-07-12','Male','8889990001','ethan@example.com','hashed_pw5','Hindi','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(6,'Fiona Sharma','1991-04-08','Female','2223334445','fiona@example.com','hashed_pw6','English','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(7,'George Mehta','1987-06-19','Male','3334445556','george@example.com','hashed_pw7','English','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(8,'Hannah Verma','1993-09-30','Female','4445556667','hannah@example.com','hashed_pw8','Hindi','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(9,'Ian Kapoor','1994-02-05','Male','5556667778','ian@example.com','hashed_pw9','Punjabi','2025-10-03 21:40:01');
INSERT INTO "users" VALUES(10,'Julia Singh','1990-12-17','Female','6667778889','julia@example.com','hashed_pw10','English','2025-10-03 21:40:01');
CREATE INDEX ix_users_user_id ON users (user_id);
CREATE UNIQUE INDEX ix_users_phone_number ON users (phone_number);
CREATE INDEX ix_users_full_name ON users (full_name);
CREATE UNIQUE INDEX ix_doctors_phone_number ON doctors (phone_number);
CREATE INDEX ix_doctors_full_name ON doctors (full_name);
CREATE INDEX ix_doctors_doctor_id ON doctors (doctor_id);
COMMIT;
