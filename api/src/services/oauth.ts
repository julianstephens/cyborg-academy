import { env } from "@/env";
import { Guild, TokenResponse } from "@/types";
import { getUser } from "@/utils";
import { isAPIError } from "cyborg-utils";
import type { Request, Response } from "express";
import got from "got";
import { StatusCodes } from "http-status-codes";

class OauthService {
  static getConfig() {
    const clientId = env.AUTH_DISCORD_ID;
    const clientSecret = env.AUTH_DISCORD_SECRET;
    const tokenURL = `${env.DISCORD_API_URL}/oauth2/token`;
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
    const url = new URL(env.APP_URL);
    if (!("code" in req.query)) {
      url.searchParams.append(
        "error",
        "Something went wrong with Discord authorization",
      );
      return res.redirect(url.toString());
    }

    const { tokenURL, clientId, clientSecret } = OauthService.getConfig();

    const data = {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: `${env.APP_URL}/dashboard`,
    };

    try {
      const r = got.post(tokenURL, {
        form: data,
        username: clientId,
        password: clientSecret,
      });

      const tokenRes = await r.json<TokenResponse>();

      const currUser = await getUser(tokenRes.access_token);

      const guildRes = await got
        .get(`${env.DISCORD_API_URL}/users/@me/guilds`, {
          headers: { Authorization: `Bearer ${tokenRes.access_token}` },
        })
        .json<Guild[]>();

      if (guildRes.length === 0) {
        return res.redirect(env.APP_URL);
      }

      const isGuildMember = guildRes.some((g) => g.id === env.DISCORD_GUILD_ID);

      if (!isGuildMember) {
        url.searchParams.append(
          "error",
          "User does not belong to the correct guild",
        );
        return res.redirect(url.toString());
      }

      req.session.regenerate((err) => {
        if (err) {
          url.searchParams.append("error", "Unable to create user session");
          return res.redirect(url.toString());
        }
        req.session.user = currUser;
        req.session.accessToken = tokenRes.access_token;
        req.session.refreshToken = tokenRes.refresh_token;
        req.session.save((err) => {
          let redirectUrl = env.APP_URL;
          if (!err) redirectUrl += "/dashboard";
          res.redirect(redirectUrl);
        });
      });
    } catch (err: unknown) {
      if (isAPIError(err)) {
        url.searchParams.append("error", err.message);
        return res.redirect(url.toString());
      }

      url.searchParams.append("error", "Unable to authenticate user");
      return res.redirect(url.toString());
    }
  }
}

export default OauthService;
