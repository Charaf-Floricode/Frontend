/**
 * Converts Axios / fetch / generic errors to a short message
 * so your Login page can show something user-friendly.
 */
export default function formatError(err) {
  if (!err) return "Onbekende fout";

  // Axios error with response body
  if (err.response?.data?.detail)       return err.response.data.detail;
  if (err.response?.data?.error)        return err.response.data.error;
  if (err.response?.data)               return JSON.stringify(err.response.data);

  // Native fetch error with body json text
  if (err.message)                      return err.message;

  return String(err);
}
