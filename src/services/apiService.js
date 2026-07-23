import authService from './authService';
import specificationService from './specificationService';
import draftService from './draftService';
import productService from './productService';
import userService from './userService';
import translationService from './translationService';
import doorComponentsService from './doorComponentsService';
import hardwareService from './hardwareService';
import finishingService from './finishingService';
import accessoriesService from './accessoriesService';
import glassService from './glassService';

class ApiService {
  constructor() {
    this.auth = authService;
    this.specifications = specificationService;
    this.drafts = draftService;
    this.products = productService;
    this.users = userService;
    this.translations = translationService;
    this.doorComponents = doorComponentsService;
    this.hardware = hardwareService;
    this.finishing = finishingService;
    this.accessories = accessoriesService;
    this.glass = glassService;
  }

  // Initialize authentication state
  async initialize() {
    return await this.auth.initialize();
  }

  // Get current authenticated user
  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.auth.isAuthenticated();
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;