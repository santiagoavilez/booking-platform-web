/**
 * Professional list item returned by GET /professionals
 */
export interface ProfessionalDTO {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

/**
 * Response from GET /professionals (paginated list)
 */
export interface ProfessionalsListResponseDTO {
  success: boolean;
  data: {
    professionals: ProfessionalDTO[];
    total: number;
  };
}
