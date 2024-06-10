import { Field, InputType, PartialType } from "@nestjs/graphql";
import { ProjectDto } from "./project-input-dto";

@InputType()
export class UpdateProjectDto extends PartialType(ProjectDto){
}