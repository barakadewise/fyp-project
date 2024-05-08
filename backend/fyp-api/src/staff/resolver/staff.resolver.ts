import { Resolver } from '@nestjs/graphql';
import { StaffService } from '../service/staff.service';

@Resolver()
export class StaffResolver {
  constructor(private readonly staffService: StaffService) {}
}
