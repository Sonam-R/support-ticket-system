const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const message = result.error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  req.validated = result.data;

  if (result.data.body) {
    req.body = result.data.body;
  }
  if (result.data.params) {
    req.params = result.data.params;
  }

  next();
};

module.exports = validate;
