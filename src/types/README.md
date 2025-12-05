src/
└── types/
├── env.d.ts # Khai báo các biến môi trường (module augmentation)
├── index.ts # Xuất gộp tất cả types cho tiện import
├── auth.ts # Các type liên quan authentication (user, token…)
├── api/ # Loại riêng cho các API response/request
│ ├── product.ts
│ ├── order.ts
│ └── user.ts
├── models/ # Các model/domain type dùng chung
│ ├── User.ts
│ ├── Product.ts
│ └── Order.ts
├── enums/ # Các enum, định nghĩa một tập hợp các hằng số có tên
│ ├── Role.ts
│ └── Status.ts
└── utils/ # Các helper type (utility types, generics…)
└── index.ts
=====================================================================================
✅ Khi nào nên đưa type vào types/?
Loại type Có nên đưa vào types/? Giải thích

✅ API Models ✔️ Nên VD: User, Product, Order, LoginRequest, dùng ở nhiều nơi
✅ Enum (trạng thái, quyền, loại) ✔️ Nên VD: OrderStatus, UserRole, Gender
✅ Shared Utility Type ✔️ Nên VD: DeepPartial<T>, Nullable<T>, PaginationMeta
❌ Component Props (cục bộ) ❌ Không cần VD: LayoutProps, ButtonProps, dùng trong 1 component duy nhất
❌ type logic nội bộ trong service ❌ Không cần VD: type dùng tạm trong 1 hàm, không tái sử dụng
⛔ Generated Types (OpenAPI...) 🚫 Không nên đưa thủ công Nên để ở types/generated/ hoặc tách riêng
