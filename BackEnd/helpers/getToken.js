function getToken(req) {
  const header = (req.headers.authorization || '').trim();
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : header;
}
module.exports = getToken;
