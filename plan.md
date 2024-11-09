Authentication
Anyone can create user with username & Password (username is unique) (role is selected).
Login (return JWT with 1 hour expiration one for auth and refresher 1 day).
Refresh token (using refreshToken) returning new token and new refresh token
Authorisation
Each user can be user or admin (role).
Admin can see all users (Pagination)
Admin can Get single user by id
Admin can make other users as admins or not (only role can be changed)
CRUD operation for TODO App
User Can create todo record for himself (any string field must be 4 characters at least like todo title )
User can see list of his todo (Pagination) (only id and title )
User Can see His todo as single with all details
User can delete todo (only his todo)
User can update todo (only his todo)
User can update todo status (only his todo)
List All todos for admins (Pagination)
