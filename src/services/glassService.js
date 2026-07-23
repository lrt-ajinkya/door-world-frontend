import constants from "../common/constants";
import productService from "./productService";

class GlassService {
  // Get glass types directly from API
  async getGlassTypes(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-types`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass types: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getGlassTypeNew(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-type-new`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass type new: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getGlassNew(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-new`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass new: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getGlassAddonTypes(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-addon-types`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass addon types: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getGlassAddon(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-addon`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass addon: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getGlassFilm(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-film`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass film: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Bulletproof glass directly from API
  async getGlassBulletProofSizes(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-bulletproof-sizes`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass bulletproof sizes: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getGlassShapeBulletproof(language = 'en') {
    const url = `${constants.API.HOST}/glass/glass-shape-bulletproof`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch glass shape bulletproof: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get all glass related data in one call
  async getAllGlassData(language = 'en') {
    const [
      glassTypes,
      glassTypeNew,
      glassNew,
      glassAddonTypes,
      glassAddon,
      glassFilm,
      bulletproofSizes,
      bulletproofShapes
    ] = await Promise.all([
      this.getGlassTypes(language),
      this.getGlassTypeNew(language),
      this.getGlassNew(language),
      this.getGlassAddonTypes(language),
      this.getGlassAddon(language),
      this.getGlassFilm(language),
      this.getGlassBulletProofSizes(language),
      this.getGlassShapeBulletproof(language)
    ]);

    return {
      glassTypes,
      glassTypeNew,
      glassNew,
      glassAddonTypes,
      glassAddon,
      glassFilm,
      bulletproofSizes,
      bulletproofShapes
    };
  }
}

const glassService = new GlassService();
export default glassService;