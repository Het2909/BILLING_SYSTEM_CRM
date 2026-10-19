export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0];
  }

  const firstFieldError = Object.values(data).find((value) => {
    return Array.isArray(value) && value.length > 0;
  });

  if (firstFieldError) {
    return firstFieldError[0];
  }

  return fallback;
}
