export type MessageType = 'text'
export type MessageStatus = 'sending' | 'sent' | 'failed'

declare namespace ApiResponse {
  interface User {
    user_id: number;
    user_name: string;
  }

  interface Message {
    message_id: string;
    content: string;
    created_at: string;
    user_id: number;
  }
}