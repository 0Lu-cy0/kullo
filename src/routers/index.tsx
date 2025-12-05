const CA_NHAN = 'ca_nhan'
const ROUTER = {
  HOME: '/',

  TONG_QUAN: '/admin/tong_quan',
  THONG_TIN_TAI_KHOAN: `/${CA_NHAN}`,
  DANG_NHAP: '/dang-nhap',
  DANG_KY: '/dang-ky',
  DU_AN: '/du-an/:id',
  BANG_DIEU_KHIEN: '/bang-dieu-khien',
  ACCEPT_INVITE: '/invites/:inviteId/accept',
  THANH_VIEN: '/admin/thanh-vien',
  SETTINGS: '/settings',
  PROFILE: `/profile`,
  // Router
  // PRINT: "/print",
}
export default ROUTER
