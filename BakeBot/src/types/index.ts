export interface Repository {
    id: number
    name: string
    hasReadme: boolean
  }
  
  export interface Message {
    id: string
    text: string
    sender: "user" | "ai"
  }
  
  