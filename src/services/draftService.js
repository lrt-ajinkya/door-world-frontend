import constants from "../common/constants";
import authService from "./authService";

class DraftService {
  async getAll(userEmail = null, search = null) {
    const params = new URLSearchParams();
    if (userEmail) params.append('userEmail', userEmail);
    if (search) params.append('search', search);
    
    const url = `${constants.API.HOST}/drafts?${params}`;
    console.log('🚀 [API REQUEST] GET', url, { userEmail, search });
    
    try {
      const response = await fetch(url, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] GET', url, errorData);
        throw new Error(errorData.error || 'Failed to fetch drafts');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getById(id) {
    const url = `${constants.API.HOST}/drafts/${id}`;
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
        throw new Error(errorData.error || 'Failed to fetch draft');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async create(draftData) {
    const url = `${constants.API.HOST}/drafts`;
    console.log('🚀 [API REQUEST] POST', url, draftData);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(draftData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to create draft');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] POST', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async update(id, draftData) {
    const url = `${constants.API.HOST}/drafts/${id}`;
    console.log('🚀 [API REQUEST] PUT', url, { id, data: draftData });
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(draftData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] PUT', url, errorData);
        throw new Error(errorData.error || 'Failed to update draft');
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
    const url = `${constants.API.HOST}/drafts/${id}`;
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
        throw new Error(errorData.error || 'Failed to delete draft');
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
    const url = `${constants.API.HOST}/drafts/${id}/copy`;
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
        throw new Error(errorData.error || 'Failed to copy draft');
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
    const url = `${constants.API.HOST}/drafts/${id}/share`;
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
        throw new Error(errorData.error || 'Failed to share draft');
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
    const url = `${constants.API.HOST}/drafts/${id}/remove-access`;
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

  async autoSave(draftData) {
    const url = `${constants.API.HOST}/drafts/autosave`;
    console.log('🚀 [API REQUEST] POST', url, draftData);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(draftData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to auto-save draft');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] POST', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async convertToSpecification(id) {
    const url = `${constants.API.HOST}/drafts/${id}/convert`;
    console.log('🚀 [API REQUEST] POST', url, { id });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to convert draft to specification');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] POST', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async getUserDrafts(userId) {
    const url = `${constants.API.HOST}/drafts/user/${userId}`;
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
        throw new Error(errorData.error || 'Failed to fetch user drafts');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getStats() {
    const url = `${constants.API.HOST}/drafts/stats/summary`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] GET', url, errorData);
        throw new Error(errorData.error || 'Failed to fetch draft stats');
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }
}

const draftService = new DraftService();
export default draftService;