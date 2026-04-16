import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { User, Phone, Briefcase, MapPin, DollarSign, ChevronLeft, ChevronDown, CircleCheck as CheckCircle } from 'lucide-react-native';
import { MOCK_CATEGORIES } from '@/lib/mockData';

export default function WorkerRegisterScreen() {
  const { setDemoUser } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    category: '',
    categoryId: '',
    experience: '',
    hourlyRate: '',
    description: '',
    serviceArea: '',
    city: '',
  });

  const handleUpdate = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleRegister = () => {
    setDemoUser('worker');
    router.replace('/(worker)/dashboard');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(s => s - 1) : router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Worker Registration</Text>
          <Text style={styles.headerSub}>Step {step} of 3</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <Text style={styles.sectionSub}>Apni basic jaankari bharo</Text>

              <InputField
                label="Full Name"
                icon={<User size={18} color={Colors.textSecondary} />}
                placeholder="Apna poora naam"
                value={form.fullName}
                onChangeText={(v) => handleUpdate('fullName', v)}
              />
              <InputField
                label="Mobile Number"
                icon={<Phone size={18} color={Colors.textSecondary} />}
                placeholder="10-digit number"
                value={form.phone}
                onChangeText={(v) => handleUpdate('phone', v)}
                keyboardType="phone-pad"
              />
              <InputField
                label="City"
                icon={<MapPin size={18} color={Colors.textSecondary} />}
                placeholder="Apna shehar"
                value={form.city}
                onChangeText={(v) => handleUpdate('city', v)}
              />

              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)} activeOpacity={0.85}>
                <Text style={styles.nextBtnText}>Next Step</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Details</Text>
              <Text style={styles.sectionSub}>Apne kaam ke baare mein bataao</Text>

              <Text style={styles.inputLabel}>Select Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {MOCK_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, form.categoryId === cat.id && styles.categoryChipActive]}
                    onPress={() => { handleUpdate('category', cat.name); handleUpdate('categoryId', cat.id); }}
                    activeOpacity={0.8}
                  >
                    {form.categoryId === cat.id && <CheckCircle size={12} color={Colors.white} />}
                    <Text style={[styles.categoryChipText, form.categoryId === cat.id && styles.categoryChipTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <InputField
                label="Experience (Years)"
                icon={<Briefcase size={18} color={Colors.textSecondary} />}
                placeholder="Years of experience"
                value={form.experience}
                onChangeText={(v) => handleUpdate('experience', v)}
                keyboardType="number-pad"
              />
              <InputField
                label="Hourly Rate (₹)"
                icon={<DollarSign size={18} color={Colors.textSecondary} />}
                placeholder="Per hour charge"
                value={form.hourlyRate}
                onChangeText={(v) => handleUpdate('hourlyRate', v)}
                keyboardType="number-pad"
              />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Apne kaam ke baare mein kuch likhein..."
                  placeholderTextColor={Colors.gray400}
                  value={form.description}
                  onChangeText={(v) => handleUpdate('description', v)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)} activeOpacity={0.85}>
                <Text style={styles.nextBtnText}>Next Step</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification</Text>
              <Text style={styles.sectionSub}>ID proof aur selfie upload karo</Text>

              <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
                <Text style={styles.uploadIcon}>📎</Text>
                <Text style={styles.uploadTitle}>Aadhaar Card Upload</Text>
                <Text style={styles.uploadSub}>Front and back photo (max 5MB)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.uploadBox, { borderColor: Colors.accent }]} activeOpacity={0.8}>
                <Text style={styles.uploadIcon}>🤳</Text>
                <Text style={styles.uploadTitle}>Live Selfie Verification</Text>
                <Text style={styles.uploadSub}>Apni selfie khinchein verification ke liye</Text>
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  Register karke aap agree karte hain ki aapki sari jaankari sahi hai. Admin 24-48 ghante mein verify karega.
                </Text>
              </View>

              <TouchableOpacity style={[styles.nextBtn, { backgroundColor: Colors.accent }]} onPress={handleRegister} activeOpacity={0.85}>
                <CheckCircle size={20} color={Colors.white} />
                <Text style={styles.nextBtnText}>Submit Registration</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function InputField({ label, icon, ...props }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={{ paddingLeft: 12 }}>{icon}</View>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.gray400}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  backBtn: { marginBottom: Spacing.sm },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  progressBar: { height: 4, backgroundColor: Colors.gray200 },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 2 },
  body: { flex: 1 },
  section: { padding: Spacing.lg },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  sectionSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    height: 52,
    ...Shadow.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  textarea: {
    height: 100,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    fontSize: FontSize.base,
    color: Colors.text,
    ...Shadow.sm,
  },
  categoryScroll: { marginBottom: Spacing.md },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    gap: 4,
  },
  categoryChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryChipText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '500' },
  categoryChipTextActive: { color: Colors.white },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  uploadIcon: { fontSize: 32, marginBottom: Spacing.sm },
  uploadTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  uploadSub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  termsContainer: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  termsText: { fontSize: FontSize.sm, color: Colors.primary, lineHeight: 19 },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  nextBtnText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
});
