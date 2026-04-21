// Multi-Provider AI Abstraction Layer
// Supports: Claude (Anthropic), Gemini (Google), DeepSeek

export interface AIProvider {
  name: string;
  displayName: string;
  generateContent(params: GenerateParams): Promise<GenerateResult>;
}

export interface GenerateParams {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateResult {
  content: string;
  provider: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
}

export interface ProductContext {
  name: string;
  category: string;
  material?: string;
  origin?: string;
  warrantyYears?: number;
  priceRange?: string;
  description?: string;
}

// Content generation prompt templates
export const CONTENT_TEMPLATES = {
  product_comparison: (product1: string, product2: string) => `
Bạn là chuyên gia nha khoa tại Việt Nam. Hãy viết bài so sánh chi tiết giữa ${product1} và ${product2}.
Bài viết phải:
- Viết bằng tiếng Việt, chuyên nghiệp nhưng dễ hiểu
- Bao gồm: ưu điểm, nhược điểm, ứng dụng lâm sàng, giá cả
- Phù hợp cho đối tượng là kỹ thuật viên labo nha khoa
- Kết luận: khi nào nên dùng sản phẩm nào
- Độ dài: 800-1200 từ
`,

  product_highlight: (context: ProductContext) => `
Bạn là chuyên gia marketing nha khoa. Hãy viết bài giới thiệu sản phẩm "${context.name}" của Alpha Digital Center.

Thông tin sản phẩm:
- Danh mục: ${context.category}
- Chất liệu: ${context.material || 'N/A'}
- Xuất xứ: ${context.origin || 'N/A'}
- Bảo hành: ${context.warrantyYears || 'N/A'} năm

Bài viết phải:
- Viết bằng tiếng Việt, tone chuyên nghiệp
- Nhấn mạnh chất lượng và công nghệ gia công
- Phù hợp để đăng blog và chia sẻ trên Facebook
- Có CTA: liên hệ Alpha Digital Center để đặt hàng
- Độ dài: 500-800 từ
`,

  facebook_post: (topic: string) => `
Viết 1 bài Facebook post ngắn gọn về chủ đề: "${topic}" cho Alpha Digital Center.
- Tone: chuyên nghiệp, thân thiện
- Độ dài: 150-300 từ
- Có emoji phù hợp (không quá nhiều)
- Có CTA rõ ràng
- Hashtags liên quan (3-5 tags)
`,

  recruitment: (position: string, department: string) => `
Viết bài tuyển dụng cho vị trí "${position}" tại phòng ${department} của Alpha Digital Center.

Thông tin công ty:
- Alpha Digital Center là labo nha khoa chuyên gia công sản phẩm bán thành phẩm
- Địa chỉ: 242/12 Phạm Văn Hai, Q. Tân Bình, TP.HCM
- Quy mô: ~50 nhân sự

Bài viết phải:
- Mô tả công việc rõ ràng
- Yêu cầu ứng viên
- Quyền lợi hấp dẫn
- Hướng dẫn ứng tuyển
- Tone: chuyên nghiệp, hấp dẫn
`,

  monthly_promo: (month: string, products: string) => `
Viết bài khuyến mãi tháng ${month} cho Alpha Digital Center.
Sản phẩm khuyến mãi: ${products}

Bài viết phải:
- Tạo cảm giác urgency
- Nêu rõ ưu đãi
- CTA: liên hệ ngay
- Phù hợp đăng Facebook + Blog
- Độ dài: 300-500 từ
`,
} as const;

export type ContentTemplateKey = keyof typeof CONTENT_TEMPLATES;
