/**
 * Generic Request-Scoped Batch DataLoader (`BatchDataLoader<K, V>`)
 *
 * Solves the GraphQL N+1 Query Problem for nested `@ResolveField()` resolvers:
 * - Coalesces all `.load(key)` calls scheduled within the same event-loop tick
 *   (`process.nextTick`) into a single batch database query (`WHERE profile_id IN (...)`).
 * - Memoizes promises per key within the GraphQL request lifecycle so repeated field
 *   accesses never hit the database twice.
 * - Exposes `getBatchDispatchCount()` for deterministic verification in unit/E2E tests.
 */

export type BatchLoadFn<K, V> = (keys: readonly K[]) => Promise<readonly V[]>;

export class BatchDataLoader<K, V> {
  private readonly cache = new Map<K, Promise<V>>();
  private queue: Array<{
    key: K;
    resolve: (value: V) => void;
    reject: (err: unknown) => void;
  }> = [];
  private isScheduled = false;
  private batchDispatchCount = 0;

  constructor(private readonly batchLoadFn: BatchLoadFn<K, V>) {}

  /**
   * Loads a value for a given key, batching all calls within the current tick.
   */
  public load(key: K): Promise<V> {
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const promise = new Promise<V>((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
      if (!this.isScheduled) {
        this.isScheduled = true;
        process.nextTick(() => {
          void this.dispatchQueue();
        });
      }
    });

    this.cache.set(key, promise);
    return promise;
  }

  /**
   * Loads multiple keys in parallel via the underlying batch mechanism.
   */
  public loadMany(keys: readonly K[]): Promise<V[]> {
    return Promise.all(keys.map((k) => this.load(k)));
  }

  /**
   * Clears the request-level memoization cache (used after mutations).
   */
  public clearAll(): void {
    this.cache.clear();
  }

  /**
   * Returns how many times the underlying database batch function was invoked.
   */
  public getBatchDispatchCount(): number {
    return this.batchDispatchCount;
  }

  private async dispatchQueue(): Promise<void> {
    const currentBatch = this.queue;
    this.queue = [];
    this.isScheduled = false;

    if (currentBatch.length === 0) return;

    this.batchDispatchCount += 1;
    const keys = currentBatch.map((item) => item.key);

    try {
      const results = await this.batchLoadFn(keys);
      if (results.length !== keys.length) {
        throw new Error(
          `BatchDataLoader error: batchLoadFn must return an array of the same length as keys (expected ${keys.length}, got ${results.length})`,
        );
      }

      for (let i = 0; i < currentBatch.length; i++) {
        currentBatch[i]!.resolve(results[i]!);
      }
    } catch (err) {
      for (const item of currentBatch) {
        this.cache.delete(item.key);
        item.reject(err);
      }
    }
  }
}
