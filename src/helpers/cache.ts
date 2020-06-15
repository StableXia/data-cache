interface IfaCatchItemProps<T> {
  data: T;
  expires: number;
}

const EXPIRES = 1 * 60 * 60;

class CacheItem<T> {
  expires: number;
  cacheTime: number;
  data: T;

  constructor(options: IfaCatchItemProps<T>) {
    this.data = options.data;
    this.expires = options.expires;
    this.cacheTime = new Date().getTime();
  }
}

class CacheData {
  static cacheMap = new Map();

  isExpired(key: string): boolean {
    const values = CacheData.cacheMap.get(key);

    if (!values) {
      return true;
    }

    const { expires, cacheTime } = values;
    const currentTime = new Date().getTime();
    const diffTime = (currentTime - cacheTime) / 1000;

    if (Math.abs(diffTime) > expires) {
      CacheData.cacheMap.delete(key);
      return true;
    }

    return false;
  }

  delete(key: string) {
    return CacheData.cacheMap.delete(key);
  }

  set<T>(key: string, value: T, expires = EXPIRES): void {
    if (CacheData.cacheMap.has(key)) {
      console.warn('key值重复');
      return;
    }

    const cacheItem = new CacheItem<T>({ data: value, expires });

    CacheData.cacheMap.set(key, cacheItem);
  }

  reset<T>(key: string, value: T) {
    this.set(key, value);
  }

  get(key: string) {
    return this.isExpired(key) ? null : CacheData.cacheMap.get(key).data;
  }
}

export default CacheData;
