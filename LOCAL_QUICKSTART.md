# Try PeduC on a local computer

You do not need a domain, API subscription, or email address to try this build.

1. Install **Node.js 24 or newer**, including npm, if it is not already installed. Check with `node --version`.
2. Extract the PeduC source package to a normal folder. Open a terminal in the folder containing `package.json`.
3. Run `npm run local`.
4. Open the local address printed in the terminal. Choose **Start a local trial**.
5. Keep the terminal open while testing. Press Ctrl+C when finished. Run the same command to return later.

The first launch installs dependencies from the lockfile and needs internet access. Later launches reuse them unless the lockfile changes. The application binds to this computer's loopback interface; it is not published to the internet.

## A useful 15–20 minute demonstration

1. Set a grade and goal under **My interests & goals**, then open **My learning route**. Read why a lesson is suggested. For a short demonstration, start **Mathematics → Ratios & proportional reasoning**.
2. Try the foundation check. If you need support, open **Revisit the foundation**, study the different worked example, then retry. The route brings unresolved checks back to this step. Choose Design or the direct route for the lesson context.
3. Change the interactive model and explain what remains constant.
4. Open **Build the formal model**. Ask the coach “Why isn't every straight line a proportion?”
5. Complete the practice and transfer checks. If you use a hint or the coach during a check, the result is recorded as supported.
6. Inspect **Learning evidence**. Observe the distinction between completion and unaided first-pass answers.
7. Open **Local pilot**, add feedback, and use **Export my evaluation** to download your own JSON report.
8. Return to **My learning route** to find your next step or try a different subject: projectile motion, reaction ratios, or inheritance. Delayed reviews move to the top when due.

The delayed recall question opens 24 hours after all five initial checks have a successful answer. Do not describe it as validated retention before it is completed. The browser test suite controls a dedicated test database's clock gate to test that path without changing real learner data.

## Data and trial accounts

Records are stored in `.data/context.sqlite` on the computer running the app. Each browser trial gets a separate account and starts with empty evidence. Returning in the same browser session restores it. If you sign out or clear browser cookies, a trial has no password or email recovery. Export its report before doing so. For a returnable account, use the regular username/password registration.

Exported reports contain that account's answers, coach exchanges, and feedback. No report is automatically sent to PeduC, an innovation cell, or an investor. Review it before sharing. Do not distribute `.data`, `.env` files, or personal database copies with the source package.

## Common setup issues

- **Node version is too old:** install Node 24+ and reopen the terminal.
- **Port 3000 is in use:** stop the conflicting application or choose another port. On macOS/Linux, `PORT=3200 npm run local`; in PowerShell, `$env:PORT='3200'; npm run local`.
- **First installation fails:** check access to the npm registry. Keep TLS and package-integrity verification enabled.
- **Testing from another device:** this launcher intentionally binds only to the local computer. Shared hosting and access controls are separate deployment work.

The Linux launcher, local server, and Chromium browser flows are tested in the development environment. Windows and macOS instructions have not been tested on those operating systems.

## Scope to explain to sponsors

This is an executable local pilot with four draft lessons, a bounded authored text coach, saved evidence, and feedback export. It is not full grades 8–12 coverage, a general AI tutor, a verified examination bank, or proof that learning outcomes improve. The next investment should support reviewed curriculum authoring, a broader assessment bank, controlled educational evaluation, and production infrastructure.
