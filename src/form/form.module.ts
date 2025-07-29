import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  controllers: [FormController],
  providers: [FormService],
  exports: [FormService] // เผื่อใช้ใน Module อื่น
})
export class FormModule {}
