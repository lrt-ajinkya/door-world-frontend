import constants from "../common/constants";
import authService from "./authService";

class LogoService {
  async uploadLogo(file) {
    const url = `${constants.API.HOST}/uploads/logo`;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 [API REQUEST] POST', url, { fileName: file.name, fileSize: file.size });
    }
    
    const formData = new FormData();
    formData.append('logo', file);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [API ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Failed to upload logo');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [API RESPONSE] POST', url, data);
      }
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] POST', url, error);
      throw error;
    }
  }

  async getLogos() {
    const url = `${constants.API.HOST}/uploads/logos`;
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
        throw new Error(errorData.error || 'Failed to fetch logos');
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

  async deleteLogo(logoId) {
    const url = `${constants.API.HOST}/uploads/logo/${logoId}`;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 [API REQUEST] DELETE', url, { logoId });
    }
    
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
        throw new Error(errorData.error || 'Failed to delete logo');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [API RESPONSE] DELETE', url, data);
      }
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] DELETE', url, error);
      throw error;
    }
  }
}

const logoService = new LogoService();
export default logoService;