import constants from "../common/constants";
import authService from "./authService";
import logger from "../utils/logger";

class ProductService {
  async getCategories() {
    const url = `${constants.API.HOST}/products/categories`;
    logger.api('GET', url);
    
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        logger.api('GET', url, null, null, null, errorData);
        throw new Error(errorData.error || 'Failed to fetch categories');
      }

      const data = await response.json();
      logger.api('GET', url, null, null, data);
      return data;
    } catch (error) {
      logger.api('GET', url, null, null, null, error.message);
      throw error;
    }
  }

  async getProductsByCategory(categorySlug, language = 'en') {
    const params = new URLSearchParams({ language });
    const url = `${constants.API.HOST}/products/categories/${categorySlug}/products?${params}`;
    logger.api('GET', url, { categorySlug, language });
    
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        logger.api('GET', url, { categorySlug, language }, null, null, errorData);
        throw new Error(errorData.error || 'Failed to fetch products by category');
      }

      const data = await response.json();
      logger.api('GET', url, { categorySlug, language }, null, data);
      return data;
    } catch (error) {
      logger.api('GET', url, { categorySlug, language }, null, null, error.message);
      throw error;
    }
  }

  async getProductById(productId, language = 'en') {
    const params = new URLSearchParams({ language });
    
    const response = await fetch(`${constants.API.HOST}/products/${productId}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch product');
    }

    return response.json();
  }

  async searchProducts(searchTerm, language = 'en', category = null) {
    const params = new URLSearchParams({ language });
    if (category) params.append('category', category);
    
    const response = await fetch(`${constants.API.HOST}/products/search/${searchTerm}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search products');
    }

    return response.json();
  }

  async getProductsByGroup(group, language = 'en') {
    const params = new URLSearchParams({ language });
    
    const response = await fetch(`${constants.API.HOST}/products/groups/${group}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch products by group');
    }

    return response.json();
  }

  async getGlazingTypes() {
    const response = await fetch(`${constants.API.HOST}/products/glazings/types`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch glazing types');
    }

    return response.json();
  }

  async getProductsWithGlazing(glazingCode, language = 'en') {
    const params = new URLSearchParams({ language });
    
    const response = await fetch(`${constants.API.HOST}/products/glazings/${glazingCode}/products?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch products with glazing');
    }

    return response.json();
  }

  // Admin methods (require authentication and admin privileges)
  async createProduct(productData) {
    const response = await fetch(`${constants.API.HOST}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create product');
    }

    return response.json();
  }

  async updateProduct(productId, productData) {
    const response = await fetch(`${constants.API.HOST}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update product');
    }

    return response.json();
  }

  async deleteProduct(productId) {
    const response = await fetch(`${constants.API.HOST}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete product');
    }

    return response.json();
  }

  // Helper methods for common product groups used in the application
  async getClassicDimensions(language = 'en') {
    return this.getProductsByGroup('classic-dimensions', language);
  }

  async getMaxDimensions(language = 'en') {
    return this.getProductsByGroup('max-dimensions', language);
  }

  async getAllFinishings(language = 'en') {
    return this.getProductsByGroup('all-finishings', language);
  }

  async getMillings(language = 'en') {
    return this.getProductsByGroup('millings', language);
  }

  async getDoorTypePrices(language = 'en') {
    return this.getProductsByGroup('door-type-prices', language);
  }
}

const productService = new ProductService();
export default productService;