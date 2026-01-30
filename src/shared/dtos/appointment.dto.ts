/**
 * Appointment/Booking DTOs
 * Placeholder structure for future booking functionality
 */

export interface AppointmentDTO {
  id: string;
  professionalId: string;
  clientId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // Time in HH:mm format
  endTime: string; // Time in HH:mm format
  status?: AppointmentStatus; // Optional - may not be returned by all endpoints
  createdAt?: string; // ISO datetime string - optional
  updatedAt?: string; // ISO datetime string - optional
}

export const AppointmentStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];


/**
 * Request to create a new appointment
 */
export interface CreateAppointmentRequestDTO {
  professionalId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // Time in HH:mm format
  endTime: string; // Time in HH:mm format
}

/**
 * Response from appointment endpoints
 */
export interface AppointmentResponseDTO {
  success: boolean;
  data: AppointmentDTO;
}

/**
 * Response from list appointments endpoint
 */
export interface AppointmentsListResponseDTO {
  success: boolean;
  data: {
    appointments: AppointmentDTO[];
  };
}

/**
 * Response from GET /appointments (my appointments)
 */
export interface MyAppointmentsResponseDTO {
  success: boolean;
  data: AppointmentDTO[];
}
