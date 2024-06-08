import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunityModule } from './opportunity/opportunity.module';
import { ProjectModule } from './project/project.module';
import { PartnersModule } from './partners/partners.module';
import { YouthModule } from './youth/youth.module';
import { TeamsModule } from './teams/teams.module';
import { typeormConfigAsyc } from './config/typeorm.config';

import { AccountsModule } from './accounts/accounts.module';
import { error } from 'console';
import { StaffModule } from './staff/staff.module';
import { AuthModule } from './auth/auth.module';
import { InstallmentsModule } from './installments/installments.module';






@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
      formatError: (err) => {

        if (err.extensions && err.extensions.originalError) {
          const originalError: any = err.extensions.originalError;
          const statusCode = originalError.statusCode;
          const message = originalError.message;
          return { message, statusCode };
        } else {
          return { message: err.message, status: HttpStatus.INTERNAL_SERVER_ERROR };
        }
      }

    }),
    TypeOrmModule.forRootAsync(typeormConfigAsyc),
    OpportunityModule,
    ProjectModule,
    PartnersModule,
    YouthModule,
    TeamsModule,
    AccountsModule,
    StaffModule,
    AuthModule,
    InstallmentsModule

  ],
})
export class AppModule { }
