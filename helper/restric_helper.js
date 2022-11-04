function isEmpty(e) {
  if (e === undefined) return true;
  else if (e == null) return true;
  else if (e == "") return true;
  return false;
}

function isAdmin(n) {
  if (n == 1) return true;
  return false;
}

module.exports = { isEmpty, isAdmin };
