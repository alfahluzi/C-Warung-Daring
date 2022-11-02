var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

/**
 * setup session using local storage
 * @function setSession
 * @param {any} data use JSON.stringify
 */
function setSession(data) {
  if (localStorage.setItem("session", data)) return true;
  else return false;
}
/**
 * get session data return object of session
 * @function getSession
 */
function getSession() {
  let x = localStorage.getItem("session");
  if (x == null) return false;
  else return JSON.parse(x);
}

/**
 * to delete session memory from local storage
 * @function removeSession
 */
function removeSession() {
  if (localStorage.removeItem("session")) return true;
  else return false;
}
module.exports = { localStorage, getSession, setSession, removeSession };
