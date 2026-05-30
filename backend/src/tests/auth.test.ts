import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAccountRepo = vi.hoisted(() => ({
    findByEmail: vi.fn(),
    findByPhoneNumber: vi.fn(),
    findById: vi.fn(),
    updatePassword: vi.fn(),
    createAccount: vi.fn(),
}));

const mockBcrypt = vi.hoisted(() => ({ compare: vi.fn(), hash: vi.fn() }));

vi.mock('../repositories/AccountRepository.js', () => ({
    default: vi.fn(function () { return mockAccountRepo; }),
}));
vi.mock('../repositories/CustomerRepository.js', () => ({
    default: vi.fn(function () { return {}; }),
}));
vi.mock('bcryptjs', () => ({ default: mockBcrypt }));
vi.mock('../utils/auth.js', () => ({
    issueAccessToken: vi.fn().mockReturnValue('mock-token'),
}));

import { AuthService } from '../services/AuthService.js';

const mockAccount = {
    id: 1,
    name: 'Admin Nhà Hàng',
    password: '$2a$10$hashed_password',
    role: { roleName: 'ADMIN' },
};

beforeEach(() => {
    vi.clearAllMocks();
});

// TC-001: TR01
describe('TC-001: Đăng nhập bằng email hợp lệ và mật khẩu đúng', () => {
    it('trả về accessToken, user.role, user.name', async () => {
        mockAccountRepo.findByEmail.mockResolvedValue(mockAccount);
        mockBcrypt.compare.mockResolvedValue(true);

        const result = await new AuthService().login('admin@vietbep.vn', 'pass123');

        expect(result.accessToken).toBe('mock-token');
        expect(result.user.role).toBe('ADMIN');
        expect(result.user.name).toBe('Admin Nhà Hàng');
    });
});

// TC-002: TR02
describe('TC-002: Đăng nhập bằng SĐT hợp lệ và mật khẩu đúng', () => {
    it('trả về accessToken', async () => {
        mockAccountRepo.findByPhoneNumber.mockResolvedValue(mockAccount);
        mockBcrypt.compare.mockResolvedValue(true);

        const result = await new AuthService().login('0912345678', 'Pass123!');

        expect(result.accessToken).toBe('mock-token');
    });
});

// TC-003: TR03
describe('TC-003: Email tồn tại nhưng mật khẩu sai', () => {
    it('ném lỗi "Mật khẩu không đúng. Vui lòng nhập lại!!"', async () => {
        mockAccountRepo.findByEmail.mockResolvedValue(mockAccount);
        mockBcrypt.compare.mockResolvedValue(false);

        await expect(new AuthService().login('test@gmail.com', 'SaiPass')).rejects.toThrow(
            'Mật khẩu không đúng. Vui lòng nhập lại!!'
        );
    });
});

// TC-004: TR04
describe('TC-004: Email không tồn tại trong hệ thống', () => {
    it('ném lỗi "Tài khoản không tồn tại"', async () => {
        mockAccountRepo.findByEmail.mockResolvedValue(null);

        await expect(new AuthService().login('khongtontai@gmail.com', 'BatKyPass1')).rejects.toThrow(
            'Tài khoản không tồn tại'
        );
    });
});

// TC-005: TR05
describe('TC-005: Không có dữ liệu đầu vào (identifier và password rỗng)', () => {
    it('ném lỗi "Tài khoản không tồn tại" do không tìm thấy tài khoản', async () => {
        mockAccountRepo.findByPhoneNumber.mockResolvedValue(null);

        await expect(new AuthService().login('', '')).rejects.toThrow(
            'Tài khoản không tồn tại'
        );
    });
});
