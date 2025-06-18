import Cookies from "js-cookie";

export const authHeaders = (headers) => {
  const token = Cookies.get("authToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
