import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { CreditCard as Edit2, Star, CircleCheck as CheckCircle, LogOut, Camera, MapPin, Clock, Plus } from 'lucide-react-native';
import { MOCK_WORKERS } from '@/lib/mockData';

export default function WorkerProfileScreen() {
  const { profile, signOut } = useAuth();
  const worker = MOCK_WORKERS[0];
  const [editing, setEditing] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(worker.hourly_rate.toString());
  const [description, setDescription] = useState(worker.description);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profile?.avatar_url }} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Camera size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profile?.full_name}</Text>
        <Text style={styles.category}>{worker.category_name}</Text>
        <View style={styles.badgesRow}>
          {worker.is_verified && (
            <View style={styles.badge}>
              <CheckCircle size={12} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          )}
          {worker.is_approved && (
            <View style={[styles.badge, { backgroundColor: Colors.accentSoft }]}>
              <CheckCircle size={12} color={Colors.accent} fill={Colors.accent} />
              <Text style={[styles.badgeText, { color: Colors.accent }]}>Approved</Text>
            </View>
          )}
        </View>
        <View style={styles.ratingRow}>
          <Star size={16} color='#F59E0B' fill='#F59E0B' />
          <Text style={styles.rating}>{worker.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({worker.total_reviews} reviews)</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Details</Text>
            <TouchableOpacity onPress={() => setEditing(v => !v)} style={styles.editBtn}>
              <Edit2 size={14} color={Colors.primary} />
              <Text style={styles.editBtnText}>{editing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hourly Rate (₹)</Text>
            {editing ? (
              <TextInput
                style={styles.editInput}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                keyboardType="number-pad"
              />
            ) : (
              <Text style={styles.detailValue}>₹{worker.hourly_rate}/hr</Text>
            )}
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Daily Rate (₹)</Text>
            <Text style={styles.detailValue}>₹{worker.daily_rate}/day</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Experience</Text>
            <Text style={styles.detailValue}>{worker.experience_years} years</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Working Hours</Text>
            <Text style={styles.detailValue}>{worker.work_timing_start} - {worker.work_timing_end}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>About Me</Text>
          </View>
          {editing ? (
            <TextInput
              style={styles.textarea}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.descText}>{worker.description}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {worker.skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {editing && (
              <TouchableOpacity style={styles.addSkillBtn}>
                <Plus size={14} color={Colors.primary} />
                <Text style={styles.addSkillText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Areas</Text>
          {worker.service_areas.map((area) => (
            <View key={area} style={styles.areaRow}>
              <MapPin size={14} color={Colors.primary} />
              <Text style={styles.areaText}>{area}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portfolio Photos</Text>
          <View style={styles.portfolioGrid}>
            {worker.portfolio_images.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={styles.portfolioImg} />
            ))}
            <TouchableOpacity style={styles.addPhotoBtn} activeOpacity={0.8}>
              <Camera size={24} color={Colors.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.85}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.signOutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.accent,
    paddingTop: 52,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  avatarContainer: { position: 'relative', marginBottom: Spacing.sm },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 2 },
  category: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.85)', marginBottom: Spacing.sm },
  badgesRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primarySoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rating: { fontSize: FontSize.base, fontWeight: '800', color: Colors.white },
  reviews: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  body: { padding: Spacing.md },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  cardTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  detailLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  detailValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  editInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, fontSize: FontSize.sm, color: Colors.text, minWidth: 80 },
  textarea: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: FontSize.sm, color: Colors.text, height: 100 },
  descText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  skillChip: { backgroundColor: Colors.primarySoft, paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full },
  skillText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  addSkillBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full },
  addSkillText: { fontSize: FontSize.xs, color: Colors.primary },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  areaText: { fontSize: FontSize.sm, color: Colors.text },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  portfolioImg: { width: 80, height: 80, borderRadius: Radius.md },
  addPhotoBtn: { width: 80, height: 80, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addPhotoText: { fontSize: FontSize.xs, color: Colors.primary },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.errorSoft, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: 48, borderWidth: 1, borderColor: '#FECACA',
  },
  signOutText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.error },
});
