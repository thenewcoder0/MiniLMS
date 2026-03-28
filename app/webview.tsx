import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useState } from 'react';

export default function WebViewScreen() {
    const { course } = useLocalSearchParams();
    const courseData = JSON.parse(course as string);
    const [loading, setLoading] = useState(true);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, sans-serif; background: #f9fafb; color: #111; }
          .header { background: #3B82F6; color: white; padding: 24px 20px; }
          .header h1 { font-size: 22px; margin-bottom: 8px; }
          .header p { font-size: 14px; opacity: 0.85; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
          .content { padding: 20px; }
          .card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          .card h2 { font-size: 16px; margin-bottom: 8px; color: #1f2937; }
          .card p { font-size: 14px; color: #6b7280; line-height: 1.6; }
          .lesson { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
          .lesson:last-child { border-bottom: none; }
          .lesson-num { width: 32px; height: 32px; background: #EFF6FF; color: #3B82F6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; margin-right: 12px; flex-shrink: 0; }
          .lesson-title { font-size: 14px; color: #374151; }
          .lesson-duration { font-size: 12px; color: #9ca3af; margin-top: 2px; }
          .progress-bar { background: #e5e7eb; border-radius: 8px; height: 8px; margin: 8px 0; }
          .progress-fill { background: #3B82F6; height: 8px; border-radius: 8px; width: 35%; }
          .stats { display: flex; gap: 12px; margin-bottom: 16px; }
          .stat { flex: 1; background: white; border-radius: 12px; padding: 12px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          .stat-num { font-size: 20px; font-weight: bold; color: #3B82F6; }
          .stat-label { font-size: 11px; color: #6b7280; margin-top: 2px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${courseData.title}</h1>
          <p>👨‍🏫 ${courseData.instructor}</p>
          <div class="badge">📚 Course Content</div>
        </div>
        <div class="content">
          <div class="stats">
            <div class="stat">
              <div class="stat-num">12</div>
              <div class="stat-label">Lessons</div>
            </div>
            <div class="stat">
              <div class="stat-num">35%</div>
              <div class="stat-label">Complete</div>
            </div>
            <div class="stat">
              <div class="stat-num">4.8⭐</div>
              <div class="stat-label">Rating</div>
            </div>
          </div>

          <div class="card">
            <h2>Your Progress</h2>
            <p>Keep going! You're doing great.</p>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p style="font-size:12px; color:#6b7280;">4 of 12 lessons completed</p>
          </div>

          <div class="card">
            <h2>Course Description</h2>
            <p>${courseData.description}</p>
          </div>

          <div class="card">
            <h2>📋 Lessons</h2>
            ${['Introduction & Overview', 'Core Concepts', 'Hands-on Practice', 'Advanced Techniques', 'Real World Projects', 'Best Practices', 'Performance Tips', 'Final Assessment'].map((lesson, i) => `
              <div class="lesson">
                <div class="lesson-num">${i + 1}</div>
                <div>
                  <div class="lesson-title">${lesson}</div>
                  <div class="lesson-duration">⏱ ${Math.floor(Math.random() * 20 + 10)} mins</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            )}
            <WebView
                source={{ html: htmlContent }}
                style={styles.webview}
                onLoadEnd={() => setLoading(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    webview: { flex: 1 },
    loader: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'white',
    },
});