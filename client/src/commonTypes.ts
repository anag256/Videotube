export interface Field {
  type: string;
  name: string;
  placeholder: string;
  value?: string;
  file?: File | null;
  isRequired: boolean;
}


