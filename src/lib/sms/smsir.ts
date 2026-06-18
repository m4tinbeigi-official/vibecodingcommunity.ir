import axios from 'axios'

// SMS.ir API client abstraction
// This should only be used server-side

interface SMSirConfig {
  apiKey: string
  messageId: string
}

interface SendOTPParams {
  phoneNumber: string
  otp: string
}

interface SMSirResponse {
  status: 'success' | 'error'
  message: string
  data?: any
}

export class SMSirService {
  private apiKey: string
  private messageId: string
  private baseURL = 'https://api.sms.ir/v1'

  constructor(config: SMSirConfig) {
    this.apiKey = config.apiKey
    this.messageId = config.messageId
  }

  private async sendRequest(endpoint: string, data: any): Promise<SMSirResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}${endpoint}`,
        data,
        {
          headers: {
            'Accept': 'text/plain',
            'Content-Type': 'application/json',
            'X-API-KEY': this.apiKey
          }
        }
      )

      return {
        status: 'success',
        message: 'SMS sent successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('SMS.ir API Error:', error.response?.data || error.message)
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to send SMS',
        data: error.response?.data
      }
    }
  }

  async sendOTP({ phoneNumber, otp }: SendOTPParams): Promise<SMSirResponse> {
    // Clean phone number format
    const cleanPhone = phoneNumber.replace(/\+/g, '')

    const payload = {
      mobile: cleanPhone,
      templateId: this.messageId,
      parameters: [
        {
          name: 'OTP',
          value: otp
        }
      ]
    }

    return await this.sendRequest('/send/verify', payload)
  }

  // In production, you might want to add more methods like:
  // - sendBulkSMS()
  // - checkDeliveryStatus()
  // - getCreditBalance()
}

// Create singleton instance
let smsirInstance: SMSirService | null = null

export function getSMSirService(): SMSirService | null {
  if (!process.env.SMSIR_API_KEY || !process.env.SMSIR_MESSAGE_ID) {
    console.warn('SMS.ir credentials not configured')
    return null
  }

  if (!smsirInstance) {
    smsirInstance = new SMSirService({
      apiKey: process.env.SMSIR_API_KEY,
      messageId: process.env.SMSIR_MESSAGE_ID
    })
  }

  return smsirInstance
}