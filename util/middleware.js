const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const messages = error.errors.map((e) => e.message)
    return res.status(400).json({ error: messages })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Session or token not valid! Log in again!' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Session or token not valid! Log in again!' })
  }

  const message = error.message

  if (message === 'Endpoint not found!') {
    return res.status(404).json({ error: message })
  }

  if (message === 'Blog not found!' || message === 'User not found!') {
    return res.status(404).json({ error: `${message} Check the id!` })
  }

  if (message === 'Session not valid!') {
    return res.status(401).json({ error: message })
  }

  if (message === 'No user found!') {
    return res.status(401).json({ error: `${message} Please log in to post!` })
  }

  if (message === 'Only author can delete!') {
    return res.status(401).json({ error: message })
  }

  if (message === 'User disabled!') {
    return res.status(401).json({ error: message })
  }

  if (message === 'Amount of likes missing!') {
    return res.status(400).json({ error: message })
  }

  if (message === 'Posting a blog failed!') {
    return res.status(400).json({ error: `${message} Title and url can´t be empty.` })
  }

  if (message === 'The year should be at least 1991 and no greater than current year!') {
    return res.status(400).json({ error: message })
  }

  return res.status(500).json({ error: 'Something went wrong. Please try again!' })
}

module.exports = { errorHandler }