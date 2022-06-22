import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
@ApiTags('healthCheck')
class HealthController {
  constructor(
    private health: HealthCheckService,
    private memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'Health check' })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // NOTE: The process should not use more than 500MB memory
      () => this.memoryHealthIndicator.checkHeap('memory heap', 500 * 1024 * 1024),
      // NOTE: The process should not have more than 1GB RSS memory allocated
      () => this.memoryHealthIndicator.checkRSS('memory RSS', 1024 * 1024 * 1024),
    ]);
  }
}

export default HealthController;
