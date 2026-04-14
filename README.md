# Rushyanth Narindi Website
Live site: https://rushyanthnarindi.com/

This project is a personal website built with React, TypeScript, and Vite. The frontend is deployed on GitHub Pages using the custom domain `rushyanthnarindi.com`.


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
  - `workflows/`: Directory containing the GitHub Pages deployment workflow.

- `CNAME`: File for specifying a custom domain for the GitHub Pages site.

- `.gitignore`: Specifies files and directories to be ignored by Git.

- `package.json`: Configuration file for npm, listing dependencies and scripts.

- `LICENSE`: Licensing information for the project.

## Local Development

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.

## Styling Architecture

The frontend styles now use a modular, token-first CSS system inspired by scalable design-system structure.

### Entry point

- `src/styles.css` imports all style layers in order.

### Style layers

1. `src/styles/tokens.css`
  - Theme and semantic design tokens.
  - Light/dark overrides live here.
2. `src/styles/base.css`
  - Global element defaults and layout primitives.
3. `src/styles/shell.css`
  - Header, nav, footer, and shared chrome.
4. `src/styles/pages.css`
  - Page-specific blocks (stats, resume, contact).
5. `src/styles/widgets.css`
  - Floating chat widget styles.
6. `src/styles/responsive.css`
  - Shared responsive behavior and breakpoints.

### Editing guidelines

- Add new color or state values to `tokens.css` first.
- Prefer semantic variables (for example: `--border-default`, `--surface-info-mid`) instead of new raw color literals.
- Keep selector ownership clear:
  - Shell/layout concerns in `shell.css`
  - Page concerns in `pages.css`
  - Widget concerns in `widgets.css`
- Keep `styles.css` as import-only to preserve layer order.

## Deployment

1. Push changes to `main`.
2. GitHub Actions runs the Pages workflow and builds the Vite app.
3. The build output includes:
  - `404.html` for client-side routing fallback on GitHub Pages
  - `CNAME` for the custom domain `rushyanthnarindi.com`
4. GitHub Pages serves the frontend from the custom domain.

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

### GitHub Pages + external AI API (required for live AI)

When frontend is hosted on GitHub Pages, `/api/chat` cannot run there. Deploy `api/chat.js` to Vercel (or another serverless host), then set:

1. Repository secret `VITE_CHAT_API_URL` = your deployed endpoint (example: `https://your-api.vercel.app/api/chat`)
2. In API host env vars, set `OPENAI_API_KEY`
3. In API host env vars, set `AI_ALLOWED_ORIGINS` to include:
  - `https://rushyanthnarindi.com`
  - `https://www.rushyanthnarindi.com`

The GitHub Actions Pages workflow reads this secret at build time and injects the live API URL into the frontend.

### How it works

1. Frontend chat UI sends the current message and recent history to `/api/chat`
2. Server validates payload and forwards to OpenAI Chat Completions API
3. Server returns one assistant reply to render in the chat UI

### Recommended API host

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
5. Deploy the API on Vercel or another serverless host

### Hosting notes

- GitHub Pages cannot run `api/contact.js` (static hosting only)
- The frontend is served from GitHub Pages on `rushyanthnarindi.com`
- Deploy API routes separately and set `VITE_CONTACT_API_URL` and `VITE_CHAT_API_URL` to the external API URL when needed
- Configure `CONTACT_ALLOWED_ORIGINS` when frontend and API are on different domains

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

