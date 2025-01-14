import Joi from "joi";

const leadSchema = Joi.object({
  name: Joi.string() .pattern(/^[a-zA-Z\s]+$/).min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
  source: Joi.string()
    .valid("website", "referral", "socialMedia")
    .required()
    .messages({
      "any.only": "Source must be one of [website, referral, socialMedia]",
    }),
  status: Joi.string()
    .valid("New", "Contacted", "Qualified", "Lost", "Won")
    .required()
    .messages({
      "any.only":
        "Status must be one of [New, Contacted, Qualified, Lost, Won]",
    }),
  tags: Joi.array().items(Joi.string().hex().length(24)).optional().messages({
    "array.base": "Tags must be an array of valid object IDs",
  }),
  assignedTo: Joi.string().hex().length(24).optional().allow(null).messages({
    "string.hex": "Assigned To must be a valid object ID",
    "string.length": "Assigned To must be a 24-character hexadecimal ID",
  }),
});


const tagSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .min(3)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "string.pattern.base": "Name must only contain letters and spaces",
    }),
});

export default tagSchema;

const userSchema = Joi.object({
  name: Joi.string().min(3) .pattern(/^[a-zA-Z\s]+$/).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  role: Joi.string()
    .valid("superAdmin", "subAdmin", "supportAgent")
    .default("supportAgent")
    .messages({
      "any.only": "Role must be one of [superAdmin, subAdmin, supportAgent]",
    }),
  answer: Joi.string().required().messages({
      "string.empty": "Answer cannot be empty",
    }),
  photoUrl: Joi.string().uri().allow(""),
  status: Joi.boolean().default(false),
});

export { leadSchema, tagSchema, userSchema };
