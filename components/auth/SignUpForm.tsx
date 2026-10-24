'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = password !== confirmPassword ? 'Passwords do not match' : undefined;

    if (emailError || passwordError || confirmError) {
      setErrors({ email: emailError, password: passwordError, confirmPassword: confirmError });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signIn('credentials', {
        email,
        password,
        mode: 'signup',
        redirect: false,
      });

      if (result?.error) {
        setErrors({ form: 'Account already exists. Please log in instead.' });
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
    let error: string | undefined;
    if (field === 'email') error = validateEmail(email);
    else if (field === 'password') error = validatePassword(password);
    else if (field === 'confirmPassword') error = password !== confirmPassword ? 'Passwords do not match' : undefined;
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const isValid = email && password && confirmPassword && password === confirmPassword && !validateEmail(email) && !validatePassword(password);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur('email')}
        error={errors.email}
        placeholder="you@example.com"
        disabled={isSubmitting}
        icon={<Mail className="w-5 h-5" />}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => handleBlur('password')}
        error={errors.password}
        placeholder="At least 8 characters"
        disabled={isSubmitting}
        icon={<Lock className="w-5 h-5" />}
      />
      <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={() => handleBlur('confirmPassword')}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
        disabled={isSubmitting}
        icon={<Lock className="w-5 h-5" />}
      />

      {errors.form && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Create Account
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-emerald-600 hover:underline font-medium"
        >
          Log in
        </button>
      </p>
    </form>
  );
}