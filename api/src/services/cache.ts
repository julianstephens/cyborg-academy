import { checkCacheConnection, RedisStore, store } from "@/redis";
import CacheControl from "cache-control-parser";
import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";

export interface CacheConfig {
  defaultExpiration: number;
  max: number;
  maxAge: number;
}

export interface CacheOptions {
  expires: number;
  maxAge: number;
}

export class CacheService {
  store: RedisStore;
  config: CacheConfig;

  constructor(store: RedisStore, config?: Partial<CacheConfig>) {
    this.store = store;
    this.config = {
      defaultExpiration: 3600, // 1hr
      max: config?.max ?? 64 * 1_000_000,
      maxAge: config?.maxAge ?? 200,
    };
  }

  #computeHash = (input: unknown) => {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(input))
      .digest("hex");
  };

  generateKey = (req: Request) => {
    const data = {
      query: req.query,
    };
    return `${req.baseUrl}${req.path}@${this.#computeHash(data)}`;
  };

  cache = (
    opts: CacheOptions = {
      expires: this.config.defaultExpiration,
      maxAge: this.config.maxAge,
    },
  ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      res.setHeader("x-cache-hit", "false");
      if (req.headers["cache-control"]) {
        const {
          "no-store": noStore,
          "no-cache": noCache,
          "max-age": maxAge,
        } = CacheControl.parse(req.headers["cache-control"]);
        if (noStore || noCache) {
          return next();
        }
        if (maxAge) {
          if (!Number.isInteger(maxAge) || maxAge > 0) {
            return next();
          } else {
            opts.maxAge = maxAge;
          }
        }
      }

      try {
        await checkCacheConnection();
      } catch {
        return next();
      }

      const key = this.generateKey(req);
      const cachedData = await this.store.get(key);
      if (cachedData) {
        res.setHeader("x-cache-hit", "true");
        try {
          res.json(JSON.parse(cachedData));
          return;
        } catch {
          res.send(cachedData);
          return;
        }
      } else {
        res.json = (data) => {
          if (res.statusCode.toString().startsWith("2")) {
            this.store.set(key, data, opts.expires).then();
            this.store.lpush(req.baseUrl + req.path, [key]).then();
          }
          return res.send(JSON.stringify(data));
        };
        next();
      }
    };
  };

  keys = (id: string) => {
    return this.store.all(id);
  };

  clear = (key: string) => {
    this.store.del(key).then();
  };
}

export const cache = new CacheService(store);
