import { ApiService } from "./api"

export interface CountData {
  professionals?: number
  posts?: number
  likes?: number
  comments?: number
}

export interface AdminProfession {
  id: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt: string
  _count?: CountData
}

export interface AdminCommunity {
  id: string
  name: string
  description?: string | null
  color: string
  icon: string
  createdAt: string
  updatedAt: string
  _count?: CountData
}

export interface AdminAuthor {
  id: string
  name: string
  email: string
  profileImage?: string | null
}

export interface AdminPost {
  id: string
  title: string
  content: string
  attachedImage?: string | null
  authorId: string
  communityId: string
  createdAt: string
  updatedAt: string
  author?: AdminAuthor
  community?: AdminCommunity
  postHashtags?: Array<{ hashtag: { name: string } }>
  _count?: CountData
}

export interface AdminReport {
  id: string
  reason: string
  description?: string | null
  userId: string
  targetId: string
  targetType: string
  createdAt: string
  updatedAt: string
  user?: AdminAuthor
}

export interface ProfessionPayload {
  name: string
  description?: string
}

export interface CommunityPayload {
  name: string
  description?: string
  color: string
  icon: string
}

export interface PostPayload {
  title: string
  content: string
  authorId: string
  communityId: string
  image: string
  attachedImage?: string
  hashtags?: string[]
}

export interface ReportPayload {
  reason: string
  description?: string
  userId: string
  targetId: string
  targetType: string
}

export class AdminContentService {
  static getProfessions() {
    return ApiService.get<AdminProfession[]>("/professions")
  }

  static createProfession(data: ProfessionPayload) {
    return ApiService.post<AdminProfession>("/professions", data)
  }

  static updateProfession(id: string, data: Partial<ProfessionPayload>) {
    return ApiService.patch<AdminProfession>(`/professions/${id}`, data)
  }

  static deleteProfession(id: string) {
    return ApiService.delete<AdminProfession>(`/professions/${id}`)
  }

  static getCommunities() {
    return ApiService.get<AdminCommunity[]>("/communities")
  }

  static createCommunity(data: CommunityPayload) {
    return ApiService.post<AdminCommunity>("/communities", data)
  }

  static updateCommunity(id: string, data: Partial<CommunityPayload>) {
    return ApiService.patch<AdminCommunity>(`/communities/${id}`, data)
  }

  static deleteCommunity(id: string) {
    return ApiService.delete<AdminCommunity>(`/communities/${id}`)
  }

  static getPostAuthors() {
    return ApiService.get<AdminAuthor[]>("/post-authors")
  }

  static getPosts() {
    return ApiService.get<AdminPost[]>("/posts")
  }

  static createPost(data: PostPayload) {
    return ApiService.post<AdminPost>("/posts", data)
  }

  static updatePost(id: string, data: Partial<PostPayload>) {
    return ApiService.patch<AdminPost>(`/posts/${id}`, data)
  }

  static deletePost(id: string) {
    return ApiService.delete<AdminPost>(`/posts/${id}`)
  }

  static getReports() {
    return ApiService.get<AdminReport[]>("/reports")
  }

  static createReport(data: ReportPayload) {
    return ApiService.post<AdminReport>("/reports", data)
  }

  static updateReport(id: string, data: Partial<ReportPayload>) {
    return ApiService.patch<AdminReport>(`/reports/${id}`, data)
  }

  static deleteReport(id: string) {
    return ApiService.delete<AdminReport>(`/reports/${id}`)
  }
}
