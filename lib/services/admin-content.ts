import { ApiService } from "./api"

export interface CountData {
  professionals?: number
  posts?: number
  likes?: number
  comments?: number
  stores?: number
  wellnesses?: number
}

export interface AdminProfession {
  id: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt: string
  _count?: CountData
}

export interface AdminStoreCategory {
  id: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt: string
  _count?: CountData
}

export interface AdminWellnessCategory {
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

export interface StoreCategoryPayload {
  name: string
  description?: string
}

export interface WellnessCategoryPayload {
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

  static getStoreCategories() {
    return ApiService.get<AdminStoreCategory[]>("/store-categories")
  }

  static createStoreCategory(data: StoreCategoryPayload) {
    return ApiService.post<AdminStoreCategory>("/store-categories", data)
  }

  static updateStoreCategory(id: string, data: Partial<StoreCategoryPayload>) {
    return ApiService.patch<AdminStoreCategory>(`/store-categories/${id}`, data)
  }

  static deleteStoreCategory(id: string) {
    return ApiService.delete<AdminStoreCategory>(`/store-categories/${id}`)
  }

  static getWellnessCategories() {
    return ApiService.get<AdminWellnessCategory[]>("/wellness-categories")
  }

  static createWellnessCategory(data: WellnessCategoryPayload) {
    return ApiService.post<AdminWellnessCategory>("/wellness-categories", data)
  }

  static updateWellnessCategory(id: string, data: Partial<WellnessCategoryPayload>) {
    return ApiService.patch<AdminWellnessCategory>(`/wellness-categories/${id}`, data)
  }

  static deleteWellnessCategory(id: string) {
    return ApiService.delete<AdminWellnessCategory>(`/wellness-categories/${id}`)
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
