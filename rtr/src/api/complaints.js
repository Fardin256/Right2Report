const BASE = "https://right2report.onrender.com/api/complaint";
const getToken = () => localStorage.getItem("token");

export const submitComplaint = async (formData) => {
  const res = await fetch(`${BASE}/report`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
};
export const getMyComplaints = async () => {
  const res = await fetch(`${BASE}/my`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }
  return res.json();
};

export const getAuthority = async (area, issueType) => {
  const res = await fetch(`${BASE}/get-authority?area=${encodeURIComponent(area)}&issueType=${encodeURIComponent(issueType)}`);
  return res.json();
};
export const getAllComplaints = async () => {
  const res = await fetch(`${BASE}/all`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const updateComplaintStatus = async (id, status) => {
  const res = await fetch(`${BASE}/status/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });
  return res.json();
};

export const deleteComplaint = async (id) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};