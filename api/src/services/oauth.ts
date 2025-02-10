import { env } from "@/env";
import { Guild, TokenResponse } from "@/types";
import { getUser } from "@/utils";
import { isAPIError, type APIError } from "cyborg-utils";
import type { Request, Response } from "express";
import got from "got";
import { StatusCodes } from "http-status-codes";

class OauthService {
  static getConfig() {
    const clientId = env.AUTH_DISCORD_ID;
    const clientSecret = env.AUTH_DISCORD_SECRET;
    const tokenURL = `${env.DISCORD_API_URL}oauth2/token`;
    const authorizationURL = "https://discord.com/oauth2/authorize";
    const scope = "identify email guilds";

    return {
      clientId,
      clientSecret,
      tokenURL,
      authorizationURL,
      scope,
    };
  }

  authorize(req: Request, res: Response) {
    const { authorizationURL, scope, clientId, clientSecret } =
      OauthService.getConfig();

    const url = new URL(authorizationURL);
    url.searchParams.append("response_type", "code");
    url.searchParams.append(
      "redirect_url",
      `${env.BASE_URL}/auth/discord/callback`,
    );
    url.searchParams.append("scope", scope);
    url.searchParams.append("client_id", clientId);
    url.searchParams.append("client_secret", clientSecret);
    res.set("x-location", url.toString());
    res.sendStatus(StatusCodes.NO_CONTENT);
  }

  async exchange(req: Request, res: Response) {
    if (!("code" in req.query)) {
      throw {
        status: StatusCodes.BAD_REQUEST,
        message: "no authorization code provided",
      } as APIError;
    }

    const { tokenURL, clientId, clientSecret } = OauthService.getConfig();

    const data = {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: `${env.APP_URL}/dashboard`,
    };

    try {
      const r = await got
        .post(tokenURL, {
          form: data,
          username: clientId,
          password: clientSecret,
        })
        .json<TokenResponse>();

      const currUser = await getUser(r.access_token);

      const guildRes = await got
        .get(`${env.DISCORD_API_URL}/users/@me/guilds`, {
          headers: { Authorization: `Bearer ${r.access_token}` },
        })
        .json<Guild[]>();

      if (guildRes.length === 0) {
        throw {
          status: StatusCodes.FORBIDDEN,
          message: "user does not belong to the correct guild",
        } as APIError;
      }

      const isGuildMember = guildRes.some((g) => g.id === env.DISCORD_GUILD_ID);

      if (!isGuildMember) {
        throw {
          status: StatusCodes.FORBIDDEN,
          message: "user does not belong to the correct guild",
        } as APIError;
      }

      req.session.user = currUser;
      req.session.accessToken = r.access_token;
      req.session.refreshToken = r.refresh_token;
      res.redirect(`${env.APP_URL}/dashboard`);
    } catch (err: unknown) {
      if (isAPIError(err)) throw err;

      throw {
        status: StatusCodes.UNAUTHORIZED,
        message: "unable to authenticate user",
        detail: err,
      } as APIError;
    }
  }
}

export default OauthService;
