import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, ScreenBackground } from '@/components';
import { gradients, palette, radius, spacing, typography } from '@/theme';
import {
  ChatMessage,
  COACH_SUGGESTIONS,
  INITIAL_MESSAGES,
} from '@/data/coach';
import { askCoach } from '@/lib/ai';

export default function Coach() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text: trimmed,
      };
      setMessages((m) => [...m, userMsg]);
      setInput('');
      setThinking(true);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

      try {
        const reply = await askCoach(trimmed);
        setMessages((m) => [
          ...m,
          { id: `c-${Date.now()}`, role: 'coach', text: reply },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            id: `c-${Date.now()}`,
            role: 'coach',
            text: 'Hmm, I had trouble responding. Please try again.',
          },
        ]);
      } finally {
        setThinking(false);
        requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
      }
    },
    [thinking],
  );

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <LinearGradient
            colors={gradients.magenta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarEmoji}>✨</Text>
          </LinearGradient>
          <View>
            <Text style={styles.title}>AI Coach</Text>
            <Text style={styles.status}>
              {thinking ? 'Thinking…' : 'Online · personalized to you'}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.thread}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <Bubble key={msg.id} message={msg} />
          ))}
          {thinking && (
            <Animated.View entering={FadeIn} style={[styles.bubbleWrap, styles.coachWrap]}>
              <GlassCard padding="md" style={styles.coachBubble}>
                <Text style={styles.typing}>● ● ●</Text>
              </GlassCard>
            </Animated.View>
          )}
        </ScrollView>

        {/* Suggestions */}
        {messages.length <= INITIAL_MESSAGES.length && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestions}
          >
            {COACH_SUGGESTIONS.map((s) => (
              <Pressable key={s} onPress={() => send(s)}>
                <GlassCard padding="md" style={styles.suggestion}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </GlassCard>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Composer */}
        <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.md }]}>
          <GlassCard padding="sm" style={styles.inputCard}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your coach anything…"
              placeholderTextColor={palette.textTertiary}
              style={styles.input}
              multiline
              onSubmitEditing={() => send(input)}
            />
            <Pressable onPress={() => send(input)} disabled={!input.trim()}>
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              >
                <Text style={styles.sendIcon}>↑</Text>
              </LinearGradient>
            </Pressable>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={[styles.bubbleWrap, isUser ? styles.userWrap : styles.coachWrap]}
    >
      {isUser ? (
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble]}
        >
          <Text style={styles.userText}>{message.text}</Text>
        </LinearGradient>
      ) : (
        <GlassCard padding="lg" style={styles.coachBubble}>
          <Text style={styles.coachText}>{message.text}</Text>
        </GlassCard>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 22 },
  title: {
    ...typography.heading,
    color: palette.textPrimary,
  },
  status: {
    ...typography.caption,
    color: palette.success,
  },
  thread: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  bubbleWrap: {
    maxWidth: '86%',
  },
  userWrap: { alignSelf: 'flex-end' },
  coachWrap: { alignSelf: 'flex-start' },
  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  userBubble: {
    borderBottomRightRadius: spacing.xs,
  },
  userText: {
    ...typography.body,
    color: '#fff',
  },
  coachBubble: {
    borderBottomLeftRadius: spacing.xs,
  },
  coachText: {
    ...typography.body,
    color: palette.textPrimary,
  },
  typing: {
    ...typography.body,
    color: palette.textSecondary,
    letterSpacing: 2,
  },
  suggestions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  suggestion: {
    maxWidth: 220,
  },
  suggestionText: {
    ...typography.caption,
    color: palette.textPrimary,
  },
  composer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: palette.textPrimary,
    maxHeight: 120,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: { color: '#fff', fontSize: 20, fontWeight: '800' },
});
