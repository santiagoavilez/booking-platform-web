import { useState } from 'react';
import { SignupForm } from '@/features/auth/pages/signup/components/SignupForm';
import { RoleSelection } from '@/features/auth/pages/signup/components/RoleSelection';
import type { UserRole } from '@/shared/dtos/auth.dto';

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {selectedRole ? (
          <SignupForm
            role={selectedRole}
            onBack={() => setSelectedRole(null)}
          />
        ) : (
          <RoleSelection onSelectRole={setSelectedRole} />
        )}
      </div>
    </div>
  );
}
