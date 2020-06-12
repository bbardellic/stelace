const { Joi, objectIdParamsSchema, getRangeFilter } = require('../../util/validation')
const { apiVersions } = require('../util')
const { DEFAULT_NB_RESULTS_PER_PAGE } = require('../../util/list')

const schemas = {}

const orderByFields = [
  'name',
  'createdDate',
  'updatedDate',
  'active'
]

// ////////// //
// 2020-06-12 //
// ////////// //
schemas['2020-06-12'] = {}
schemas['2020-06-12'].list = {
  query: Joi.object().keys({
    // order
    orderBy: Joi.string().valid(...orderByFields).default('createdDate'),
    order: Joi.string().valid('asc', 'desc').default('desc'),

    // pagination
    page: Joi.number().integer().min(1).default(1),
    nbResultsPerPage: Joi.number().integer().min(1).max(100).default(DEFAULT_NB_RESULTS_PER_PAGE),

    // filters
    id: Joi.array().unique().items(Joi.string()).single(),
    createdDate: getRangeFilter(Joi.string().isoDate()),
    updatedDate: getRangeFilter(Joi.string().isoDate()),
    event: Joi.array().unique().items(Joi.string()).single(),
    active: Joi.boolean(),
  })
}

// ////////// //
// 2019-05-20 //
// ////////// //
schemas['2019-05-20'] = {}
schemas['2019-05-20'].list = null
schemas['2019-05-20'].read = {
  params: objectIdParamsSchema
}
schemas['2019-05-20'].create = {
  body: Joi.object().keys({
    name: Joi.string().max(255).required(),
    targetUrl: Joi.string().uri(),
    event: Joi.string(),
    apiVersion: Joi.string().valid(...apiVersions),
    active: Joi.boolean(),
    metadata: Joi.object().unknown(),
    platformData: Joi.object().unknown()
  }).required()
}
schemas['2019-05-20'].update = {
  params: objectIdParamsSchema,
  body: schemas['2019-05-20'].create.body
    .fork('targetUrl', schema => schema.forbidden())
    .fork('name', schema => schema.optional())
}
schemas['2019-05-20'].remove = {
  params: objectIdParamsSchema
}

const validationVersions = {
  '2020-06-12': [
    {
      target: 'webhook.list',
      schema: schemas['2020-06-12'].list
    },
  ],

  '2019-05-20': [
    {
      target: 'webhook.list',
      schema: schemas['2019-05-20'].list
    },
    {
      target: 'webhook.read',
      schema: schemas['2019-05-20'].read
    },
    {
      target: 'webhook.create',
      schema: schemas['2019-05-20'].create
    },
    {
      target: 'webhook.update',
      schema: schemas['2019-05-20'].update
    },
    {
      target: 'webhook.remove',
      schema: schemas['2019-05-20'].remove
    }
  ]
}

module.exports = validationVersions
