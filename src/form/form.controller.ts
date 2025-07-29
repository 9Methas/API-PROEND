import { Controller, Get, Post, Put, Patch, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FormService } from './form.service';

// DTO for health record data
export class CreateHealthRecordDto {
  user_id?: string;
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
  user_id?: string;
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
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async create(@Body() createHealthRecordDto: CreateHealthRecordDto) {
    try {
      return await this.formService.create(createHealthRecordDto);
    } catch (error) {
      console.error('Error creating health record:', error);
      throw new HttpException(
        error.message || 'Failed to create health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id')
  async createWithId(@Param('id') id: string, @Body() createHealthRecordDto: CreateHealthRecordDto) {
    try {
      // Treat the URL parameter as user_id and auto-generate record_id
      const dataWithUserId = {
        user_id: id,
        ...createHealthRecordDto
      };
      return await this.formService.create(dataWithUserId);
    } catch (error) {
      console.error('Error creating health record with ID:', error);
      throw new HttpException(
        error.message || 'Failed to create health record with ID',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.formService.findAll();
    } catch (error) {
      console.error('Error fetching health records:', error);
      throw new HttpException(
        error.message || 'Failed to fetch health records',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      // Treat the URL parameter as user_id and fetch all records for that user
      return await this.formService.findByUserId(id);
    } catch (error) {
      console.error('Error fetching health records for user:', error);
      throw new HttpException(
        error.message || 'Failed to fetch health records for user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':userId/:recordId')
  async findOneByUserAndRecord(@Param('userId') userId: string, @Param('recordId') recordId: string) {
    try {
      // First get the specific record
      const record = await this.formService.findOne(recordId);
      
      // Check if the record belongs to the specified user
      if (record && record.user_id === userId) {
        return record;
      } else {
        throw new HttpException('Record not found or does not belong to this user', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('Error fetching health record:', error);
      throw new HttpException(
        error.message || 'Failed to fetch health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      return await this.formService.findByUserId(userId);
    } catch (error) {
      console.error('Error fetching health records for user:', error);
      throw new HttpException(
        error.message || 'Failed to fetch health records for user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHealthRecordDto: UpdateHealthRecordDto) {
    try {
      return await this.formService.update(id, updateHealthRecordDto);
    } catch (error) {
      console.error('Error updating health record:', error);
      throw new HttpException(
        error.message || 'Failed to update health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':userId/:recordId')
  async updateByUserAndRecord(
    @Param('userId') userId: string, 
    @Param('recordId') recordId: string, 
    @Body() updateHealthRecordDto: UpdateHealthRecordDto
  ) {
    try {
      // First get the specific record to check ownership
      const record = await this.formService.findOne(recordId);
      
      // Check if the record belongs to the specified user
      if (record && record.user_id === userId) {
        return await this.formService.update(recordId, updateHealthRecordDto);
      } else {
        throw new HttpException('Record not found or does not belong to this user', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('Error updating health record:', error);
      throw new HttpException(
        error.message || 'Failed to update health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() updateHealthRecordDto: UpdateHealthRecordDto) {
    try {
      return await this.formService.update(id, updateHealthRecordDto);
    } catch (error) {
      console.error('Error updating health record:', error);
      throw new HttpException(
        error.message || 'Failed to update health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.formService.remove(id);
    } catch (error) {
      console.error('Error deleting health record:', error);
      throw new HttpException(
        error.message || 'Failed to delete health record',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}