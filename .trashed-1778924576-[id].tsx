import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { ChevronLeft, Phone, Send, Image as ImageIcon } from 'lucide-react-native';
import { MOCK_BOOKINGS, MOCK_WORKERS } from '@/lib/mockData';

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'w1', text: 'Namaste! Main aapka booking accept kar liya hai. Main kal 10 baje aaonga.', time: '09:30 AM' },
  { id: 'm2', senderId: 'demo-customer', text: 'Theek hai! Address hai: A-234, Lajpat Nagar', time: '09:32 AM' },
  { id: 'm3', senderId: 'w1', text: 'Ji bilkul, main waqt pe pahunch jaonga. Koi aur problem to nahi hai?', time: '09:33 AM' },
  { id: 'm4', senderId: 'demo-customer', text: 'Nahi, bas electrical wiring ki problem hai kitchen mein.', time: '09:35 AM' },
  { id: 'm5', senderId: 'w1', text: 'Theek hai! Main puri taiyari ke sath aaunga. 👍', time: '09:36 AM' },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const booking = MOCK_BOOKINGS.find(b => b.id === id) || MOCK_BOOKINGS[0];
  const worker = booking.workers || MOCK_WORKERS[0];
  const workerProfile = worker.profiles!;

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: profile?.id || 'demo-customer',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const isMe = (senderId: string) => senderId === profile?.id || senderId === 'demo-customer';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={22} color={Colors.white} />
          </TouchableOpacity>
          <Image source={{ uri: workerProfile.avatar_url }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{workerProfile.full_name}</Text>
            <Text style={styles.headerSub}>{worker.category_name} • Online</Text>
          </View>
          <TouchableOpacity style={styles.callHeaderBtn}>
            <Phone size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>Today</Text>
          </View>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.messageWrapper, isMe(msg.senderId) && styles.messageWrapperMe]}
            >
              {!isMe(msg.senderId) && (
                <Image source={{ uri: workerProfile.avatar_url }} style={styles.msgAvatar} />
              )}
              <View style={[styles.messageBubble, isMe(msg.senderId) ? styles.bubbleMe : styles.bubbleOther]}>
                <Text style={[styles.messageText, isMe(msg.senderId) && styles.messageTextMe]}>
                  {msg.text}
                </Text>
                <Text style={[styles.messageTime, isMe(msg.senderId) && styles.messageTimeMe]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <ImageIcon size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message likho..."
            placeholderTextColor={Colors.gray400}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
            onPress={sendMessage}
            activeOpacity={0.85}
          >
            <Send size={18} color={inputText.trim() ? Colors.white : Colors.gray400} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {},
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)' },
  callHeaderBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  messagesList: { flex: 1 },
  messagesContent: { padding: Spacing.md, paddingBottom: Spacing.md },
  dateSeparator: { alignItems: 'center', marginBottom: Spacing.md },
  dateSeparatorText: { fontSize: FontSize.xs, color: Colors.textSecondary, backgroundColor: Colors.gray200, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full },
  messageWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: Spacing.sm },
  messageWrapperMe: { flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14 },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: Radius.lg,
    padding: Spacing.sm + 4,
    ...Shadow.sm,
  },
  bubbleOther: { backgroundColor: Colors.white, borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  messageText: { fontSize: FontSize.base, color: Colors.text, lineHeight: 22 },
  messageTextMe: { color: Colors.white },
  messageTime: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, alignSelf: 'flex-end' },
  messageTimeMe: { color: 'rgba(255,255,255,0.65)' },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: Colors.gray100, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontSize: FontSize.base, color: Colors.text,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gray300, alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: Colors.primary },
});
