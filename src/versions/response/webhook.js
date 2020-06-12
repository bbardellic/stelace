const responseChanges = {
  '2020-06-12': [
    {
      target: 'webhook.list',
      description: 'Webhooks list is returned without pagination meta',
      down: async (params) => {
        const paginationMeta = params.result
        params.result = paginationMeta.results

        return params
      }
    }
  ],
}

module.exports = responseChanges
