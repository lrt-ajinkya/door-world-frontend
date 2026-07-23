import constants from "../common/constants";
import authService from "./authService";
import logger from "../utils/logger";

class UserService {
  async getAll() {
    const url = `${constants.API.HOST}/users`;
    logger.api('GET', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.api('GET', url, null, null, null, errorData);
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      logger.api('GET', url, null, null, data);
      return data;
    } catch (error) {
      logger.api('GET', url, null, null, null, error.message);
      throw error;
    }
  }

  async create(displayName, email, password) {
    const response = await fetch(`${constants.API.HOST}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        displayName,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create user');
    }

    return response.json();
  }

  async update(uid, displayName, email, moreData = null) {
    const response = await fetch(`${constants.API.HOST}/users/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        uid,
        displayName,
        email,
        moreData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user');
    }

    return response.json();
  }

  async delete(uid) {
    const response = await fetch(`${constants.API.HOST}/users/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        uid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete user');
    }

    return response.json();
  }

  async getDetails(uid) {
    const response = await fetch(`${constants.API.HOST}/users/details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({
        uid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get user details');
    }

    return response.json();
  }

  async updateMargins(uid, moreData) {
    const url = `${constants.API.HOST}/users/updateMargins`;
    const body = { uid, moreData };
    logger.api('POST', url, null, body);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.api('POST', url, null, body, null, errorData);
        throw new Error(errorData.error || 'Failed to update user margins');
      }

      const data = await response.json();
      logger.api('POST', url, null, body, data);
      return data;
    } catch (error) {
      logger.api('POST', url, null, body, null, error.message);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;