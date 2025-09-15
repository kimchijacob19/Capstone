# Deployment

Let's get your project deployed!

## Backend

We will be using [Render](https://render.com/) to host our backend.
The database and the API will be hosted separately.

### Getting Started

1. Make an account on [Render](https://render.com/) and connect it to your GitHub account.
2. If asked where to install Render, select your **backend** repository.

### Database

Create and host a new database on Render.

1. On Render, click "+ New" at the top and select "Postgres".
2. Give the database a name.
3. Scroll down to the pricing options and choose the "Free" tier.
4. Scroll to the bottom and click the "Create Database" button.
   - You will be redirected to the "Info" page for the newly created database.
5. Copy the **External Database URL** under the "Connections" section.
   - You may have to wait a few seconds until the database is ready.

> [!WARNING]
>
> Your one free Render database will expire after 90 days. At that time,
> you will only be able to start a new database.

Complete the following steps in your _local_ backend repository.

6. Change `DATABASE_URL` in `.env` to the external database url.
7. Add `NODE_ENV=production` to your `.env` file.
8. Initialize the schema of the external database by running this command in the
   root of your backend repository.\
   `psql replace_with_external_url -f db/schema.sql`\
   Example: `psql postgresql://user:pass@render.com/capstone_database -f db/schema.sql`
9. Seed the external database.\
   `npm run db:seed`

That's it! Your database is now deployed and seeded.

> [!WARNING]
>
> Be careful with CRUD operations, especially if you are in a team!
> This will now permanently affect the external database.

> [!TIP]
>
> You can temporarily undo the changes in your `.env` file if you want
> to continue working on your local development database.

### API

Create and host a new web service on Render.

1. Click "+ New" at the top and select "Web Service".
2. In the "Source Code" section, the "Git Provider" tab should auto-populate
   with your GitHub repositories. Find and connect your **backend** repository.
3. Give your API a name.
4. Set the "Build Command".\
   `npm install`
5. Leave the "Start Command" as `npm run start`.
6. Set the "Instance Type" to "Free".
7. Expand the "Advanced" section to click the "+ Add" button under "Secret Files".
8. Set the "Filename" to `.env`.
9. Copy and paste the contents of your `.env` file into the "Contents" textarea.
10. Click "Create Web Service."

Your backend is now deployed! You can find the live URL to your backend at the
top of the page. It will automatically redeploy whenever changes are pushed to
your repository's `main` branch on GitHub.

## Frontend

We will be using [Netlify](https://www.netlify.com/) to host our frontend.
Make an account if you don't already have one.

1. Make an account on Netlify and connect it to your GitHub account.
2. In the "Projects" tab of the Netlify dashboard, click the "Add new project" button
   and select "Import an existing project".
3. Select "GitHub" and authorize Netlify.
4. Click "Configure Netlify on GitHub".
5. Give Netlify access to your **frontend** repository and continue.
   - The repository must be public.
6. Enter a site name, which will determine the public URL for your deployed site.
7. Set the "Build command".\
   `npm run build`
8. Set the "Publish directory".\
   `dist`
9. Click the "Add environment variables" button and select "Import from a .env file".
10. Enter the following into the "Contents" textarea. Make sure to use your actual
    deployed backend URL!\
    `VITE_API_URL=https://your-deployed-backend.onrender.com`
11. Click the "Deploy" button at the bottom.

> [!WARNING]
>
> **Be very careful about the URL**! Do _not_ include a `/` at the end of the
> backend URL. You will run into network issues if there is a `/` at the end.

Your frontend is now deployed! It will automatically redeploy whenever changes
are pushed to your repository's `main` branch on GitHub.

## Connect the services

The final step we need to take is to ensure that our frontend is able to
communicate with our backend.

1. Go to the "Environment" page of your deployed API on Render.
2. Click the "Edit" button in the "Secret Files" section.
3. Click the "Contents" to edit the secret file.
4. Add a new line to the secret file.\
   `CORS_ORIGIN=https://your-frontend.netlify.app`
5. Click the "Done" button.
6. Click the "Save, rebuild, and deploy" button.

> [!WARNING]
>
> **Be very careful about the URL**! Do _not_ include a `/` at the end of the
> Netlify URL. You will run into CORS issues if there is a `/` at the end.

Congrats! Your fullstack web application is now deployed and available on the
internet for anyone to interact with!

## Submission

Please submit the links to your deployed frontend and backend.
