const loggerMiddleware = (req, res, next) => {
  console.log("[Request] " + req.method + " " + req.url);
  res.on('finish', () => {
    console.log("[Response] " + res.statusCode + " " + req.method + " " + req.url);
  });
  next();
};

export default loggerMiddleware;
