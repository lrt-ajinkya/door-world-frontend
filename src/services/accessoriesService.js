import constants from "../common/constants";
import productService from "./productService";

class AccessoriesService {
  // Get architraves directly from API
  async getArchitraves(language = 'en') {
    const url = `${constants.API.HOST}/accessories/architraves`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch architraves: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get thresholds directly from API
  async getThresholds(language = 'en') {
    const url = `${constants.API.HOST}/accessories/thresholds`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch thresholds: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getThresholdOptions(language = 'en') {
    const url = `${constants.API.HOST}/accessories/threshold-options`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch threshold options: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get other accessories directly from API
  async getOtherAccessories(language = 'en') {
    const url = `${constants.API.HOST}/accessories/other-accessories`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch other accessories: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get all accessories in one call
  async getAllAccessories(language = 'en') {
    const [architraves, thresholds, thresholdOptions, other] = await Promise.all([
      this.getArchitraves(language),
      this.getThresholds(language),
      this.getThresholdOptions(language),
      this.getOtherAccessories(language)
    ]);

    return {
      architraves,
      thresholds,
      thresholdOptions,
      other
    };
  }
}

const accessoriesService = new AccessoriesService();
export default accessoriesService;