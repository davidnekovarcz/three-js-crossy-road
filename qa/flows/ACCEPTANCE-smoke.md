# Crossy Road — Kaloko score smoke

Local Vite only (`http://localhost:5175`). Port 5173 is Marooned's dev server in this workspace. Production is readonly and is not walked.

Sign the dedicated test Gmail in once with `npx kaloko auth save --env local --account player`. Kaloko stores that browser session under `tmp/kaloko/.auth/` (gitignored) and loads it for this walk. A fresh walk clears the shared Chrome profile, so the saved session is what the account chooser uses. The password is not stored in this repo.

## Smoke — play, lose, save (`smoke-score.yml`)

1. Open the local game.
2. Step forward until the score is at least 1. Corn starts at 0, so the first vehicle hit ends the run.
3. Wait for `#result-container`.
4. Click `#sign-in-button` and accept the test Google account if the chooser appears.
5. Expect the sign-in section gone and a Retry button, which is shown only after the score is saved.
