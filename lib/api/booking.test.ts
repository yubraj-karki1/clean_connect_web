import axios from "./axios";
import {
  acceptJob,
  completeJob,
  createBooking,
  deleteBooking,
  getAllBookings,
  getAvailableJobs,
  getCustomerNotifications,
  getMyBookings,
  getServices,
  getWorkerBookingFeed,
  getWorkerJobs,
  getWorkerNotifications,
} from "./booking";

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

const httpError = (status: number) => ({ response: { status } });

describe("booking api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (global as any).document;
  });

  it("getServices returns service data", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    await expect(getServices()).resolves.toEqual([{ id: 1 }]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/bookings/services");
  });

  it("createBooking posts booking payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: "b1" } });
    await expect(createBooking({ serviceId: "s1" })).resolves.toEqual({ id: "b1" });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/bookings", { serviceId: "s1" });
  });

  it("getMyBookings returns bookings", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ _id: "1" }] });
    await expect(getMyBookings()).resolves.toEqual([{ _id: "1" }]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/bookings/me");
  });

  it("deleteBooking calls delete by id", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: { ok: true } });
    await expect(deleteBooking("42")).resolves.toEqual({ ok: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/bookings/42");
  });

  it("getAllBookings calls generic bookings endpoint", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ _id: "x" }] });
    await expect(getAllBookings()).resolves.toEqual([{ _id: "x" }]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/bookings");
  });

  it("getAvailableJobs returns open unassigned rows", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { _id: "a", status: "pending", workerId: null },
        { _id: "b", status: "completed", workerId: null },
      ],
    });

    const result = await getAvailableJobs();
    expect(result.data).toHaveLength(1);
    expect(result.data[0]._id).toBe("a");
  });

  it("getAvailableJobs skips assigned worker rows", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ _id: "a", status: "pending", workerId: "worker-1" }],
    });
    mockedAxios.get.mockRejectedValue(httpError(404));

    const result = await getAvailableJobs();
    expect(result.data).toEqual([]);
  });

  it("getAvailableJobs throws unauthorized message when only 401/403 happen", async () => {
    mockedAxios.get.mockRejectedValue(httpError(401));
    await expect(getAvailableJobs()).rejects.toThrow(
      "Unauthorized to load available jobs. Please login again as worker."
    );
  });

  it("getAvailableJobs returns empty list for only ignorable errors", async () => {
    mockedAxios.get.mockRejectedValue(httpError(404));
    await expect(getAvailableJobs()).resolves.toEqual({ data: [] });
  });

  it("getWorkerJobs filters by current worker id from cookie", async () => {
    (global as any).document = {
      cookie: "user_data=%7B%22_id%22%3A%22worker-7%22%7D",
    };
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { _id: "1", workerId: "worker-7", status: "accepted" },
        { _id: "2", workerId: "worker-9", status: "accepted" },
      ],
    });

    const result = await getWorkerJobs();
    expect(result.data).toHaveLength(1);
    expect(result.data[0]._id).toBe("1");
  });

  it("getWorkerJobs returns empty when no match", async () => {
    (global as any).document = {
      cookie: "user_data=%7B%22_id%22%3A%22worker-7%22%7D",
    };
    mockedAxios.get.mockResolvedValue({ data: [{ _id: "1", workerId: "worker-2" }] });

    const result = await getWorkerJobs();
    expect(result.data).toEqual([]);
  });

  it("acceptJob calls patch endpoint", async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: { ok: true } });
    await expect(acceptJob("99")).resolves.toEqual({ ok: true });
    expect(mockedAxios.patch).toHaveBeenCalledWith("/api/bookings/99/accept");
  });

  it("completeJob calls patch endpoint", async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: { done: true } });
    await expect(completeJob("88")).resolves.toEqual({ done: true });
    expect(mockedAxios.patch).toHaveBeenCalledWith("/api/bookings/88/complete");
  });

  it("getWorkerBookingFeed returns normalized rows", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [{ bookingId: "bk1", bookingStatus: "open" }] },
    });

    const result = await getWorkerBookingFeed();
    expect(result.data).toHaveLength(1);
    expect(result.data[0]._id).toBe("bk1");
    expect(result.data[0].status).toBe("open");
  });

  it("getWorkerNotifications builds unassigned open notification", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "bk1",
          status: "pending",
          workerId: null,
          serviceId: { title: "Deep Clean" },
          createdAt: "2026-01-01",
        },
      ],
    });

    const result = await getWorkerNotifications();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe("booking-open-bk1");
    expect(result.data[0].message).toContain("Deep Clean");
  });

  it("getWorkerNotifications sorts newest first", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { _id: "old", status: "pending", createdAt: "2026-01-01" },
        { _id: "new", status: "pending", createdAt: "2026-02-01" },
      ],
    });

    const result = await getWorkerNotifications();
    expect(result.data[0].bookingId).toBe("new");
    expect(result.data[1].bookingId).toBe("old");
  });

  it("getCustomerNotifications returns accepted booking notification", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: "bk1",
            status: "accepted",
            workerId: { _id: "w1", fullName: "Alex Worker", email: "a@w.com" },
            serviceId: { title: "Kitchen Cleaning" },
            updatedAt: "2026-02-01",
          },
        ],
      },
    });

    const result = await getCustomerNotifications();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].worker.name).toBe("Alex Worker");
    expect(result.data[0].message).toContain("Kitchen Cleaning");
  });

  it("getCustomerNotifications enriches missing worker profile from /api/users/:id", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              _id: "bk2",
              status: "accepted",
              workerId: "w2",
              serviceId: "Standard Cleaning",
              updatedAt: "2026-02-01",
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: { data: { fullName: "Profile Name", email: "p@w.com", phone: "123" } },
      });

    const result = await getCustomerNotifications();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].worker.name).toBe("Profile Name");
    expect(result.data[0].worker.email).toBe("p@w.com");
    expect(result.data[0].worker.phone).toBe("123");
  });

  it("getCustomerNotifications excludes pending unassigned bookings", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: [{ _id: "bk3", status: "pending", workerId: null }] },
    });

    const result = await getCustomerNotifications();
    expect(result.data).toEqual([]);
  });
});
