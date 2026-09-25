import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('mongoose', () => {
  const listeners: Record<string, Function> = {};
  return {
    default: {
      connect: vi.fn(),
      connection: {
        on: vi.fn((event: string, cb: Function) => {
          listeners[event] = cb;
        }),
      },
    },
  };
});

vi.mock('./env.js', () => ({
  config: { DATABASE_URI: 'mongodb://localhost:27017/testdb' },
}));

import mongoose from 'mongoose';

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('connectDatabase', () => {
  it('should register event handlers on mongoose connection', async () => {
    vi.mocked(mongoose.connect).mockResolvedValueOnce(mongoose);
    const { connectDatabase } = await import('./database.js');
    await connectDatabase();

    expect(mongoose.connection.on).toHaveBeenCalledWith('connected', expect.any(Function));
    expect(mongoose.connection.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mongoose.connection.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
  });

  it('should connect successfully on first attempt', async () => {
    vi.mocked(mongoose.connect).mockResolvedValueOnce(mongoose);
    const { connectDatabase } = await import('./database.js');
    await connectDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb');
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should retry and succeed on a later attempt', async () => {
    vi.mocked(mongoose.connect)
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      .mockResolvedValueOnce(mongoose);

    const { connectDatabase } = await import('./database.js');
    const connectPromise = connectDatabase();

    await vi.advanceTimersByTimeAsync(1000);
    await connectPromise;

    expect(mongoose.connect).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting all retries', async () => {
    const error = new Error('ECONNREFUSED');
    vi.mocked(mongoose.connect).mockRejectedValue(error);

    const { connectDatabase } = await import('./database.js');
    const connectPromise = connectDatabase();

    for (let i = 0; i < 5; i++) {
      await vi.advanceTimersByTimeAsync(16000);
    }

    await expect(connectPromise).rejects.toThrow('ECONNREFUSED');
    expect(mongoose.connect).toHaveBeenCalledTimes(5);
  });

  it('should use exponential backoff delays', async () => {
    vi.mocked(mongoose.connect)
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mongoose);

    const { connectDatabase } = await import('./database.js');
    const connectPromise = connectDatabase();

    await vi.advanceTimersByTimeAsync(1000);
    expect(mongoose.connect).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(2000);
    expect(mongoose.connect).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(4000);
    await connectPromise;
    expect(mongoose.connect).toHaveBeenCalledTimes(4);
  });
});
