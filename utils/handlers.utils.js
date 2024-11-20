function okResponse(res, status, message, data, token = null) {
  const response = {
    success: true,
    status,
    message,
    data,
    token,
  };
  return res.status(response.status).json(response);
}

function handleError(res, status, message, data) {
  const response = {
    success: false,
    status,
    message,
    data,
  };
  return res.status(response.status).json(response);
}

module.exports = {
  okResponse,
  handleError
};
