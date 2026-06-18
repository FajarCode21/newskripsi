import tokenManager from "../utils/tokenManager.js";
import authenticationValidator from "../validators/authentication/index.js";
import authenticationService from "../services/authenticationService.js";
const isProduction = process.env.PROD === "true";

const authenticationController = {
  postAuthentication: async (req, res, next) => {
    try {
      await authenticationValidator.postUserPayload(req.body);
      const { email, password } = req.body;

      const user = await authenticationService.verifyUserCredential(
        email,
        password,
      );

      await authenticationService.deleteAuthenticationByUserId(user.id);

      const accessToken = await tokenManager.generateAccessToken({
        id_user: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      const refreshToken = await tokenManager.generateRefreshToken({
        id_user: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      await authenticationService.createAuthentication(user.id, refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: "success",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  putAuthentication: async (req, res, next) => {
    try {
      await authenticationValidator.putAuthenticationPayload(req.cookies);
      const { refreshToken } = req.cookies;

      const { id_user, name, email, role } =
        await tokenManager.verifyRefreshToken(refreshToken);
      await authenticationService.verifyToken(refreshToken);
      await authenticationService.deleteAuthentication(refreshToken);

      const accessToken = await tokenManager.generateAccessToken({
        id_user,
        name,
        email,
        role,
      });

      const newRefreshToken = await tokenManager.generateRefreshToken({
        id_user,
        name,
        email,
        role,
      });

      await authenticationService.createAuthentication(
        id_user,
        newRefreshToken,
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: "success",
        data: {
          user: {
            id: id_user,
            name,
            email,
            role,
          },
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteAuthentication: async (req, res, next) => {
    try {
      await authenticationValidator.deleteAuthenticationPayload(req.cookies);
      const { refreshToken } = req.cookies;

      await authenticationService.deleteAuthentication(refreshToken);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
      });

      res.status(200).json({ status: "success", message: "Logout berhasil" });
    } catch (error) {
      next(error);
    }
  },
};

export default authenticationController;
