import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { onboardingConcluido } from "../Services/storage";

export default function SplashScreen() {
  const router = useRouter();

  // ── Animated values ──────────────────────────────────────────────────────
  const emojiScale   = useRef(new Animated.Value(0)).current;
  const emojiOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity  = useRef(new Animated.Value(0)).current;
  const nameTranslateY = useRef(new Animated.Value(20)).current;
  const accentScaleX = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dot0Opacity  = useRef(new Animated.Value(0)).current;
  const dot1Opacity  = useRef(new Animated.Value(0)).current;
  const dot2Opacity  = useRef(new Animated.Value(0)).current;
  const poweredOpacity = useRef(new Animated.Value(0)).current;
  const glowScale    = useRef(new Animated.Value(0.6)).current;
  const glowOpacity  = useRef(new Animated.Value(0)).current;

  // Dot pulse loops (stored to stop later if needed)
  const dotLoops = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    // ── 1. Glow radial fades + scales in ─────────────────────────────────
    Animated.parallel([
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(glowScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // ── 2. Emoji: spring scale 0 → 1.12 → 1 ─────────────────────────────
    Animated.sequence([
      Animated.parallel([
        Animated.timing(emojiOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(emojiScale, {
          toValue: 1.12,
          tension: 180,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(emojiScale, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // ── 3. Name: fade + slide up (delay 300ms) ───────────────────────────
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // ── 4. Accent line scales in (delay 500ms) ───────────────────────────
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(accentScaleX, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
    ]).start();

    // ── 5. Tagline fades in (delay 650ms) ────────────────────────────────
    Animated.sequence([
      Animated.delay(650),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // ── 6. Powered by fades in (delay 800ms) ─────────────────────────────
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(poweredOpacity, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // ── 7. Dots: staggered pulse loop (delay 900ms) ───────────────────────
    const pulseConfig = { duration: 500, useNativeDriver: true as const };

    function makePulse(anim: Animated.Value, startDelay: number) {
      return Animated.sequence([
        Animated.delay(startDelay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, ...pulseConfig, easing: Easing.out(Easing.quad) }),
            Animated.timing(anim, { toValue: 0.25, ...pulseConfig, easing: Easing.in(Easing.quad) }),
          ])
        ),
      ]);
    }

    const d0 = makePulse(dot0Opacity, 900);
    const d1 = makePulse(dot1Opacity, 1100);
    const d2 = makePulse(dot2Opacity, 1300);
    dotLoops.current = [d0, d1, d2];
    d0.start(); d1.start(); d2.start();

    // ── 8. Navigate after 2.5s ────────────────────────────────────────────
    const timer = setTimeout(async () => {
      dotLoops.current.forEach((loop: Animated.CompositeAnimation) => loop.stop());
      try {
        const concluido = await onboardingConcluido();
        router.replace(concluido ? "/geladeira" as any : "/onboarding" as any);
      } catch {
        router.replace("/onboarding" as any);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Radial glow */}
      <Animated.View
        style={[
          styles.glow,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
        pointerEvents="none"
      />

      {/* Logo area */}
      <View style={styles.logoArea}>
        {/* Emoji */}
        <Animated.Text
          style={[
            styles.emoji,
            { opacity: emojiOpacity, transform: [{ scale: emojiScale }] },
          ]}
        >
          🥗
        </Animated.Text>

        {/* App name */}
        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: nameOpacity,
              transform: [{ translateY: nameTranslateY }],
            },
          ]}
        >
          Sobrou?
        </Animated.Text>

        {/* Accent line */}
        <Animated.View
          style={[styles.accent, { transform: [{ scaleX: accentScaleX }] }]}
        />

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Transforme o que sobrou{"\n"}em uma refeição incrível
        </Animated.Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Loading dots */}
        <View style={styles.dots}>
          {[dot0Opacity, dot1Opacity, dot2Opacity].map((anim, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, i === 0 && styles.dotActive, { opacity: anim }]}
            />
          ))}
        </View>

        {/* Powered by */}
        <Animated.Text style={[styles.powered, { opacity: poweredOpacity }]}>
          ✦ Powered by Google Gemini AI
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },

  // Radial glow behind emoji
  glow: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "transparent",
    // Simulates a radial gradient with a soft shadow
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 120,
    shadowOpacity: 0.35,
    // Android fallback
    elevation: 0,
    top: "50%",
    marginTop: -280,
    left: "50%",
    marginLeft: -180,
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 60,
  },

  emoji: {
    fontSize: 80,
    marginBottom: 12,
  },

  appName: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 14,
  },

  accent: {
    width: 80,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#4CAF50",
    marginBottom: 20,
  },

  tagline: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 26,
  },

  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
    gap: 16,
  },

  dots: {
    flexDirection: "row",
    gap: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
  },

  dotActive: {
    backgroundColor: "#4CAF50",
    width: 22,
    borderRadius: 4,
  },

  powered: {
    fontSize: 12,
    color: "#666",
    letterSpacing: 0.3,
  },
});
