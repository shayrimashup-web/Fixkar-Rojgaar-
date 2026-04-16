import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { Phone, Lock, Eye, EyeOff, Wrench, ChevronRight, ShieldCheck } from 'lucide-react-native';

export default function LoginScreen() {
  const { setDemoUser } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setShowOtp(true);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDemoUser('customer');
      router.replace('/(tabs)');
    }, 1000);
  };

  const handleDemoLogin = (role: 'customer' | 'worker' | 'admin') => {
    setDemoUser(role);
    if (role === 'admin') {
      router.replace('/admin');
    } else if (role === 'worker') {
      router.replace('/(worker)/dashboard');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Wrench size={32} color={Colors.white} strokeWidth={2.5} />
          </View>
          <Text style={styles.appName}>Fixkar Rojgaar</Text>
          <Text style={styles.tagline}>फिक्सकर रोज़गार</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Login / Sign Up</Text>
          <Text style={styles.subtitle}>Apna mobile number enter karein</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <View style={styles.divider} />
              <Phone size={18} color={Colors.textSecondary} style={{ marginLeft: 12 }} />
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor={Colors.gray400}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {showOtp && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>OTP Verification</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color={Colors.textSecondary} style={{ marginLeft: 16 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 4-digit OTP"
                  placeholderTextColor={Colors.gray400}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
              <TouchableOpacity style={styles.resendBtn}>
                <Text style={styles.resendText}>Resend OTP (30s)</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={showOtp ? handleVerifyOTP : handleSendOTP}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? 'Verifying...' : showOtp ? 'Verify & Login' : 'Send OTP'}
            </Text>
            <ChevronRight size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Demo Login</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Try as:</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity style={[styles.demoBtn, styles.demoBtnCustomer]} onPress={() => handleDemoLogin('customer')} activeOpacity={0.85}>
              <Text style={styles.demoBtnText}>Customer</Text>
              <Text style={styles.demoBtnHindi}>ग्राहक</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoBtn, styles.demoBtnWorker]} onPress={() => handleDemoLogin('worker')} activeOpacity={0.85}>
              <Text style={styles.demoBtnText}>Worker</Text>
              <Text style={styles.demoBtnHindi}>कारीगर</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoBtn, styles.demoBtnAdmin]} onPress={() => handleDemoLogin('admin')} activeOpacity={0.85}>
              <ShieldCheck size={14} color={Colors.white} />
              <Text style={styles.demoBtnText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.workerSignup}>
          <Text style={styles.workerSignupText}>Worker ho? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/worker-register')}>
            <Text style={styles.workerSignupLink}>Register as Worker</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          Login karke aap hamare Terms & Conditions aur Privacy Policy se agree karte hain.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { paddingBottom: 48 },
  header: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.primary,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  tagline: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: -24,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  errorBox: {
    backgroundColor: Colors.errorSoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray50,
    height: 52,
  },
  countryCode: {
    paddingHorizontal: 12,
    borderRightWidth: 1.5,
    borderRightColor: Colors.border,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: { fontSize: FontSize.base, fontWeight: '600', color: Colors.text },
  divider: { width: 1 },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: FontSize.base,
    color: Colors.text,
    height: '100%',
  },
  resendBtn: { alignSelf: 'flex-end', marginTop: 8 },
  resendText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  btnDisabled: { opacity: 0.7 },
  primaryBtnText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginHorizontal: Spacing.md },
  demoSection: { marginHorizontal: Spacing.md },
  demoTitle: { fontSize: FontSize.base, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm, textAlign: 'center' },
  demoButtons: { flexDirection: 'row', gap: Spacing.sm },
  demoBtn: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  demoBtnCustomer: { backgroundColor: Colors.primary },
  demoBtnWorker: { backgroundColor: Colors.accent },
  demoBtnAdmin: { backgroundColor: Colors.dark, flexDirection: 'row', gap: 6 },
  demoBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
  demoBtnHindi: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  workerSignup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  workerSignupText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  workerSignupLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
  termsText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    lineHeight: 18,
  },
});
