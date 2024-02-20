// Local Modules
import AuthService from './auth.service';
import { ErrorsUtil } from '../utils';

const { UnauthorizedError, PermissionError } = ErrorsUtil;

export default class AuthMiddlaware {
  static authenticate() {
    return (req, res, next) => {
      try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) throw new UnauthorizedError('1');

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) throw new UnauthorizedError('2');

        const user = AuthService.validateAccessToken(accessToken);

        if (!user) throw new UnauthorizedError('5');

        res.locals.auth = { user };
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  static authenticateFor(accessScopes) {
    const access = accessScopes.map((r) => `access:${r}`);
    return (req, res, next) => {
      try {
        const authorizationHeader = req.headers.authorization;
        console.log(authorizationHeader);
        if (!authorizationHeader) throw new UnauthorizedError('1');

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) throw new UnauthorizedError('2');

        const user = AuthService.validateAccessToken(accessToken);
        if (!user) throw new UnauthorizedError('5');

        const scope = `access:${user.role}`;

        if (!(access.includes(scope))) throw new PermissionError('6');
        res.locals.auth = { user };
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
