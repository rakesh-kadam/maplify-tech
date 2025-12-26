import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Board,
  BoardMetadata,
  CreateBoardRequest,
  UpdateBoardRequest,
} from '@maplify-tech/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async logout(): Promise<void> {
    await this.request('/api/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/api/auth/me');
  }

  // Boards
  async getBoards(): Promise<{ boards: BoardMetadata[] }> {
    return this.request('/api/boards');
  }

  async getBoard(id: string): Promise<{ board: Board }> {
    return this.request(`/api/boards/${id}`);
  }

  async createBoard(data: CreateBoardRequest): Promise<{ board: Board }> {
    return this.request('/api/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: UpdateBoardRequest): Promise<{ board: Board }> {
    return this.request(`/api/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string): Promise<void> {
    await this.request(`/api/boards/${id}`, { method: 'DELETE' });
  }

  async duplicateBoard(id: string): Promise<{ board: Board }> {
    return this.request(`/api/boards/${id}/duplicate`, { method: 'POST' });
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const api = new ApiClient();
