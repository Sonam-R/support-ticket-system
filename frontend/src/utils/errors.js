const NETWORK_ERROR =
  'Unable to connect to the server. Please check your connection and try again.';

const GENERIC_ERROR = 'Something went wrong. Please try again.';

export function getErrorMessage(error) {
  if (!error.response) {
    return NETWORK_ERROR;
  }

  const message = error.response?.data?.message;

  if (message) {
    return message;
  }

  if (error.message && !error.message.startsWith('Request failed')) {
    return error.message;
  }

  return GENERIC_ERROR;
}
