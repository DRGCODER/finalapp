CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userRole BOOLEAN NOT NULL
)
CREATE TABLE IF NOT EXISTS todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    text TEXT NOT NULL,
    isCompleted BOOLEAN DEFAULT false,
)

CREATE TABLE IF NOT EXISTS userandtodorel (
    id SERIAL PRIMARY KEY,
    todo_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (todo_id) REFERENCES todo(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)