import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { 
  GameRecord, 
  PlayerInfo, 
  GameData, 
  ScrapingConfig, 
  ScrapingResult, 
  ApiResponse,
  GameQueryParams 
} from './types'

// 默认配置
const DEFAULT_CONFIG: ScrapingConfig = {
  baseUrl: 'https://weiqi-api.example.com', // 示例API地址
  timeout: 10000,
  retries: 3,
  userAgent: 'WeiqiWebApp/1.0 (Mozilla/5.0)'
}

/**
 * 围棋数据抓取服务类
 */
export class WeiqiApiService {
  private client: AxiosInstance
  private config: ScrapingConfig

  constructor(config: Partial<ScrapingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent,
        'Content-Type': 'application/json',
        ...this.config.headers
      }
    })

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const { config, response } = error
        
        // 如果没有配置或已经重试过，直接拒绝
        if (!config || config.__retryCount >= this.config.retries) {
          return Promise.reject(error)
        }

        // 设置重试次数
        config.__retryCount = config.__retryCount || 0
        config.__retryCount += 1

        // 延迟重试
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * config.__retryCount)
        )
        
        return this.client(config)
      }
    )
  }

  /**
   * 搜索棋谱
   */
  async searchGames(params: GameQueryParams): Promise<ScrapingResult<GameRecord[]>> {
    try {
      const response: ApiResponse<GameRecord[]> = await this.client.get('/api/games', { params })
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    }
  }

  /**
   * 获取指定棋谱详情
   */
  async getGame(gameId: string): Promise<ScrapingResult<GameRecord>> {
    try {
      const response: ApiResponse<GameRecord> = await this.client.get(`/api/games/${gameId}`)
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    }
  }

  /**
   * 搜索玩家信息
   */
  async searchPlayers(query: string): Promise<ScrapingResult<PlayerInfo[]>> {
    try {
      const response: ApiResponse<PlayerInfo[]> = await this.client.get('/api/players', {
        params: { q: query }
      })
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    }
  }

  /**
   * 获取玩家详细信息
   */
  async getPlayer(playerId: string): Promise<ScrapingResult<PlayerInfo>> {
    try {
      const response: ApiResponse<PlayerInfo> = await this.client.get(`/api/players/${playerId}`)
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'weiqi-api'
      }
    }
  }

  /**
   * 从URL抓取棋谱数据
   */
  async scrapeGameFromUrl(url: string): Promise<ScrapingResult<GameData>> {
    try {
      const response: ApiResponse<GameData> = await this.client.post('/api/scrape', { url })
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'url-scraping'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'url-scraping'
      }
    }
  }

  /**
   * 批量导入棋谱
   */
  async importGames(urls: string[]): Promise<ScrapingResult<GameData[]>> {
    try {
      const response: ApiResponse<GameData[]> = await this.client.post('/api/import', { urls })
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'batch-import'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'batch-import'
      }
    }
  }

  /**
   * 导出棋谱为SGF格式
   */
  async exportToSgf(gameId: string): Promise<ScrapingResult<string>> {
    try {
      const response: ApiResponse<string> = await this.client.get(`/api/games/${gameId}/export/sgf`)
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'sgf-export'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'sgf-export'
      }
    }
  }

  /**
   * 获取API健康状态
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/api/health')
      return true
    } catch {
      return false
    }
  }

  /**
   * 获取API版本信息
   */
  async getVersion(): Promise<ScrapingResult<{ version: string; build: string }>> {
    try {
      const response: ApiResponse<{ version: string; build: string }> = await this.client.get('/api/version')
      
      return {
        success: true,
        data: response.data,
        timestamp: Date.now(),
        source: 'api-info'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        source: 'api-info'
      }
    }
  }
}

// 创建默认实例
export const weiqiApiService = new WeiqiApiService()