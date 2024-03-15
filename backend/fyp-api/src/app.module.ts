import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { OpportunityModule } from './opportunity/opportunity.module';
import { ProjectModule } from './project/project.module';
import { PartnersModule } from './partners/partners.module';
import { YouthModule } from './youth/youth.module';
import { TeamsModule } from './teams/teams.module';
import { typeormConfigAsyc } from './config/typeorm.config';
import { AdminstrationlevelModule } from './adminstrationlevel/adminstrationlevel.module';
import { UserModule } from './user/user.module';




@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context:({req})=>({Headers:req.Headers})

    }),
    TypeOrmModule.forRootAsync(typeormConfigAsyc),
    AuthModule,
    AdminModule,
    OpportunityModule,
    ProjectModule,
    PartnersModule,
    YouthModule,
    TeamsModule,
    AdminstrationlevelModule,
    UserModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
