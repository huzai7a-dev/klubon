import { supabase } from '@/lib/supabase';

interface OtpResponse {
    success: boolean;
    error?: string;
}

interface VerifyOtpResponse {
    success: boolean;
    error?: string;
    session?: any;
}

class AuthService {
    loginWithOtp = async (email: string): Promise<OtpResponse> => {
        try {
            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                },
            })

            if (error) {
                return {
                    success: false,
                    error: error.message || 'Failed to send OTP. Please try again.',
                };
            }

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: 'An unexpected error occurred. Please try again.',
            };
        }
    }

    verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            })
            if (error) {
                return {
                    success: false,
                    error: error.message || 'Invalid OTP. Please try again.',
                };
            }

            return {
                success: true,
                session,
            };
        } catch (error) {
            return {
                success: false,
                error: 'An unexpected error occurred. Please try again.',
            };
        }
    }
}

export default new AuthService()