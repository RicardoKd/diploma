export interface IFormField {
  type?: string;
  formItem: string;
  tooltipText?: string;
  options?: { label: string; value: string | number }[];
}
