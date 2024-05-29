
import { InputType, PartialType } from "@nestjs/graphql";
import { YouthDto } from "./youth-input-dto";

@InputType()
export class UpdateYouthDto extends  PartialType(YouthDto){


}