// Runs the web server and the Discord bot(s) as two child processes (Railway-friendly).
const { spawn } = require("child_process");
const children = [];
function run(file) {
  const c = spawn(process.execPath, [file], { stdio: "inherit", env: process.env });
  children.push(c);
  c.on("exit", (code) => {
    console.error(`${file} exited with code ${code}`);
    if (file === "server.js") shutdown(code || 1); // server is essential
  });
}
function shutdown(code = 0) {
  children.forEach((c) => { try { c.kill("SIGTERM"); } catch {} });
  setTimeout(() => process.exit(code), 500);
}
process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));
run("server.js");
run("bot.js");
