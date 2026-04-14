export const validateSchema = (schema) => {
  return (req, res, next) => {
    // If multer has processed a file, make it available to Joi for validation
    const dataToValidate = { ...req.body };
    if (req.file) {
      dataToValidate[req.file.fieldname] = req.file.path;
    }

    const { value, error } = schema.validate(dataToValidate);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        error: error.details,
      });
    }

    if (value !== undefined) {
      req.body = value;
    }
    next();
  };
};

export const validateQueryParam = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.query);

    if (error) {
      return res.status(400).json({
        error: error.details,
      });
    }

    req.query = value;
    next();
  };
};