function isEmpty(e) {
  if (e === undefined) return true;
  if (e == null) return true;
  if (e == "") return true;
  return false;
}

function isAdmin(n) {
  if (n == 1) return true;
  return false;
}

module.exports = { isEmpty, isAdmin };
