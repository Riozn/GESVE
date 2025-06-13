function getToken(req) {
  const header = (req.headers.authorization || '').trim();
  let token = '';
  if (header) {
    const match = header.match(/^(Bearer|Token)\s+(.+)$/i);
    token = match ? match[2] : header;
  }

  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token && req.cookies) {
    token = req.cookies.token || '';
  }

  return token;
}
module.exports = getToken;
