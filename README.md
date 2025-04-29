# Trip Planner Frontend - Developer Guide

## Local Development

### Run the app locally (Development Mode)
```bash
npm install        # Install dependencies
npm run dev        # Start development server (with hot-reload)
```

- Use `npm run dev` when you are **actively coding** and want **fast refresh**.
- Accessible at: `http://localhost:5173/`
- **Note:** Development server is **NOT optimized** for production.

---

## Production Build and Preview

### Build for production
```bash
npm run build
```
This will create a fully optimized, static website inside the `/dist` folder.

### Preview the production build locally
```bash
npm install -g serve     # Install if you don't have it
serve -s dist            # Serve the build folder
```
- This simulates exactly how the app will behave on Netlify.
- Accessible at: `http://localhost:3000/` (or another available port)

Use `serve -s dist` when you want to **preview the final production version** before deploying.

---

## Deployment

### Deploy to Netlify manually
```bash
netlify deploy --build --prod
```
- `--build` will trigger a fresh `npm run build` before deployment.
- `--prod` will publish it to the **live production URL**.

Make sure you have already:
```bash
npm install -g netlify-cli
netlify login
```

### Fixing Permission Issues
If you see `EACCES: permission denied` errors:
```bash
sudo chown -R $(whoami) .netlify
```
and
```bash
sudo chown -R $(whoami) ~/Library/Preferences/netlify
```
(You only need to do this once.)

---

## Best Practices for Collaborators

### 1. Protect `main` Branch
- Require **Pull Request review** before merge.
- No direct push to `main`.

### 2. Always Pull Before Push
```bash
git pull origin main
```

### 3. Deploy Production Only from Main
- Only deploy (`netlify deploy --build --prod`) when `main` branch is stable.

### 4. Check Permissions
- Make sure all collaborators can read/write `.netlify/` folder locally if they plan to deploy.


---

## Quick Command Cheat Sheet

| Purpose                        | Command                        |
| ------------------------------- | ------------------------------ |
| Start local dev server          | `npm run dev`                  |
| Build for production            | `npm run build`                |
| Preview production build locally| `serve -s dist`                |
| Deploy manually to Netlify prod | `netlify deploy --build --prod` |

---

Happy building! ✨  
Maintained by the Trip Planner Team 🌍

