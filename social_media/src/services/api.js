const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3005";

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  
  let data;
  if (isJson) {
    data = await response.json();
  } else {
    // If not JSON, we shouldn't attempt to parse it as JSON
    const textData = await response.text();
    if (!response.ok) {
      throw new Error(`Server Error (${response.status}): ${textData.substring(0, 100)}...`);
    }
    return textData;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403 || data.message === "Token is invalid") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Trigger a reload to return to login state
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Specific helpers
  getSuggestedUsers: () => api.get("/users/suggested"),
  getTrendingTags: () => api.get("/posts/trending"),
  generateAICaption: (prompt) => api.post("/posts/generate-caption", { prompt }),
  
  // Interaction helpers
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  unlikePost: (postId) => api.delete(`/posts/${postId}/unlike`),
  getComments: (postId) => api.get(`/comments/${postId}`),
  addComment: (postId, comment) => api.post(`/comments/${postId}`, { comment }),
  getFollowers: (userId) => api.get(`/follow/followers/${userId}`),
  getFollowing: (userId) => api.get(`/follow/following/${userId}`),
  followUser: (followingId) => api.post("/follow/follow", { followingId }),
  unfollowUser: (followingId) => api.delete(`/follow/unfollow/${followingId}`),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
};
