/**
 * Express 5 compatible Mongo injection protection.
 * Removes keys beginning with '$' or containing '.'
 * from req.body, req.query and req.params.
 */

function sanitize(value) {
  if (!value || typeof value !== 'object') {
    return
  }

  if (Array.isArray(value)) {
    value.forEach(sanitize)
    return
  }

  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete value[key]
      continue
    }

    sanitize(value[key])
  }
}

module.exports = (req, res, next) => {
  sanitize(req.body)
  sanitize(req.params)

  // Express 5: req.query is getter-only.
  // We only mutate its contents.
  sanitize(req.query)

  next()
}
