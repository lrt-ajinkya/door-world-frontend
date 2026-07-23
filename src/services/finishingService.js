import constants from "../common/constants";
import productService from "./productService";

class FinishingService {
  // Get finishings directly from API
  async getFinishings(language = 'en') {
    const url = `${constants.API.HOST}/finishing/finishings`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch finishings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getMillings(language = 'en') {
    const url = `${constants.API.HOST}/finishing/millings`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch millings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getMillingImages(language = 'en') {
    const url = `${constants.API.HOST}/finishing/milling-images`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch milling images: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getCarvings(language = 'en') {
    const url = `${constants.API.HOST}/finishing/carvings`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch carvings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get door finishings and millings
  async getDoorFinishingsAndMillings(language = 'en') {
    return productService.getProductsByCategory('door-finishings-millings', language);
  }

  // Get all finishing related data in one call
  async getAllFinishingData(language = 'en') {
    const [finishings, millings, millingImages, doorFinishings] = await Promise.all([
      this.getFinishings(language),
      this.getMillings(language),
      this.getMillingImages(language),
      this.getDoorFinishingsAndMillings(language)
    ]);

    return {
      finishings,
      millings,
      millingImages,
      doorFinishings
    };
  }
}

const finishingService = new FinishingService();
export default finishingService;