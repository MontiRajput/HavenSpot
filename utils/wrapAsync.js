module.exports = (fn) => {
  return function (req, res, next) {
    // Add req, res, next here
    fn(req, res, next).catch(function (err) {
      next(err); // Pass the error to next() for proper error handling
    });
  };
};
