import axios from "./axios";
import {
  createAdminUser,
  deleteAdminBooking,
  deleteAdminUser,
  getAdminUserById,
  listAdminBookings,
  listAdminUsers,
  updateAdminBookingStatus,
  updateAdminUser,
} from "./admin";
import { API } from "./endpoints";

jest.mock("./axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxios = axios as unknown as {
  post: jest.Mock;
  get: jest.Mock;
  put: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

const httpError = (status: number, message?: string) => ({
  response: { status, data: { message } },
});

describe("admin api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("listAdminUsers returns array from data key", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: [{ id: "u1" }] } });
    await expect(listAdminUsers()).resolves.toEqual([{ id: "u1" }]);
    expect(mockedAxios.get).toHaveBeenCalledWith(API.ADMIN.USERS.LIST);
  });

  it("listAdminUsers returns array from users key", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { users: [{ id: "u2" }] } });
    await expect(listAdminUsers()).resolves.toEqual([{ id: "u2" }]);
  });

  it("listAdminUsers retries with trailing slash on 404", async () => {
    mockedAxios.get
      .mockRejectedValueOnce(httpError(404))
      .mockResolvedValueOnce({ data: { data: [{ id: "u3" }] } });

    const result = await listAdminUsers();
    expect(result).toEqual([{ id: "u3" }]);
    expect(mockedAxios.get).toHaveBeenNthCalledWith(2, `${API.ADMIN.USERS.LIST}/`);
  });

  it("getAdminUserById unwraps data field", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: { id: "u4" } } });
    await expect(getAdminUserById("u4")).resolves.toEqual({ id: "u4" });
  });

  it("getAdminUserById returns raw data when wrapper absent", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { id: "u5" } });
    await expect(getAdminUserById("u5")).resolves.toEqual({ id: "u5" });
  });

  it("createAdminUser posts payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { created: true } });
    await expect(createAdminUser({ email: "n@x.com" })).resolves.toEqual({ created: true });
  });

  it("createAdminUser throws backend message", async () => {
    mockedAxios.post.mockRejectedValueOnce(httpError(400, "Email exists"));
    await expect(createAdminUser({ email: "n@x.com" })).rejects.toThrow("Email exists");
  });

  it("updateAdminUser uses put by default", async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: { updated: true } });
    await expect(updateAdminUser("u1", { role: "worker" })).resolves.toEqual({
      updated: true,
    });
  });

  it("updateAdminUser falls back to patch on 405", async () => {
    mockedAxios.put.mockRejectedValueOnce(httpError(405));
    mockedAxios.patch.mockResolvedValueOnce({ data: { patched: true } });
    await expect(updateAdminUser("u1", { role: "worker" })).resolves.toEqual({
      patched: true,
    });
  });

  it("deleteAdminUser calls delete endpoint", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: { ok: true } });
    await expect(deleteAdminUser("u1")).resolves.toEqual({ ok: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(API.ADMIN.USERS.DELETE("u1"));
  });

  it("listAdminBookings returns normalized and deduped rows", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          { bookingId: "b1", bookingStatus: "inprogress" },
          { bookingId: "b1", bookingStatus: "inprogress" },
        ],
      },
    });

    const result = await listAdminBookings();
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe("b1");
    expect(result[0].status).toBe("inprogress");
  });

  it("listAdminBookings returns empty when all endpoints 404", async () => {
    mockedAxios.get.mockRejectedValue(httpError(404));
    await expect(listAdminBookings()).resolves.toEqual([]);
  });

  it("updateAdminBookingStatus uses action endpoint for accepted", async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: { ok: true } });
    await expect(updateAdminBookingStatus("b1", "accepted")).resolves.toEqual({ ok: true });
    expect(mockedAxios.patch).toHaveBeenCalledWith(API.ADMIN.BOOKINGS.ACCEPT("b1"));
  });

  it("updateAdminBookingStatus falls back to status payload route", async () => {
    mockedAxios.patch
      .mockRejectedValueOnce(httpError(404))
      .mockRejectedValueOnce(httpError(404))
      .mockResolvedValueOnce({ data: { status: "updated" } });

    const result = await updateAdminBookingStatus("b2", "pending payment");
    expect(result).toEqual({ status: "updated" });
  });

  it("updateAdminBookingStatus throws hard error", async () => {
    mockedAxios.patch.mockRejectedValueOnce(httpError(500, "Server error"));
    await expect(updateAdminBookingStatus("b3", "accepted")).rejects.toEqual(
      expect.objectContaining({ response: expect.objectContaining({ status: 500 }) })
    );
  });

  it("deleteAdminBooking deletes from primary endpoint", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: { deleted: true } });
    await expect(deleteAdminBooking("b1")).resolves.toEqual({ deleted: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(API.ADMIN.BOOKINGS.BY_ID("b1"));
  });

  it("deleteAdminBooking falls back to next endpoint when first is 404", async () => {
    mockedAxios.delete
      .mockRejectedValueOnce(httpError(404))
      .mockResolvedValueOnce({ data: { deleted: true } });

    const result = await deleteAdminBooking("b9");
    expect(result).toEqual({ deleted: true });
    expect(mockedAxios.delete).toHaveBeenNthCalledWith(2, "/api/admin/bookings/b9");
  });

  it("deleteAdminBooking throws non-ignorable error", async () => {
    mockedAxios.delete.mockRejectedValueOnce(httpError(500));
    await expect(deleteAdminBooking("b10")).rejects.toEqual(
      expect.objectContaining({ response: expect.objectContaining({ status: 500 }) })
    );
  });
});
