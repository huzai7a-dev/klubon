import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';
import { useSession } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import authService from '@/services/auth.service';
import profileService from '@/services/profile.service';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function EnterOtpScreen() {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(RESEND_COOLDOWN);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<TextInput>(null);
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const { signIn } = useSession();

    useEffect(() => {
        let interval: number;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        if (timer === 0 && email) {
            setLoading(true);
            setError('');

            const result = await authService.loginWithOtp(email);

            setLoading(false);

            if (result.success) {
                setTimer(RESEND_COOLDOWN);
                Alert.alert('Success', 'OTP has been resent to your email.');
            } else {
                setError(result.error || 'Failed to resend OTP.');
            }
        }
    };

    const handleVerify = async () => {
        if (!email) {
            setError('Email is missing. Please go back and try again.');
            return;
        }


        try {
            setLoading(true);
            setError('');

            const result = await authService.verifyOtp(email, otp);

            if (result.success) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    await signIn(session);

                    const profileData = await profileService.getUserProfile(session.user.id);

                    setLoading(false);

                    if (profileData) {
                        router.replace('/(app)/discover');
                    } else {
                        router.replace('/setup-profile');
                    }
                } else {
                    setLoading(false);
                    setError('Session not found. Please try again.');
                }
            } else {
                setLoading(false);
                setError(result.error || 'Invalid OTP. Please try again.');
                setOtp('');
            }
        } catch (error: any) {
            setLoading(false);
            setError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.content}>
                    <AppText type="title" style={styles.title}>Enter Code</AppText>
                    <AppText style={styles.subtitle}>
                        {`We've sent an OTP code to ${email || 'your email'}. Please check your inbox and enter the code below.`}
                    </AppText >

                    <View style={styles.otpContainer}>
                        {/* Hidden Input */}
                        <TextInput
                            ref={inputRef}
                            style={styles.hiddenInput}
                            value={otp}
                            onChangeText={(text) => {
                                if (text.length <= OTP_LENGTH) {
                                    setOtp(text.replace(/[^0-9]/g, ''));
                                }
                            }}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            maxLength={OTP_LENGTH}
                            autoFocus
                        />

                        {/* Visual Output */}
                        <TouchableOpacity
                            style={styles.otpInputGroup}
                            activeOpacity={1}
                            onPress={() => inputRef.current?.focus()}
                        >
                            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.otpBox,
                                        { borderColor: otp.length === index ? Colors.primary : Colors.greyLight },
                                        // Highlight filled boxes slightly or keep them standard
                                        otp.length > index && styles.otpBoxFilled
                                    ]}
                                >
                                    <AppText type="title" style={styles.otpText}>
                                        {otp[index] || ''}
                                    </AppText>
                                </View>
                            ))}
                        </TouchableOpacity>
                    </View>

                    {
                        error ? (
                            <AppText style={styles.errorText}>{error}</AppText>
                        ) : null
                    }



                    <View style={styles.timerContainer}>
                        {timer > 0 ? (
                            <AppText style={styles.timerText}>
                                Resend code in <AppText type="defaultSemiBold" style={{ color: Colors.primary }}>{timer}s</AppText>
                            </AppText>
                        ) : (
                            <TouchableOpacity onPress={handleResend}>
                                <AppText type="defaultSemiBold" style={{ color: Colors.primary }}>
                                    Resend Code
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View>

                    <AppButton
                        title="Verify"
                        onPress={handleVerify}
                        disabled={otp.length !== OTP_LENGTH || loading}
                        style={styles.verifyButton}
                    />
                </View >
            </KeyboardAvoidingView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    keyboardAvoidingView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 40, // Adjust for keyboard roughly
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        textAlign: 'center',
        color: Colors.greyNormal,
        marginBottom: 40,
        fontSize: 16,
        lineHeight: 24,
    },
    otpContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1,
    },
    otpInputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 400, // Cap width for tablets/large screens
    },
    otpBox: {
        width: 48,
        height: 56,
        borderWidth: 1.5,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA', // Light bg for box, strictly utilizing themes would be better but this is neutral
    },
    otpBoxFilled: {
        borderColor: Colors.text,
        backgroundColor: Colors.white,
    },
    otpText: {
        fontSize: 24,
        textAlign: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    timerText: {
        color: Colors.greyNormal,
    },
    errorText: {
        color: Colors.red,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
    },
    successText: {
        color: Colors.green,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 12,
    },
    verifyButton: {
        marginTop: 10,
    },
});
