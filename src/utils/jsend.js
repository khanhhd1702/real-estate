const t = require("./status");

module.exports = jsendMiddleware = (req, res, next) => {
  res.jsend = (status, message, _else) => {
    let stt = status ? t[status] : t.s;
    const response = {
      status: stt || t.s,
      message: message || "No message",
      _else: _else || null,
    };

    return res.json(response);
  };

  next();
};
