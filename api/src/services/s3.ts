import { env } from "@/env.js";
import logger from "@/logger.js";
import {
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

  listReadings = async (
    seminar: string,
    session: number,
  ): Promise<RemoteResource[] | null> => {
    const rtypes = ["essential", "supplemental"];
    const readings: RemoteResource[] = [];
    for (const t of rtypes) {
      const prefix = `${seminar}/${this.#pad(session)}/readings/${t}`;
      logger.info(prefix);
      const input: ListObjectsCommandInput = {
        Bucket: env.BUCKET_NAME,
        Prefix: prefix,
      };
      const command = new ListObjectsCommand(input);
      const res = await this.s3.send(command);
      if (!res.Contents) return null;
      for (const o of res.Contents) {
        if (!o.Key) continue;
        const url = await this.getUrl(o.Key);
        const name = o.Key.slice(prefix.length + 1);
        if (!name) continue;
        readings.push({
          name,
          url,
          essential: prefix.indexOf("essential") > 0,
        });
      }
    }

    return readings.length > 0 ? readings : null;
  };

  getUrl = async (key: string) => {
    return await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: env.BUCKET_NAME, Key: key }),
    );
  };
}

export default S3Service;
