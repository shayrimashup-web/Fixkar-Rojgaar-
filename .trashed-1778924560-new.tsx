import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { ChevronLeft, Calendar, Clock, MapPin, ImagePlus, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { MOCK_WORKERS } from '@/lib/mockData';

const TIME_SLOTS = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

export default function NewBookingScreen() {
  const { workerId } = useLocalSearchParams();
  const worker = MOCK_WORKERS.find(w => w.id === workerId) || MOCK_WORKERS[0];

  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      date: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
    };
  });

  const handleConfirm = () => {
    if (!description || !selectedDate || !selectedTime || !address) return;
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <CheckCircle size={64} color={Colors.accent} fill={Colors.accentSoft} />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSub}>Aapki booking submit ho gayi hai.</Text>
        <Text style={styles.successSub}>{worker.profiles?.full_name} ko request bhej di gayi hai.</Text>

        <View style={styles.successCard}>
          <Row label="Worker" value={worker.profiles?.full_name || ''} />
          <Row label="Date" value={selectedDate} />
          <Row label="Time" value={selectedTime} />
          <Row label="Address" value={address} />
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)/bookings')} activeOpacity={0.85}>
          <Text style={styles.homeBtnText}>View My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ marginTop: Spacing.md }}>
          <Text style={{ fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Worker</Text>
          <Text style={styles.headerSub}>Booking Details</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
          <View style={styles.workerPreview}>
            <Image source={{ uri: worker.profiles?.avatar_url }} style={styles.workerAvatar} />
            <View>
              <Text style={styles.workerName}>{worker.profiles?.full_name}</Text>
              <Text style={styles.workerCat}>{worker.category_name}</Text>
              <Text style={styles.workerRate}>₹{worker.hourly_rate}/hr</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.emergencyToggle, isEmergency && styles.emergencyToggleActive]}
            onPress={() => setIsEmergency(v => !v)}
            activeOpacity={0.85}
          >
            <AlertTriangle size={18} color={isEmergency ? Colors.white : '#EF4444'} />
            <Text style={[styles.emergencyText, isEmergency && { color: Colors.white }]}>
              Emergency Booking (Extra charges may apply)
            </Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Calendar size={16} color={Colors.primary} /> Select Date
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {dates.map((d) => (
                <TouchableOpacity
                  key={d.date}
                  style={[styles.dateChip, selectedDate === d.date && styles.dateChipActive]}
                  onPress={() => setSelectedDate(d.date)}
                >
                  <Text style={[styles.dateChipText, selectedDate === d.date && styles.dateChipTextActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Clock size={16} color={Colors.primary} /> Select Time
            </Text>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.timeChip, selectedTime === slot && styles.timeChipActive]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text style={[styles.timeChipText, selectedTime === slot && styles.timeChipTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Problem Description</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Kya problem hai? Describe karein... (e.g., 'Kitchen sink mein paani nahi aa raha')"
              placeholderTextColor={Colors.gray400}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <MapPin size={16} color={Colors.primary} /> Service Address
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Flat no., Area, City..."
              placeholderTextColor={Colors.gray400}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity style={styles.imageUpload} activeOpacity={0.8}>
            <ImagePlus size={24} color={Colors.primary} />
            <Text style={styles.imageUploadText}>Problem ki photo add karein (Optional)</Text>
          </TouchableOpacity>

          <View style={styles.priceEstimate}>
            <Text style={styles.priceTitle}>Estimated Cost</Text>
            <Text style={styles.priceValue}>₹{worker.hourly_rate} - ₹{worker.hourly_rate * 3}</Text>
            <Text style={styles.priceSub}>Final cost kaam ke baad tay hoga</Text>
          </View>

          <TouchableOpacity
            style={[styles.confirmBtn, (!description || !selectedDate || !selectedTime || !address) && styles.btnDisabled]}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <CheckCircle size={20} color={Colors.white} />
            <Text style={styles.confirmBtnText}>Confirm Booking</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary },
  value: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, flex: 1, textAlign: 'right' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  backBtn: { marginBottom: 8 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  body: { flex: 1, padding: Spacing.md },
  workerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  workerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.gray200 },
  workerName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  workerCat: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '500' },
  workerRate: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: '600' },
  emergencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: '#FEF2F2',
  },
  emergencyToggleActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  emergencyText: { fontSize: FontSize.sm, color: '#EF4444', fontWeight: '600', flex: 1 },
  section: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateScroll: {},
  dateChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  dateChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateChipText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  dateChipTextActive: { color: Colors.white },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  timeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  timeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeChipText: { fontSize: FontSize.xs, fontWeight: '500', color: Colors.text },
  timeChipTextActive: { color: Colors.white, fontWeight: '600' },
  textarea: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.text,
    height: 100,
    ...Shadow.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.text,
    height: 52,
    ...Shadow.sm,
  },
  imageUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary + '40',
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primarySoft,
  },
  imageUploadText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: '500' },
  priceEstimate: {
    backgroundColor: Colors.accentSoft,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  priceTitle: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: '600' },
  priceValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.accent },
  priceSub: { fontSize: FontSize.xs, color: Colors.accent + 'BB' },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: 48,
  },
  btnDisabled: { opacity: 0.5 },
  confirmBtnText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successIcon: { marginBottom: Spacing.xl },
  successTitle: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  successSub: { fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  successCard: {
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: '100%',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  homeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  homeBtnText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
});
