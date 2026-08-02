const os = require("node:os");

try {
  os.userInfo();
} catch {
  os.userInfo = () => ({
    uid: -1,
    gid: -1,
    username: process.env.USERNAME || "test-user",
    homedir: process.env.USERPROFILE || os.tmpdir(),
    shell: null,
  });
}
