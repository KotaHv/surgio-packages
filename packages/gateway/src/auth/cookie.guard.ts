import { ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { SurgioHelper } from '../surgio/surgio-helper';

export class CookieAuthGuard extends AuthGuard('cookie') {
  constructor(@Inject('SURGIO_HELPER') public surgioHelper: SurgioHelper) {
    super();
  }

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const needAuth = this.surgioHelper.config?.gateway.auth;

    if (needAuth) {
      return super.canActivate(context);
    }
    return true;
  }
}