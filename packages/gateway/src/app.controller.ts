import { Controller, Get, Res, Param, Query, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Artifact } from 'surgio/build/generator/artifact';

import { BearerAuthGuard } from './auth/bearer.guard';
import { SurgioService } from './surgio/surgio.service';

@Controller()
export class AppController {
  constructor(private readonly surgioService: SurgioService) {}

  @UseGuards(BearerAuthGuard)
  @Get('get-artifact/:name')
  public async getArtifact(
    @Res() res: FastifyReply<ServerResponse>,
    @Param() params,
    @Query() query,
    @Req() req: FastifyRequest
  ): Promise<void> {
    const dl: string = query.dl;
    const format: string = query.format;
    const filter: string = query.filter;
    const artifactName: string = params.name;
    const artifact = format !== void 0 ?
      await this.surgioService.transformArtifact(artifactName, format, filter) :
      await this.surgioService.getArtifact(artifactName);

    if (artifact instanceof HttpException) {
      throw artifact;
    }

    if (artifact) {
      res.header('content-type', 'text/plain; charset=utf-8');
      res.header('cache-control', 'private, no-cache, no-stores');

      if (dl === '1') {
        res.header('content-disposition', `attachment; filename="${artifactName}"`);
      }

      req.log.warn('[download-artifact] [%s] %s %s', req.ip, artifactName, req.headers['user-agent'] || '-');

      if (typeof artifact === 'string') {
        res.send(artifact);
      } else if (artifact instanceof Artifact) {
        // 只支持输出单个 Provider 的流量信息
        if (artifact.providerMap.size === 1) {
          const providers = artifact.providerMap.values();
          const provider = providers.next().value;

          if (provider.getSubscriptionUserInfo) {
            const subscriptionUserInfo = await provider.getSubscriptionUserInfo();

            if (subscriptionUserInfo) {
              const values = ['upload', 'download', 'total', 'expire']
                .map(key => `${key}=${subscriptionUserInfo[key] || 0}`);

              res.header(
                'subscription-userinfo',
                values.join('; ')
              );
            }
          }
        }
        res.send(artifact.render());
      }
    } else {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
