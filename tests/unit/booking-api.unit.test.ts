import axios from "@/lib/api/axios";
import { createBooking, deleteBooking, getAllBookings, getMyBookings, getServices } from "@/lib/api/booking";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxios = axios as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  delete: jest.Mock;
};

describe("unit: booking api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getServices calls services endpoint", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    await expect(getServices()).resolves.toEqual([{ id: 1 }]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/bookings/services");
  });

  it("createBooking posts booking payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: "b1" } });
    await expect(createBooking({ serviceId: "s1" })).resolves.toEqual({ id: "b1" });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/bookings", { serviceId: "s1" });
  });

  it("getMyBookings calls my bookings endpoint", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ _id: "m1" }] });
    await expect(getMyBookings()).resolves.toEqual([{ _id: "m1" }]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/bookings/me");
  });

  it("deleteBooking calls delete endpoint by id", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: { ok: true } });
    await expect(deleteBooking("42")).resolves.toEqual({ ok: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/bookings/42");
  });

  it("getAllBookings calls generic bookings endpoint", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ _id: "a1" }] });
    await expect(getAllBookings()).resolves.toEqual([{ _id: "a1" }]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/bookings");
  });
});
