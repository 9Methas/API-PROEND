import { Controller, Get, Post, Put, Patch, Delete, Body, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

// DTO for health record data
export class CreateHealthRecordDto {
  date?: string;
  weight?: number;
  sleep_time?: string;
  wake_time?: string;
  sleep_quality?: string;
  exercise_type?: string;
  exercise_duration?: number;
  water_intake?: number;
  meals_count?: number;
  medications?: string;
  symptoms?: string;
  stress_level?: string;
  mood?: string;
  energy_level?: string;
  notes?: string;
}

export class UpdateHealthRecordDto {
  date?: string;
  weight?: number;
  sleep_time?: string;
  wake_time?: string;
  sleep_quality?: string;
  exercise_type?: string;
  exercise_duration?: number;
  water_intake?: number;
  meals_count?: number;
  medications?: string;
  symptoms?: string;
  stress_level?: string;
  mood?: string;
  energy_level?: string;
  notes?: string;
}

@Controller('form')
@UseGuards(AuthGuard) // Protect all form endpoints
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async create(@Body() createHealthRecordDto: CreateHealthRecordDto, @CurrentUser() user: any) {
    try {
      // Automatically set user_id from authenticated user
      const dataWithUserId = {
        user_id: user.id,
        ...createHealthRecordDto
      };
      return await this.formService.create(dataWithUserId);
    } catch (error) {
      console.error('Error creating health record:', error);
      throw new HttpException(
        error.message || 'Failed to create health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    try {
      // Only return records for the authenticated user
      return await this.formService.findByUserId(user.id);
    } catch (error) {
      console.error('Error fetching health records:', error);
      throw new HttpException(
        error.message || 'Failed to fetch health records',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':recordId')
  async findOne(@Param('recordId') recordId: string, @CurrentUser() user: any) {
    try {
      // Get specific record for authenticated user
      return await this.formService.findOneByUserAndRecord(user.id, recordId);
    } catch (error) {
      console.error('Error fetching health record:', error);
      throw new HttpException(
        error.message || 'Failed to fetch health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':recordId')
  async update(
    @Param('recordId') recordId: string, 
    @Body() updateHealthRecordDto: UpdateHealthRecordDto,
    @CurrentUser() user: any
  ) {
    try {
      // Update record for authenticated user
      return await this.formService.updateByUserAndRecord(user.id, recordId, updateHealthRecordDto);
    } catch (error) {
      console.error('Error updating health record:', error);
      throw new HttpException(
        error.message || 'Failed to update health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':recordId')
  async partialUpdate(
    @Param('recordId') recordId: string, 
    @Body() updateHealthRecordDto: UpdateHealthRecordDto,
    @CurrentUser() user: any
  ) {
    try {
      // Partial update record for authenticated user
      return await this.formService.updateByUserAndRecord(user.id, recordId, updateHealthRecordDto);
    } catch (error) {
      console.error('Error partially updating health record:', error);
      throw new HttpException(
        error.message || 'Failed to partially update health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':recordId')
  async remove(@Param('recordId') recordId: string, @CurrentUser() user: any) {
    try {
      // Delete record for authenticated user
      return await this.formService.removeByUserAndRecord(user.id, recordId);
    } catch (error) {
      console.error('Error deleting health record:', error);
      throw new HttpException(
        error.message || 'Failed to delete health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}