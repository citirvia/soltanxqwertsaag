# Setup Instructions

Follow these steps to set up the project locally.

## 1. Environment Configuration

Create a file named .env in the root directory of the project.
Add your Supabase configuration keys to the file:

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

## 2. Database Initialization

1. Open your Supabase dashboard and navigate to the SQL Editor.
2. Open the database_setup.sql file located in this project.
3. Copy all the contents of database_setup.sql.
4. Paste the content into the Supabase SQL Editor and click Run.

## 3. Create Admin User

1. Navigate to the Authentication page in your Supabase dashboard.
2. Go to the Users section.
3. Click on "Add User" and select "Create New User".
4. Enter the email address and password for the new user.

## 4. Whitelist Admin Email

1. Return to the SQL Editor in Supabase.
2. Run the following SQL command to authorize the admin email (replace the email with the one you created if different, though the instruction specifies this specific email):

INSERT INTO admin_whitelist (email) 
VALUES ('iiih10923@gmail.com') 
ON CONFLICT (email) DO NOTHING;
