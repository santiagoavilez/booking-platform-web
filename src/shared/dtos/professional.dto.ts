/**
 * Professional list item returned by GET /professionals
 * Backend returns items with id, firstName, lastName, fullName
 */
export interface ProfessionalDTO {
  id: string;
  firstName: string;
  lastName: string;
  /** When present, use for display instead of firstName + lastName */
  fullName?: string;
  email?: string;
}

/**
 * Backend response from GET /professionals (paginated list)
 * Uses "items" and includes page, limit, totalPages
 */
export interface ProfessionalsListResponseDTO {
  success: boolean;
  data: {
    items: ProfessionalDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
