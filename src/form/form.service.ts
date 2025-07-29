import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FormService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async create(healthRecordData: any) {
    const { data, error } = await this.supabase
      .from('health_records')
      .insert([healthRecordData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create health record: ${error.message}`);
    }

    return data;
  }

  async createWithId(id: string, healthRecordData: any) {
    // Add the specific record_id to the data
    const dataWithId = {
      record_id: id,
      ...healthRecordData
    };

    const { data, error } = await this.supabase
      .from('health_records')
      .insert([dataWithId])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create health record with ID: ${error.message}`);
    }

    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('health_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch health records: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('health_records')
      .select('*')
      .eq('record_id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch health record: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updateData: any) {
    const { data, error } = await this.supabase
      .from('health_records')
      .update(updateData)
      .eq('record_id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update health record: ${error.message}`);
    }

    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabase
      .from('health_records')
      .delete()
      .eq('record_id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to delete health record: ${error.message}`);
    }

    return data;
  }

  async findByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch health records for user: ${error.message}`);
    }

    return data;
  }
}