DROP DATABASE IF EXISTS todo;
DROP ROLE IF EXISTS todo_user;
CREATE DATABASE todo;
CREATE USER todo_user WITH ENCRYPTED PASSWORD '<password>';
GRANT ALL ON DATABASE todo TO todo_user;
