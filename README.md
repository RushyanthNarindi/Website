# My GitHub Pages Site
Here is My WebSite https://rushyanthnarindi.github.io/Website/

This project is a simple website deployed using GitHub Pages. It includes various sections such as About, Resume, Writings, and Contact. The website is designed to showcase personal information and projects.


## Check List
- ~~Logo~~
- Home page Desing Unique
- Stats Page
- Sub pages
- Nav Bar Unique



## Project Structure

- `src/`: Contains all the source files for the website.
  - `index.html`: The main HTML document for the website.
  - `about.md`: Content for the About page.
  - `resume.md`: Content for the Resume page.
  - `writings/`: Directory containing articles.
    - `article-1.md`: The first article in the Writings section.
  - `contact.md`: Content for the Contact page.
  - `assets/`: Contains static assets.
    - `css/`: Directory for CSS files.
      - `style.css`: Styles for the website.
    - `js/`: Directory for JavaScript files.
      - `main.js`: JavaScript code for interactivity.

- `.github/`: Contains GitHub Actions workflows.
  - `workflows/`: Directory for workflow files.
    - `deploy.yml`: Workflow for deploying the website to GitHub Pages.

- `CNAME`: File for specifying a custom domain for the GitHub Pages site.

- `.gitignore`: Specifies files and directories to be ignored by Git.

- `package.json`: Configuration file for npm, listing dependencies and scripts.

- `LICENSE`: Licensing information for the project.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm (if applicable).
4. Modify the content in the `src/` directory as needed.
5. Push changes to the repository to trigger deployment to GitHub Pages.

## Production Contact Form (Long-Term)

This project now supports a server-side contact endpoint at `api/contact.js` for production-grade email delivery.

## AI Chatbot Setup

This project now supports a server-side AI chatbot endpoint at `api/chat.js`.

### Required environment variables

- `OPENAI_API_KEY`

Optional variables:

- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `OPENAI_SYSTEM_PROMPT` (custom assistant instructions)
- `VITE_CHAT_API_URL` (if frontend and API are hosted separately)
- `AI_ALLOWED_ORIGINS` (optional comma-separated browser origin allow-list)

### How it works

1. Frontend chat UI sends the current message and recent history to `/api/chat`
2. Server validates payload and forwards to OpenAI Chat Completions API
3. Server returns one assistant reply to render in the chat UI

### Recommended host

- Vercel (serverless API route support out of the box)

### Required environment variables

- `RESEND_API_KEY`
- `PORTFOLIO_FROM_EMAIL` (must be a verified sender in Resend)
- `PORTFOLIO_TO_EMAIL` (where contact messages are delivered)

Optional frontend variable:

- `VITE_CONTACT_API_URL` (if your API is not on `/api/contact`)
- `CONTACT_ALLOWED_ORIGINS` (optional comma-separated allowlist for browser origins)

### How it works

1. Contact page posts form data to `/api/contact`
2. Server validates input and checks honeypot spam field
3. Server sends email using Resend API with server-side secrets

### Full setup checklist

1. Create a Resend account and verify your sending domain
2. Create a sender address and use it in `PORTFOLIO_FROM_EMAIL`
3. Set `PORTFOLIO_TO_EMAIL` to the inbox where you want messages
4. Add env vars from `.env.example` in your deployment provider
5. Deploy frontend + API on Vercel (recommended)

### Hosting notes

- GitHub Pages cannot run `api/contact.js` (static hosting only)
- If you keep GitHub Pages for frontend, deploy API separately and set `VITE_CONTACT_API_URL` to the external API URL
- Configure `CONTACT_ALLOWED_ORIGINS` when frontend and API are on different domains

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

