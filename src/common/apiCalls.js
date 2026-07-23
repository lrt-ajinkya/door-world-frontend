import constants from "../common/constants";
import apiService from "../services/apiService";

export const fetchUsers = () => {
  return fetch(`${constants.API.HOST}/users`)
    .then(handleResponse)
    .then((data) => data.users || data);
};

export const updateUser = (uid, displayName, email, moreData) => {
  return fetch(`${constants.API.HOST}/users/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
      displayName,
      email,
      moreData,
    }),
  }).then(handleResponse);
};

export const createUser = (displayName, email, password) => {
  return fetch(`${constants.API.HOST}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      displayName,
    }),
  }).then(handleResponse);
};

export const deleteUser = (uid) => {
  return fetch(`${constants.API.HOST}/users/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
    }),
  }).then(handleResponse);
};

export const getMoreUserDetails = (uid) => {
  return fetch(`${constants.API.HOST}/users/details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
    }),
  }).then(handleResponse);
};

export const updateMargins = (uid, moreData) => {
  return fetch(`${constants.API.HOST}/users/updateMargins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
      moreData,
    }),
  }).then(handleResponse);
};

export const downloadExcel = (body) => {
  return fetch(`${constants.API.HOST}/excel/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => handleAttachmentResponse(response, body.name));
};

const handleResponse = (response) => {
  if (response.status !== 200) {
    return response.json().then((data) => Promise.reject(data));
  }
  return response.json();
};

const handleAttachmentResponse = (response, name) => {
  if (response.status !== 200) {
    console.error(response);
    return;
  }
  return response
    .blob()
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.getElementById("hiddenDownload");

      a.href = blobUrl;
      a.download = `${name}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error(error);
    });
};

export default {
  fetchUsers,
  updateUser,
  createUser,
  deleteUser,
  getMoreUserDetails,
  updateMargins,
  downloadExcel,
};
