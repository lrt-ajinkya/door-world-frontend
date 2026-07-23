import constants from "../common/constants";
import authService from "./authService";

class SpecificationService {
  async getAll() {
    const url = `${constants.API.HOST}/specifications`;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 [API REQUEST] GET', url);
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] GET', url, errorData);
        throw new Error(errorData.error || 'Failed to fetch specifications');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [API RESPONSE] GET', url, data);
      }
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getById(id) {
    const url = `${constants.API.HOST}/specifications/${id}`;
    console.log('🚀 [API REQUEST] GET', url, { id });
    
    try {
      const response = await fetch(url, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] GET', url, errorData);
        throw new Error(errorData.error || 'Failed to fetch specification');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [API RESPONSE] GET', url, data);
      }
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async create(specificationData) {
    const url = `${constants.API.HOST}/specifications`;
    console.log('🚀 [API REQUEST] POST', url, specificationData);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(specificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to create specification');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] POST', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async update(id, specificationData) {
    const url = `${constants.API.HOST}/specifications/${id}`;
    console.log('🚀 [API REQUEST] PUT', url, { id, data: specificationData });
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(specificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] PUT', url, errorData);
        throw new Error(errorData.error || 'Failed to update specification');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] PUT', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] PUT', url, error);
      throw error;
    }
  }

  async delete(id) {
    const url = `${constants.API.HOST}/specifications/${id}`;
    console.log('🚀 [API REQUEST] DELETE', url, { id });
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] DELETE', url, errorData);
        throw new Error(errorData.error || 'Failed to delete specification');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] DELETE', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] DELETE', url, error);
      throw error;
    }
  }

  async copy(id, name = null) {
    const url = `${constants.API.HOST}/specifications/${id}/copy`;
    console.log('🚀 [API REQUEST] POST', url, { id, name });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to copy specification');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] POST', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async share(id, emails) {
    const url = `${constants.API.HOST}/specifications/${id}/share`;
    console.log('🚀 [API REQUEST] POST', url, { id, emails });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({ emails }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to share specification');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] POST', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async removeAccess(id, emails) {
    const url = `${constants.API.HOST}/specifications/${id}/remove-access`;
    console.log('🚀 [API REQUEST] POST', url, { id, emails });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({ emails }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to remove access');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] POST', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async getUserSpecifications(userId) {
    const url = `${constants.API.HOST}/specifications/user/${userId}`;
    console.log('🚀 [API REQUEST] GET', url, { userId });
    
    try {
      const response = await fetch(url, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] GET', url, errorData);
        throw new Error(errorData.error || 'Failed to fetch user specifications');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [API RESPONSE] GET', url, data);
      }
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getStats() {
    const url = `${constants.API.HOST}/specifications/stats/summary`;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 [API REQUEST] GET', url);
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] GET', url, errorData);
        throw new Error(errorData.error || 'Failed to fetch specification stats');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [API RESPONSE] GET', url, data);
      }
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }
}

const specificationService = new SpecificationService();
export default specificationService;