import Joi from 'joi';

// Auth validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Subject validation schemas
export const createSubjectSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'Subject title is required',
    'string.min': 'Title must be at least 3 characters',
    'any.required': 'Title is required'
  }),
  content: Joi.string().allow('').optional(),
  yearId: Joi.string().required().messages({
    'any.required': 'Year ID is required'
  })
});

// Year validation schemas
export const createYearSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().min(2).max(50).required(),
  description: Joi.string().allow('').optional()
});

// Chapter validation schemas
export const createChapterSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().required(),
  subjectId: Joi.string().required(),
  unitId: Joi.string().allow(null).optional(),
  yearSlug: Joi.string().required(),
  subjectCode: Joi.string().required(),
  topics: Joi.array().items(Joi.string()).default([]),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  estimatedTime: Joi.number().min(0).default(0),
  tags: Joi.array().items(Joi.string()).default([]),
  published: Joi.boolean().default(true),
  order: Joi.number().min(0).default(0)
});

// Past Question validation schemas
export const createPastQuestionSchema = Joi.object({
  title: Joi.string().min(3).max(300).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow('').optional(),
  questionContent: Joi.string().allow('').optional(),
  questions: Joi.array().items(
    Joi.object({
      questionNumber: Joi.string().required(),
      content: Joi.string().required(),
      images: Joi.array().default([])
    })
  ).optional(),
  subjectCode: Joi.string().required().messages({
    'any.required': 'Subject code is required'
  }),
  yearSlug: Joi.string().valid('first', 'second', 'third', 'fourth').required().messages({
    'any.required': 'Year slug is required',
    'any.only': 'Year slug must be one of: first, second, third, fourth'
  }),
  examYear: Joi.string().required().messages({
    'any.required': 'Exam year is required'
  }),
  examType: Joi.string().valid('midterm', 'final', 'internal', 'practical', 'other').default('final'),
  published: Joi.boolean().default(true)
});

// User management schemas (admin)
export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('admin', 'editor', 'viewer').default('viewer')
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  role: Joi.string().valid('admin', 'editor', 'viewer').optional()
});

// Post validation schemas
export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').optional(),
  imageUrl: Joi.string().uri().allow('').optional(),
  published: Joi.boolean().default(false)
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().allow('').optional(),
  imageUrl: Joi.string().uri().allow('').optional(),
  published: Joi.boolean().optional()
});

// Material validation schemas
export const createMaterialSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('book', 'link', 'video', 'other').required(),
  fileUrl: Joi.string().uri().allow('').optional(),
  subjectCode: Joi.string().required(),
  yearSlug: Joi.string().required(),
  published: Joi.boolean().default(false)
});

// Unit validation schemas
export const createUnitSchema = Joi.object({
  unitName: Joi.string().min(2).max(200).required(),
  unitCode: Joi.string().min(2).max(50).required(),
  description: Joi.string().allow('').optional(),
  subjectCode: Joi.string().required(),
  yearSlug: Joi.string().required(),
  order: Joi.number().min(0).default(0)
});

// Settings validation
export const updateSettingsSchema = Joi.object({
  platformName: Joi.string().max(200).optional(),
  description: Joi.string().optional(),
  contactEmail: Joi.string().email().optional(),
  maintenanceMode: Joi.boolean().optional()
});
