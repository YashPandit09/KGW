# Port 3000 Conflict - Quick Fix Options

## Option 1: Kill Process on Port 3000 (Recommended)

### Method A - Task Manager
1. Open Task Manager (Ctrl + Shift + Esc)
2. Go to "Details" tab
3. Look for `node.exe` processes
4. Right-click and "End Task" on any node process using port 3000
5. Run `npm run dev` again

### Method B - Command Line
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# This will show something like:
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
#                                                   ^^^^^ (PID)

# Kill it (replace 12345 with actual PID)
taskkill /PID 12345 /F
```

## Option 2: Run React on Different Port

Edit `client/package.json` scripts section:

**Windows:**
```json
"scripts": {
  "start": "set PORT=3001 && react-scripts start",
  ...
}
```

**Then update proxy:**
Run React on port 3001, keep server on 4000

## Option 3: Use .env for Port

Create `client/.env`:
```
PORT=3001
```

Then React will automatically use port 3001.

---

## Recommended Action

**Easiest fix:**

1. Stop current process (Ctrl + C in terminal)
2. Open Task Manager → End all Node.js tasks
3. Run `npm run dev` again

**Or use a different port:**

Create `client/.env` with `PORT=3001` and update the backend proxy if needed.
