import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TokenService from "./Token.js";
import { NotFound, Forbidden, Conflict } from "../utils/Errors.js";
import RefreshSessionsRepository from "../repositories/RefreshSession.js";
import UserRepository from "../repositories/User.js";
import { ACCESS_TOKEN_EXPIRATION } from "../constants.js";
import RefreshSessionRepository from "../repositories/RefreshSession.js";

class AuthService {
  static async signIn({ userName, password, fingerprint }) {}

  static async signUp({ userName, password, fingerprint, role }) {
    const userData = await UserRepository.getUserData(userName);

    if (userData) {
      throw new Conflict("Пользователь с таким именем уже существует");
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const { id } = await UserRepository.createUser({
      userName,
      hashedPassword,
      role,
    });

    const payload = { id, userName, role };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionRepository.createRefreshSession({
      id,
      refreshToken,
      fingerprint,
    });

    return {
      accessToken,
      refreshToken,
      fingerprint: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async logOut(refreshToken) {}

  static async refresh({ fingerprint, currentRefreshToken }) {}
}

export default AuthService;
