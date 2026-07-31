// import api from "./api";

// // Complaints
// export const getComplaints = () => api.get("/complaints");
// export const createComplaint = (formData) => api.post("/complaints", formData);
// export const updateComplaintStatus = (id, status) =>
//   api.put(`/complaints/${id}/status`, { status });

// // Notices
// export const getNotices = () => api.get("/notices");
// export const createNotice = (data) => api.post("/notices", data);
// export const updateNotice = (id, data) => api.put(`/notices/${id}`, data);
// export const deleteNotice = (id) => api.delete(`/notices/${id}`);

// // Residents / Users
// export const getUsers = (role) => api.get(`/users${role ? `?role=${role}` : ""}`);
// export const createUser = (data) => api.post("/users", data);
// export const updateUser = (id, data) => api.put(`/users/${id}`, data);
// export const deleteUser = (id) => api.delete(`/users/${id}`);

// // Flats
// export const getFlats = () => api.get("/flats");
// export const createFlat = (data) => api.post("/flats", data);
// export const updateFlat = (id, data) => api.put(`/flats/${id}`, data);
// export const deleteFlat = (id) => api.delete(`/flats/${id}`);

// // Maintenance
// export const getBills = () => api.get("/maintenance");
// export const createBill = (data) => api.post("/maintenance", data);
// export const markBillPaid = (id) => api.put(`/maintenance/${id}/pay`);

// // // Visitors
// // export const getVisitors = () => api.get("/visitors");
// // export const createVisitor = (data) => api.post("/visitors", data);
// // export const updateVisitorApproval = (id, approvalStatus) =>
// //   api.put(`/visitors/${id}/approval`, { approvalStatus });
// // export const markVisitorEntry = (id) => api.put(`/visitors/${id}/entry`);
// // export const markVisitorExit = (id) => api.put(`/visitors/${id}/exit`);

// // Dashboard
// export const getAdminStats = () => api.get("/dashboard/admin");

// // AI
// export const aiComplaintAssistant = (rawText) => api.post("/ai/complaint-assistant", { rawText });
// export const aiNoticeGenerator = (rawText) => api.post("/ai/notice-generator", { rawText });
// export const aiChatbot = (question) => api.post("/ai/chatbot", { question });
// export const aiMeetingSummary = (notes) => api.post("/ai/meeting-summary", { notes });



// // Visitors
// // params can include: status, visitorType, date, flat, search, all
// export const getVisitors = (params = {}) => api.get("/visitors", { params });
// export const getVisitorById = (id) => api.get(`/visitors/${id}`);
// export const createVisitor = (formData) =>
//   api.post("/visitors", formData, { headers: { "Content-Type": "multipart/form-data" } });
// export const approveVisitor = (id) => api.put(`/visitors/${id}/approve`);
// export const rejectVisitor = (id, rejectReason) =>
//   api.put(`/visitors/${id}/reject`, { rejectReason });
// export const markVisitorEntry = (id) => api.put(`/visitors/${id}/entry`);
// export const markVisitorExit = (id) => api.put(`/visitors/${id}/exit`);
// export const deleteVisitor = (id) => api.delete(`/visitors/${id}`);






import api from "./api";

// Complaints
export const getComplaints = () => api.get("/complaints");
export const createComplaint = (formData) =>
  api.post("/complaints", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateComplaintStatus = (id, status) =>
  api.put(`/complaints/${id}/status`, { status });

// Notices
export const getNotices = () => api.get("/notices");
export const createNotice = (data) => api.post("/notices", data);
export const updateNotice = (id, data) => api.put(`/notices/${id}`, data);
export const deleteNotice = (id) => api.delete(`/notices/${id}`);

// Residents / Users
export const getUsers = (role) => api.get(`/users${role ? `?role=${role}` : ""}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Flats
export const getFlats = () => api.get("/flats");
export const createFlat = (data) => api.post("/flats", data);
export const updateFlat = (id, data) => api.put(`/flats/${id}`, data);
export const deleteFlat = (id) => api.delete(`/flats/${id}`);

// Maintenance
export const getBills = () => api.get("/maintenance");
export const createBill = (data) => api.post("/maintenance", data);
export const markBillPaid = (id) => api.put(`/maintenance/${id}/pay`);

// Visitors
// params can include: status, visitorType, date, flat, search, all
export const getVisitors = (params = {}) => api.get("/visitors", { params });
export const getVisitorById = (id) => api.get(`/visitors/${id}`);
export const createVisitor = (formData) =>
  api.post("/visitors", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const approveVisitor = (id) => api.put(`/visitors/${id}/approve`);
export const rejectVisitor = (id, rejectReason) =>
  api.put(`/visitors/${id}/reject`, { rejectReason });
export const markVisitorEntry = (id) => api.put(`/visitors/${id}/entry`);
export const markVisitorExit = (id) => api.put(`/visitors/${id}/exit`);
export const deleteVisitor = (id) => api.delete(`/visitors/${id}`);

//complaint
export const getComplaintById = (id) => api.get(`/complaints/${id}`);

// Dashboard
export const getAdminStats = () => api.get("/dashboard/admin");

// AI
export const aiComplaintAssistant = (rawText) => api.post("/ai/complaint-assistant", { rawText });
export const aiNoticeGenerator = (rawText) => api.post("/ai/notice-generator", { rawText });
export const aiChatbot = (question) => api.post("/ai/chatbot", { question });
export const aiMeetingSummary = (notes) => api.post("/ai/meeting-summary", { notes });