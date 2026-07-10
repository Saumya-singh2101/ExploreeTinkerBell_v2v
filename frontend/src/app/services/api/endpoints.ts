import { api } from "./client";
import type {
  User, Course, Job, Product, Notification,
  LoginPayload, SignupPayload, AuthResponse, Paginated,
} from "@/app/types";

/**
 * Backend (Prisma) user shape returned by the auth endpoints. Only the fields the
 * frontend consumes are declared; everything is normalised into the frontend
 * `User` model via mapUser() so components never see backend field names.
 */
interface BackendUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  language?: string | null;
  location?: string | null;
  role?: string | null;
}

// Backend roles (uppercase) → frontend Role union. Centralised so every auth/user
// response maps consistently.
const ROLE_MAP: Record<string, User["role"]> = {
  LEARNER: "learner",
  EMPLOYER: "earner",
  SELLER: "seller",
  ADMIN: "all",
};

/** Central mapping from the backend user model into the frontend User type. */
export function mapUser(bu: BackendUser): User {
  return {
    id: bu.id,
    name: bu.name,
    email: bu.email ?? "",
    phone: bu.phone ?? undefined,
    language: bu.language ?? undefined,
    location: bu.location ?? undefined,
    role: bu.role ? ROLE_MAP[bu.role] ?? "all" : undefined,
  };
}

type BackendAuthData = { token: string; refresh_token?: string; user: BackendUser };

export const authApi = {
  // Real backend login (phone + password). The Phase 1 response adapter unwraps the
  // `{ success, data }` envelope, so `r.data` is the inner `{ token, user }`.
  login: (payload: LoginPayload) =>
    api.post<BackendAuthData>("/auth/login", payload).then(
      (r): AuthResponse => ({
        token: r.data.token,
        refresh_token: r.data.refresh_token,
        user: mapUser(r.data.user),
      }),
    ),
  // Real backend signup (name + phone + password required, email optional).
  signup: (payload: SignupPayload) =>
    api.post<BackendAuthData>("/auth/signup", payload).then(
      (r): AuthResponse => ({
        token: r.data.token,
        refresh_token: r.data.refresh_token,
        user: mapUser(r.data.user),
      }),
    ),
  // NOTE: `/auth/forgot-password` and `/auth/verify-otp` have no backend routes yet
  // (out of Phase 2 scope) — left untouched.
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }).then((r) => r.data),
  verifyOtp: (phone: string, otp: string) =>
    api.post<AuthResponse>("/auth/verify-otp", { phone, otp }).then((r) => r.data),
  // Stateless JWT — logout is a client-side token clear (handled in the auth store).
  // There is no server-side session to invalidate.
  logout: () => Promise.resolve(),
};

export const userApi = {
  // Current authenticated user via GET /auth/me. Backend returns `{ user }` under
  // the envelope; mapped centrally into the frontend User model.
  profile: () => api.get<{ user: BackendUser }>("/auth/me").then((r) => mapUser(r.data.user)),
  // NOTE: no backend profile-update route exists yet (belongs to a later phase);
  // path left unchanged.
  updateProfile: (payload: Partial<User>) => api.put<User>("/user/profile", payload).then((r) => r.data),
  // Backend onboarding is PATCH /auth/onboarding and persists language (+ location).
  // `role` is not part of that contract, so it is not sent — it stays a client-side
  // selection until a later phase adds server-side role onboarding.
  completeOnboarding: (payload: { language: string; role?: string }) =>
    api
      .patch<{ user: BackendUser }>("/auth/onboarding", { language: payload.language })
      .then((r) => mapUser(r.data.user)),
};

// ---- Learn / Earn / Flourish response mappers -------------------------------
// The Express controllers return Prisma rows under a `{ <resource> }` key (already
// unwrapped from the `{ success, data }` envelope by the Phase 1 interceptor).
// These helpers normalise those shapes into the frontend models in ONE place so
// components never see backend field names. Fields the backend does not track yet
// (course rating/lessons, job remote flag/skills, product rating) get neutral
// defaults — see the Phase 3 report for the full list.

interface BackendCourse {
  id: string; title: string; description?: string | null; category: string;
  language?: string | null; level?: string | null; duration?: number | null;
  price?: number | null; mediaUrl?: string | null;
}
interface BackendEnrollment {
  id: string; progress: number; completedAt?: string | null;
  paymentStatus?: string; certificateUrl?: string | null; course: BackendCourse;
}
interface BackendJob {
  id: string; title: string; description?: string | null; category: string;
  location?: string | null; jobType?: string | null;
  salaryMin?: number | null; salaryMax?: number | null; createdAt?: string;
  employer?: { id: string; name: string; employerVerified?: boolean } | null;
}
interface BackendProduct {
  id: string; name: string; description?: string | null; category: string;
  price: number; stock?: number | null; imageUrl?: string | null; createdAt?: string;
  seller?: { id: string; name: string; location?: string | null } | null;
}

const JOB_TYPE_MAP: Record<string, Job["type"]> = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  GIG: "gig",
};

export function mapCourse(c: BackendCourse): Course {
  return {
    id: c.id,
    title: c.title,
    description: c.description ?? "",
    category: c.category,
    level: (c.level ?? "BEGINNER").toLowerCase() as Course["level"],
    duration_hours: c.duration ?? 0,
    lessons_count: 0, // backend has no lessons model yet
    rating: 0, // backend Course has no aggregated rating
    reviews_count: 0,
    price: c.price ?? 0,
    language: c.language ?? undefined,
    mentor: { name: "Mentor" }, // getCourse does not include mentor details
  };
}

export function mapJob(j: BackendJob): Job {
  return {
    id: j.id,
    title: j.title,
    company: { name: j.employer?.name ?? "Employer", verified: j.employer?.employerVerified ?? false },
    location: j.location ?? "",
    remote: false, // backend Job has no remote flag
    type: JOB_TYPE_MAP[j.jobType ?? "FULL_TIME"] ?? "full-time",
    salary_min: j.salaryMin ?? undefined,
    salary_max: j.salaryMax ?? undefined,
    currency: "INR",
    posted_at: j.createdAt ?? new Date().toISOString(),
    skills: [], // backend Job has no skills array
    description: j.description ?? "",
  };
}

export function mapProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    currency: "INR",
    category: p.category,
    images: p.imageUrl ? [p.imageUrl] : [],
    seller: {
      id: p.seller?.id ?? "",
      name: p.seller?.name ?? "Seller",
      location: p.seller?.location ?? undefined,
    },
    stock: p.stock ?? undefined,
  };
}

/** Wrap a plain array into the Paginated shape the list pages expect. */
function toPage<T>(items: T[]): Paginated<T> {
  return { items, total: items.length, page: 1, per_page: items.length };
}

export const coursesApi = {
  list: (params?: { q?: string; category?: string; language?: string; page?: number }) =>
    api
      .get<{ courses: BackendCourse[] }>("/learn/courses", { params })
      .then((r) => toPage((r.data.courses ?? []).map(mapCourse))),
  get: (id: string) =>
    api.get<{ course: BackendCourse }>(`/learn/courses/${id}`).then((r) => mapCourse(r.data.course)),
  enroll: (id: string) =>
    api
      .post<{ enrollment: BackendEnrollment; requiresPayment?: boolean; price?: number }>(
        `/learn/courses/${id}/enroll`,
      )
      .then((r) => r.data),
  // The logged-in learner's enrollments (with course + progress) — used for
  // enrollment status, progress and completion state on the course detail page.
  myCourses: () =>
    api.get<{ enrollments: BackendEnrollment[] }>("/learn/my-courses").then((r) => r.data.enrollments ?? []),
  // Recommended courses. There is no dedicated recommendation route, so this reuses
  // the existing course-list endpoint, which the backend already ML-ranks. Personalised
  // recommendations would need a dedicated backend endpoint (documented limitation).
  recommended: () =>
    api.get<{ courses: BackendCourse[] }>("/learn/courses").then((r) => (r.data.courses ?? []).map(mapCourse)),
};

export const jobsApi = {
  list: (params?: { q?: string; location?: string; remote?: boolean; type?: string; page?: number }) =>
    api.get<{ jobs: BackendJob[] }>("/jobs", { params }).then((r) => toPage((r.data.jobs ?? []).map(mapJob))),
  get: (id: string) => api.get<{ job: BackendJob }>(`/jobs/${id}`).then((r) => mapJob(r.data.job)),
  // Backend expects `coverNote`; the optional note from the UI is mapped to it.
  apply: (id: string, payload: { resume_url?: string; note?: string }) =>
    api.post(`/jobs/${id}/apply`, { coverNote: payload.note }).then((r) => r.data),
  // NOTE: `/jobs/:id/save` has no backend route — saved jobs are unsupported, so the
  // JobCard bookmark stays a client-only toggle. Left for a later phase.
  save: (id: string) => api.post(`/jobs/${id}/save`).then((r) => r.data),
  // Recommended jobs — reuses the ML-ranked job-list endpoint (no dedicated route).
  recommended: () =>
    api.get<{ jobs: BackendJob[] }>("/jobs").then((r) => (r.data.jobs ?? []).map(mapJob)),
};

export const productsApi = {
  list: (params?: { q?: string; category?: string; page?: number }) =>
    api
      .get<{ products: BackendProduct[] }>("/marketplace/products", { params })
      .then((r) => toPage((r.data.products ?? []).map(mapProduct))),
  get: (id: string) =>
    api.get<{ product: BackendProduct }>(`/marketplace/products/${id}`).then((r) => mapProduct(r.data.product)),
  create: (payload: { name: string; category: string; description?: string; price: number; stock?: number; imageUrl?: string }) =>
    api.post<{ product: BackendProduct }>("/marketplace/products", payload).then((r) => mapProduct(r.data.product)),
  // Featured products — reuses the ML-ranked product-list endpoint (no dedicated route).
  featured: () =>
    api.get<{ products: BackendProduct[] }>("/marketplace/products").then((r) => (r.data.products ?? []).map(mapProduct)),
};

export const ordersApi = {
  list: () => api.get<{ orders: unknown[] }>("/marketplace/my-orders").then((r) => r.data.orders ?? []),
  // Maps the cart shape into the backend order contract
  // (`items:[{productId,quantity}]`, `shippingAddress`).
  create: (payload: { items: Array<{ product_id: string; qty: number }>; shippingAddress?: string }) =>
    api
      .post<{ order: unknown }>("/marketplace/orders", {
        items: payload.items.map((i) => ({ productId: i.product_id, quantity: i.qty })),
        shippingAddress: payload.shippingAddress,
      })
      .then((r) => r.data.order),
};

export const notificationsApi = {
  list: () => api.get<Notification[]>("/notifications").then((r) => r.data),
  markRead: (id: string) => api.post(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.post("/notifications/read-all").then((r) => r.data),
};

export const mlApi = {
  // Description generation. The ML service expects `{ keywords, category, language }`
  // and returns `{ title, description }`; keywords are derived from the product name
  // when the caller doesn't supply them. ML schema is unchanged.
  generateDescription: (payload: { product_name: string; category?: string; keywords?: string[]; language?: string }) =>
    api
      .post<{ title: string; description: string }>("/ml/generate/description", {
        keywords: payload.keywords ?? payload.product_name.split(/\s+/).filter(Boolean),
        category: payload.category ?? "",
        language: payload.language ?? "en",
      })
      .then((r) => r.data),
  // Pricing suggestion. Matches the ML contract `{ category, materialCost,
  // hoursOfWork, location }` → `{ suggestedPrice, suggestedPriceMin, suggestedPriceMax }`.
  predictPrice: (payload: { category: string; materialCost: number; hoursOfWork: number; location?: string }) =>
    api
      .post<{ suggestedPrice: number; suggestedPriceMin: number; suggestedPriceMax: number }>(
        "/ml/pricing/suggest",
        payload,
      )
      .then((r) => r.data),
  // Skill extraction from free text (bio). Backend `/ml/extract/skills-from-bio`
  // → ML `/extract/skills-from-bio`. Returns canonical skill names.
  extractSkills: (bioText: string) =>
    api
      .post<{ extractedSkills: string[] }>("/ml/extract/skills-from-bio", { bioText })
      .then((r) => r.data.extractedSkills ?? []),
  // Text moderation for user-generated content (product listings, etc.).
  // Backend `/ml/moderate/text` → ML `/moderate/text`.
  moderateText: (text: string, context = "product_listing") =>
    api
      .post<{ flagged: boolean; reason: string; confidence: number }>("/ml/moderate/text", { text, context })
      .then((r) => r.data),
  // Image moderation integration point. Backend `/ml/moderate/image` exists but the
  // ML side is currently a pass-by-default stub and no image-upload workflow is wired
  // in the UI yet — see the Phase 4 report. Kept here so an upload flow can call it.
  moderateImage: (imageUrl: string) =>
    api
      .post<{ flagged: boolean; reason: string; confidence: number }>("/ml/moderate/image", { imageUrl })
      .then((r) => r.data),
  // NOTE: `/ml/recommend` has no backend passthrough (recommendation is internal
  // only) — see Phase 2.
  recommend: (payload: { context: string }) =>
    api.post<{ items: Array<{ id: string; title: string; type: string }> }>("/ml/recommend", payload).then((r) => r.data),
};
