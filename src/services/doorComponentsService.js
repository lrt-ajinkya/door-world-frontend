import constants from "../common/constants";
import productService from "./productService";

class DoorComponentsService {
  // Get door types directly from API
  async getDoorTypes(language = 'en') {
    const url = `${constants.API.HOST}/door-components/door-types-actual`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch door types: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get door models directly from API
  async getDoorModels(language = 'en') {
    const url = `${constants.API.HOST}/door-components/door-models`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch door models: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get door colors by type (PVC, stained, standard metal)
  async getDoorColors(type, language = 'en') {
    const url = `${constants.API.HOST}/door-components/door-colors?type=${type}`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch door colors for ${type}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get dimensions by door model
  async getDimensions(doorModel, language = 'en') {
    if (doorModel === 'classic') {
      return productService.getClassicDimensions(language);
    } else if (doorModel === 'max') {
      return productService.getMaxDimensions(language);
    } else {
      // Generic dimensions call
      return productService.getProductsByCategory(`dimensions${doorModel}`, language);
    }
  }

  // Get exploitation conditions directly from API
  async getExploitationConditions(language = 'en') {
    const url = `${constants.API.HOST}/door-components/exploitation-conditions`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch exploitation conditions: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get door type prices directly from API
  async getDoorTypePrices(language = 'en') {
    const url = `${constants.API.HOST}/door-components/door-type-prices`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch door type prices: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get standard metal colors
  async getStandardMetalColors(language = 'en') {
    return this.getDoorColors('standard_metal', language);
  }

  // Get PVC colors  
  async getPvcColors(language = 'en') {
    return this.getDoorColors('pvc', language);
  }

  // Get stained colors
  async getStainedColors(language = 'en') {
    return this.getDoorColors('stained', language);
  }

  // Get bulletproof models directly from API
  async getBulletproofModels(language = 'en') {
    const url = `${constants.API.HOST}/door-components/bulletproof-models`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bulletproof models: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get door openings directly from API
  async getDoorOpenings(language = 'en') {
    const url = `${constants.API.HOST}/door-components/door-openings`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch door openings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get hinges directly from API
  async getHinges(language = 'en') {
    const url = `${constants.API.HOST}/hardware/hinges`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hinges: ${response.statusText}`);
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

const doorComponentsService = new DoorComponentsService();
export default doorComponentsService;