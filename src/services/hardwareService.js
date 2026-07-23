import constants from "../common/constants";
import productService from "./productService";

class HardwareService {
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

  async getHingeAccessories(language = 'en') {
    const url = `${constants.API.HOST}/hardware/hinge-accessories`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hinge accessories: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getHingeCaps(language = 'en') {
    const url = `${constants.API.HOST}/hardware/hinge-caps`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hinge caps: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getHingeCapFinishings(language = 'en') {
    const url = `${constants.API.HOST}/hardware/hinge-cap-finishings`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hinge cap finishings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get handles directly from API
  async getHandles(language = 'en') {
    const url = `${constants.API.HOST}/hardware/handles`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch handles: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get locks (main, extra, smart, easy) directly from API
  async getMainLocks(language = 'en') {
    const url = `${constants.API.HOST}/hardware/main-locks`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch main locks: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getExtraLocks(language = 'en') {
    const url = `${constants.API.HOST}/hardware/extra-locks`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch extra locks: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getLocksEasy(language = 'en') {
    const url = `${constants.API.HOST}/hardware/locks-easy`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch locks easy: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getLocksSmart(language = 'en') {
    const url = `${constants.API.HOST}/hardware/locks-smart`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch locks smart: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get lock accessories directly from API
  async getMainLockAccessories(language = 'en') {
    const url = `${constants.API.HOST}/hardware/main-lock-accessories`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch main lock accessories: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getLocksEasyAccessories(language = 'en') {
    const url = `${constants.API.HOST}/hardware/locks-easy-accessories`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch locks easy accessories: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getLocksSmartAccessories(language = 'en') {
    const url = `${constants.API.HOST}/hardware/locks-smart-accessories`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch locks smart accessories: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get cylinders directly from API
  async getCylinders(language = 'en') {
    const url = `${constants.API.HOST}/hardware/cylinders`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cylinders: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  async getExtraCylinders(language = 'en') {
    const url = `${constants.API.HOST}/hardware/extra-cylinders`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch extra cylinders: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Get electric strikes directly from API
  async getElectricStrikes(language = 'en') {
    const url = `${constants.API.HOST}/hardware/electric-strikes`;
    console.log('🚀 [API REQUEST] GET', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch electric strikes: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [API RESPONSE] GET', url, data);
      return data;
    } catch (error) {
      console.error('❌ [API ERROR] GET', url, error);
      throw error;
    }
  }

  // Helper methods for commonly used hardware
  async getAllHardwareForHinges(language = 'en') {
    const [hinges, accessories, caps, finishings] = await Promise.all([
      this.getHinges(language),
      this.getHingeAccessories(language),
      this.getHingeCaps(language),
      this.getHingeCapFinishings(language)
    ]);

    return { hinges, accessories, caps, finishings };
  }

  async getAllLocks(language = 'en') {
    const [main, extra, easy, smart] = await Promise.all([
      this.getMainLocks(language),
      this.getExtraLocks(language), 
      this.getLocksEasy(language),
      this.getLocksSmart(language)
    ]);

    return { main, extra, easy, smart };
  }
}

const hardwareService = new HardwareService();
export default hardwareService;