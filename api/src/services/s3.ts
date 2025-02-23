import { env } from "@/env.js";
import {
  _Object,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { RemoteResource } from "cyborg-utils";

class S3Service {
  s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: env.AWS_REGION,
      endpoint: env.AWS_ENDPOINT_URL_S3,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  #pad = (num: number) => {
    if (num < 10) {
      return "0" + num;
    }
    return "" + num;
  };

  #getUrl = async (key: string) => {
    return await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: env.BUCKET_NAME, Key: key }),
    );
  };

  #listObjects = async (prefix: string) => {
    const input: ListObjectsCommandInput = {
      Bucket: env.BUCKET_NAME,
      Prefix: prefix,
    };
    const command = new ListObjectsCommand(input);
    const res = await this.s3.send(command);
    return res.Contents;
  };

  #buildResource = async (
    dtype: "reading" | "note",
    data: _Object,
    prefix: string,
  ): Promise<RemoteResource> => {
    if (!data.Key) throw Error;
    const name = data.Key.slice(prefix.length + 1);
    if (!name) throw Error;
    return {
      name,
      url: await this.#getUrl(data.Key),
      ...(dtype === "reading"
        ? { essential: prefix.indexOf("essential") > 0 }
        : {}),
    };
  };

  listReadings = async (
    seminar: string,
    session: number,
  ): Promise<RemoteResource[] | null> => {
    const rtypes = ["essential", "supplemental"];
    const readings: RemoteResource[] = [];
    for (const t of rtypes) {
      const prefix = `${seminar}/${this.#pad(session)}/readings/${t}`;
      const data = await this.#listObjects(prefix);
      if (!data) return null;
      for (const r of data) {
        try {
          const res = await this.#buildResource("reading", r, prefix);
          readings.push(res);
        } catch {
          continue;
        }
      }
    }

    return readings.length > 0 ? readings : null;
  };

  listNotes = async (
    seminar: string,
    session: number,
  ): Promise<RemoteResource[] | null> => {
    const notes: RemoteResource[] = [];
    const prefix = `${seminar}/${this.#pad(session)}/notes`;
    const data = await this.#listObjects(prefix);
    if (!data) return null;
    for (const n of data) {
      try {
        const res = await this.#buildResource("note", n, prefix);
        notes.push(res);
      } catch {
        continue;
      }
    }

    return notes.length > 0 ? notes : null;
  };
}

export default S3Service;
