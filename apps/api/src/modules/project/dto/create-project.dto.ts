import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, Max, MaxLength } from "class-validator";

export class CreateProjectDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => value.trim())  
    name: string;
}