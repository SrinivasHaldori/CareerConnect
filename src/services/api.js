const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson && errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

/* ==================== JOBS CRUD ==================== */

// Get all jobs
export const getJobs = async () => {
  const response = await fetch(`${BASE_URL}/jobs`);
  return handleResponse(response);
};
export const getAllJobs = getJobs;

// Get job by ID
export const getJobById = async (id) => {
  const response = await fetch(`${BASE_URL}/jobs/${id}`);
  return handleResponse(response);
};

// Add job
export const createJob = async (jobData) => {
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });
  return handleResponse(response);
};
export const addJob = createJob;

// Update job
export const updateJob = async (id, jobData) => {
  const response = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });
  return handleResponse(response);
};

// Delete job
export const deleteJob = async (id) => {
  const response = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

/* ==================== CANDIDATES CRUD ==================== */

// Get candidates
export const getCandidates = async () => {
  const response = await fetch(`${BASE_URL}/candidates`);
  return handleResponse(response);
};

export const getCandidateById = async (id) => {
  const response = await fetch(`${BASE_URL}/candidates/${id}`);
  return handleResponse(response);
};

// Add candidate
export const createCandidate = async (candidateData) => {
  const response = await fetch(`${BASE_URL}/candidates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(candidateData),
  });
  return handleResponse(response);
};
export const addCandidate = createCandidate;

export const updateCandidate = async (id, candidateData) => {
  const response = await fetch(`${BASE_URL}/candidates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(candidateData),
  });
  return handleResponse(response);
};

export const deleteCandidate = async (id) => {
  const response = await fetch(`${BASE_URL}/candidates/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

/* ==================== APPLICATIONS CRUD ==================== */

// Get applications
export const getApplications = async () => {
  const response = await fetch(`${BASE_URL}/applications`);
  return handleResponse(response);
};

export const getApplicationById = async (id) => {
  const response = await fetch(`${BASE_URL}/applications/${id}`);
  return handleResponse(response);
};

// Add application
export const createApplication = async (applicationData) => {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });
  return handleResponse(response);
};
export const addApplication = createApplication;

// Update application
export const updateApplication = async (id, applicationData) => {
  const response = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });
  return handleResponse(response);
};

// Update application status
export const updateApplicationStatus = async (id, statusOrData) => {
  if (typeof statusOrData === 'object' && statusOrData !== null) {
    return updateApplication(id, statusOrData);
  }
  // If string passed, update via PATCH
  const response = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: statusOrData }),
  });
  return handleResponse(response);
};

// Delete application
export const deleteApplication = async (id) => {
  const response = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};
