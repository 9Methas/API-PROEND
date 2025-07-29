import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

@Injectable()
export class FormService {
  async create(formData: any) {
    const { data, error } = await supabase
      .from('health_data')
      .insert([formData]);
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }
}
