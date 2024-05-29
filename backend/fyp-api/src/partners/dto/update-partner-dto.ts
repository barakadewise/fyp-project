import { InputType, PartialType } from "@nestjs/graphql";
import { PartnerDto } from "./partner-input-dto";

@InputType()
export class UpdatePartnerDto extends PartialType(PartnerDto){

}