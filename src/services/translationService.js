import constants from "../common/constants";
import authService from "./authService";
import logger from "../utils/logger";

class TranslationService {
  async getTranslations(language = 'en', category = null) {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (category) params.append('category', category);
    
    const url = `${constants.API.HOST}/translations?${params}`;
    logger.api('GET', url, { language, category });
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        logger.api('GET', url, { language, category }, null, null, errorData);
        throw new Error(errorData.error || 'Failed to fetch translations');
      }

      const data = await response.json();
      logger.api('GET', url, { language, category }, null, data);
      return data;
    } catch (error) {
      logger.api('GET', url, { language, category }, null, null, error.message);
      throw error;
    }
  }

  async getTranslationByKey(key) {
    const response = await fetch(`${constants.API.HOST}/translations/${key}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch translation');
    }

    return response.json();
  }

  async searchTranslations(term, language = 'en') {
    const params = new URLSearchParams({ language });
    
    const response = await fetch(`${constants.API.HOST}/translations/search/${term}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search translations');
    }

    return response.json();
  }

  // Admin methods (require authentication and admin privileges)
  async getAllTranslations() {
    const response = await fetch(`${constants.API.HOST}/translations/admin/all`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch all translations');
    }

    return response.json();
  }

  async createTranslation(translationData) {
    const response = await fetch(`${constants.API.HOST}/translations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(translationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create translation');
    }

    return response.json();
  }

  async updateTranslation(key, translationData) {
    const response = await fetch(`${constants.API.HOST}/translations/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(translationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update translation');
    }

    return response.json();
  }

  async deleteTranslation(key) {
    const response = await fetch(`${constants.API.HOST}/translations/${key}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete translation');
    }

    return response.json();
  }

  async getCategories() {
    const response = await fetch(`${constants.API.HOST}/translations/admin/categories`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch translation categories');
    }

    return response.json();
  }

  async bulkCreateTranslations(translations) {
    const response = await fetch(`${constants.API.HOST}/translations/admin/bulk-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({ translations }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to bulk create translations');
    }

    return response.json();
  }

  async bulkUpdateTranslations(translations) {
    const response = await fetch(`${constants.API.HOST}/translations/admin/bulk-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({ translations }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to bulk update translations');
    }

    return response.json();
  }

  async exportTranslations(language = 'en', category = null, format = 'json') {
    const params = new URLSearchParams({ language, format });
    if (category) params.append('category', category);
    
    const response = await fetch(`${constants.API.HOST}/translations/admin/export?${params}`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to export translations');
    }

    return response.json();
  }

  async importTranslations(translations, overwrite = false) {
    const response = await fetch(`${constants.API.HOST}/translations/admin/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify({ translations, overwrite }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to import translations');
    }

    return response.json();
  }

  async getStats() {
    const response = await fetch(`${constants.API.HOST}/translations/admin/stats`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch translation stats');
    }

    return response.json();
  }
}

const translationService = new TranslationService();
export default translationService;