/**
 * API client for communicating with the backend.
 */

import axios, { AxiosInstance } from 'axios';
import type {
  Landscape,
  LandscapeListItem,
  LandscapeResponse,
  PositionUpdates,
} from '@/types/landscape';

class LandscapeAPI {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * List all available landscapes.
   */
  async listLandscapes(): Promise<LandscapeListItem[]> {
    const response = await this.client.get<LandscapeListItem[]>('/landscapes');
    return response.data;
  }

  /**
   * Get a specific landscape by ID.
   */
  async getLandscape(landscapeId: string): Promise<LandscapeResponse> {
    const response = await this.client.get<LandscapeResponse>(
      `/landscapes/${landscapeId}`
    );
    return response.data;
  }

  /**
   * Create a new landscape.
   */
  async createLandscape(
    landscapeId: string,
    yamlContent: string
  ): Promise<void> {
    await this.client.post(`/landscapes/${landscapeId}`, yamlContent, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  /**
   * Update an existing landscape.
   */
  async updateLandscape(
    landscapeId: string,
    yamlContent: string
  ): Promise<void> {
    await this.client.put(`/landscapes/${landscapeId}`, yamlContent, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  /**
   * Update system positions in a landscape.
   */
  async updatePositions(
    landscapeId: string,
    updates: PositionUpdates
  ): Promise<void> {
    await this.client.patch(`/landscapes/${landscapeId}/positions`, updates);
  }

  /**
   * Delete a landscape.
   */
  async deleteLandscape(landscapeId: string): Promise<void> {
    await this.client.delete(`/landscapes/${landscapeId}`);
  }

  /**
   * Validate YAML content without saving.
   */
  async validateYaml(yamlContent: string): Promise<{
    valid: boolean;
    message?: string;
    error?: string;
  }> {
    const response = await this.client.post(
      '/landscapes/validate',
      yamlContent,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
    return response.data;
  }
}

// Export singleton instance
export const api = new LandscapeAPI();
export default api;
