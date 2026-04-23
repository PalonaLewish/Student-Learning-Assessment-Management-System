
CREATE DATABASE IF NOT EXISTS student_assessment;
USE student_assessment;

DROP TABLE IF EXISTS Attempts;
DROP TABLE IF EXISTS Quiz_Questions;
DROP TABLE IF EXISTS Results;
DROP TABLE IF EXISTS Quiz;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Topics;
DROP TABLE IF EXISTS Subjects;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') NOT NULL DEFAULT 'student'
);

CREATE TABLE Subjects (
  subject_id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE Topics (
  topic_id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  topic_name VARCHAR(120) NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
  UNIQUE KEY unique_topic_subject (subject_id, topic_name)
);

CREATE TABLE Questions (
  question_id INT AUTO_INCREMENT PRIMARY KEY,
  topic_id INT NOT NULL,
  question TEXT NOT NULL,
  optionA VARCHAR(255) NOT NULL,
  optionB VARCHAR(255) NOT NULL,
  optionC VARCHAR(255) NOT NULL,
  optionD VARCHAR(255) NOT NULL,
  correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES Topics(topic_id) ON DELETE CASCADE
);

CREATE TABLE Quiz (
  quiz_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Quiz_Questions (
  quiz_id INT NOT NULL,
  question_id INT NOT NULL,
  PRIMARY KEY (quiz_id, question_id),
  FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE
);

CREATE TABLE Attempts (
  attempt_id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_answer ENUM('A', 'B', 'C', 'D') DEFAULT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES Questions(question_id) ON DELETE CASCADE
);

CREATE TABLE Results (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE
);

DELIMITER $$
CREATE PROCEDURE generate_random_quiz(
  IN p_subject INT,
  IN p_topic INT,
  IN p_difficulty ENUM('Easy','Medium','Hard'),
  IN p_limit INT
)
BEGIN
  SELECT q.question_id
  FROM Questions q
  JOIN Topics t ON q.topic_id = t.topic_id
  JOIN Subjects s ON t.subject_id = s.subject_id
  WHERE (p_subject IS NULL OR s.subject_id = p_subject)
    AND (p_topic IS NULL OR t.topic_id = p_topic)
    AND (p_difficulty IS NULL OR q.difficulty = p_difficulty)
  ORDER BY RAND()
  LIMIT p_limit;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_attempt_insert_update_result
AFTER INSERT ON Attempts
FOR EACH ROW
BEGIN
  UPDATE Results r
  JOIN (
    SELECT quiz_id,
      COALESCE(SUM(is_correct), 0) AS correct_count,
      COUNT(*) AS attempted_count
    FROM Attempts
    WHERE quiz_id = NEW.quiz_id
    GROUP BY quiz_id
  ) calc ON r.quiz_id = calc.quiz_id
  SET r.score = CASE
    WHEN calc.attempted_count > 0 THEN ROUND(calc.correct_count / calc.attempted_count * 100)
    ELSE 0
  END;
END $$
DELIMITER ;



INSERT INTO Subjects (subject_name) VALUES ('Mathematics'), ('Science'), ('English');
INSERT INTO Topics (subject_id, topic_name)
VALUES
  (1, 'Algebra'),
  (1, 'Geometry'),
  (2, 'Biology'),
  (2, 'Physics'),
  (3, 'Grammar');

INSERT INTO Questions (topic_id, question, optionA, optionB, optionC, optionD, correct_answer, difficulty)
VALUES
  (1, 'What is 5 + 7?', '10', '11', '12', '13', 'C', 'Easy'),
  (1, 'Solve for x: 2x = 10.', '2', '4', '5', '8', 'C', 'Easy'),
  (3, 'Which planet is known as the Red Planet?', 'Earth', 'Mars', 'Venus', 'Jupiter', 'B', 'Easy');
