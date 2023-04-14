import { Test, TestingModule } from '@nestjs/testing';
import { CakesResolver } from './cakes.resolver';
import { CakesService } from './cakes.service';

describe('CakesResolver', () => {
  let resolver: CakesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CakesResolver, CakesService],
    }).compile();

    resolver = module.get<CakesResolver>(CakesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
