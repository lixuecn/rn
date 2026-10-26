import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_TASKS = [
  { id: '1', title: '完成产品首页设计', category: '工作', done: true },
  { id: '2', title: '读 20 页书', category: '成长', done: false },
  { id: '3', title: '晚饭后散步 30 分钟', category: '生活', done: false },
];

const COLORS = {
  ink: '#202235',
  muted: '#8B8EA3',
  purple: '#6C63FF',
  lavender: '#ECEBFF',
  background: '#F6F7FB',
  card: '#FFFFFF',
  line: '#ECECF3',
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [draft, setDraft] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const [filter, setFilter] = useState('all');
  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.done);
    if (filter === 'done') return tasks.filter((task) => task.done);
    return tasks;
  }, [filter, tasks]);

  const addTask = () => {
    const title = draft.trim();
    if (!title) return;
    setTasks((current) => [
      ...current,
      { id: String(Date.now()), title, category: '其他', done: false },
    ]);
    setDraft('');
  };

  const toggleTask = (id) => {
    setTasks((current) => current.map((task) => (
      task.id === id ? { ...task, done: !task.done } : task
    )));
  };

  const removeTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const resetTasks = () => setTasks(INITIAL_TASKS);

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.done }}
        onPress={() => toggleTask(item.id)}
        style={[styles.checkbox, item.done && styles.checkboxDone]}
      >
        {item.done && <Ionicons name="checkmark" size={17} color="#FFF" />}
      </Pressable>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>{item.title}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <Pressable accessibilityLabel="删除任务" hitSlop={10} onPress={() => removeTask(item.id)}>
        <Ionicons name="trash-outline" size={19} color="#B8BAC8" />
      </Pressable>
    </View>
  );

  const taskView = (
    <FlatList
      data={filteredTasks}
      keyExtractor={(item) => item.id}
      renderItem={renderTask}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={(
        <>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>MONDAY, OCTOBER 26</Text>
              <Text style={styles.greeting}>今天也要专注呀 <Text style={styles.wave}>✦</Text></Text>
            </View>
            <View style={styles.avatar}><Text style={styles.avatarText}>Y</Text></View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <View>
                <Text style={styles.progressLabel}>今日进度</Text>
                <Text style={styles.progressCount}>{completed} <Text style={styles.progressTotal}>/ {tasks.length} 项完成</Text></Text>
              </View>
              <View style={styles.iconCircle}><Ionicons name="sparkles" size={20} color={COLORS.purple} /></View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }]} />
            </View>
            <Text style={styles.encouragement}>{completed === tasks.length && tasks.length > 0 ? '太棒了，全部完成！' : '保持节奏，慢慢来就好'}</Text>
          </View>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>我的任务</Text>
            <Text style={styles.taskCount}>{tasks.length} 项</Text>
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="add-circle-outline" size={22} color={COLORS.purple} />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={addTask}
              placeholder="添加一个新任务..."
              placeholderTextColor="#A7A9B8"
              returnKeyType="done"
              style={styles.input}
            />
            <Pressable onPress={addTask} style={styles.addButton}>
              <Ionicons name="arrow-up" size={18} color="#FFF" />
            </Pressable>
          </View>
          <View style={styles.filterRow}>
            {[['all', '全部'], ['active', '未完成'], ['done', '已完成']].map(([key, label]) => (
              <Pressable key={key} onPress={() => setFilter(key)} style={[styles.filterPill, filter === key && styles.filterPillActive]}>
                <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>{filter === 'all' ? '还没有任务，添加一个开始吧。' : '这个筛选条件下没有任务。'}</Text>}
    />
  );

  const statsView = (
    <FlatList
      data={[]}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={(
        <>
          <Text style={styles.pageTitle}>完成统计</Text>
          <Text style={styles.pageSubtitle}>把每一次完成，都变成继续前进的动力。</Text>
          <View style={styles.statsHero}>
            <Text style={styles.statsNumber}>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</Text>
            <Text style={styles.statsLabel}>今日完成率</Text>
          </View>
          <View style={styles.statGrid}>
            <View style={styles.statBox}><Text style={styles.statValue}>{tasks.length}</Text><Text style={styles.statCaption}>总任务</Text></View>
            <View style={styles.statBox}><Text style={styles.statValue}>{completed}</Text><Text style={styles.statCaption}>已完成</Text></View>
            <View style={styles.statBox}><Text style={styles.statValue}>{tasks.length - completed}</Text><Text style={styles.statCaption}>待完成</Text></View>
          </View>
          <View style={styles.tipCard}><Ionicons name="bulb-outline" size={22} color={COLORS.purple} /><Text style={styles.tipText}>一次专注完成一个小任务，持续积累就会有很大进步。</Text></View>
        </>
      )}
    />
  );

  const settingsView = (
    <FlatList
      data={[]}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={(
        <>
          <Text style={styles.pageTitle}>设置</Text>
          <Text style={styles.pageSubtitle}>让 Focus Today 更符合你的习惯。</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingIcon}><Ionicons name="refresh-outline" size={21} color={COLORS.purple} /></View>
            <View style={styles.settingCopy}><Text style={styles.settingTitle}>恢复示例任务</Text><Text style={styles.settingDescription}>重新加载初始任务数据</Text></View>
            <Pressable onPress={resetTasks} style={styles.resetButton}><Text style={styles.resetText}>恢复</Text></Pressable>
          </View>
          <View style={styles.aboutCard}><Text style={styles.aboutTitle}>Focus Today</Text><Text style={styles.aboutText}>一个简单、专注、没有压力的任务清单。</Text><Text style={styles.version}>版本 1.0.0</Text></View>
        </>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {activeTab === 'tasks' ? taskView : activeTab === 'stats' ? statsView : settingsView}
        <View style={styles.tabBar}>
          <Pressable onPress={() => setActiveTab('tasks')} style={styles.tabItem}><Ionicons name="list" size={22} color={activeTab === 'tasks' ? COLORS.purple : '#A6A8B6'} /><Text style={[styles.tabText, activeTab === 'tasks' && styles.tabActive]}>任务</Text></Pressable>
          <Pressable onPress={() => setActiveTab('stats')} style={styles.tabItem}><Ionicons name="stats-chart-outline" size={22} color={activeTab === 'stats' ? COLORS.purple : '#A6A8B6'} /><Text style={[styles.tabText, activeTab === 'stats' && styles.tabActive]}>统计</Text></Pressable>
          <Pressable onPress={() => setActiveTab('settings')} style={styles.tabItem}><Ionicons name="settings-outline" size={22} color={activeTab === 'settings' ? COLORS.purple : '#A6A8B6'} /><Text style={[styles.tabText, activeTab === 'settings' && styles.tabActive]}>设置</Text></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  listContent: { padding: 22, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  eyebrow: { color: COLORS.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.3, marginBottom: 7 },
  greeting: { color: COLORS.ink, fontSize: 26, fontWeight: '800' },
  wave: { color: COLORS.purple },
  avatar: { width: 45, height: 45, borderRadius: 16, backgroundColor: '#FFD7C7', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#9A5A46', fontWeight: '800', fontSize: 18 },
  progressCard: { backgroundColor: COLORS.purple, borderRadius: 24, padding: 20, marginBottom: 28, shadowColor: COLORS.purple, shadowOpacity: 0.25, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  progressLabel: { color: '#DCD9FF', fontSize: 14, fontWeight: '600', marginBottom: 7 },
  progressCount: { color: '#FFF', fontSize: 30, fontWeight: '800' },
  progressTotal: { color: '#DCD9FF', fontSize: 14, fontWeight: '600' },
  iconCircle: { backgroundColor: 'rgba(255,255,255,0.17)', width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 5, marginTop: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 5 },
  encouragement: { color: '#E7E5FF', fontSize: 12, marginTop: 12 },
  sectionHeading: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 14 },
  sectionTitle: { color: COLORS.ink, fontSize: 20, fontWeight: '800' },
  taskCount: { color: COLORS.muted, fontSize: 13, marginLeft: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 17, paddingLeft: 15, paddingRight: 8, height: 58, marginBottom: 14, borderWidth: 1, borderColor: COLORS.line },
  input: { flex: 1, color: COLORS.ink, fontSize: 14, marginHorizontal: 10 },
  addButton: { backgroundColor: COLORS.purple, width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EBECF3' },
  filterPillActive: { backgroundColor: COLORS.lavender },
  filterText: { color: COLORS.muted, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: COLORS.purple },
  taskCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 11, borderWidth: 1, borderColor: COLORS.line },
  checkbox: { width: 23, height: 23, borderRadius: 8, borderWidth: 1.5, borderColor: '#D4D5E0', alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { borderColor: COLORS.purple, backgroundColor: COLORS.purple },
  taskContent: { flex: 1, marginHorizontal: 13 },
  taskTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '700', marginBottom: 5 },
  taskTitleDone: { color: '#A4A6B3', textDecorationLine: 'line-through' },
  category: { color: COLORS.muted, fontSize: 12 },
  emptyText: { color: COLORS.muted, textAlign: 'center', paddingTop: 30 },
  pageTitle: { color: COLORS.ink, fontSize: 29, fontWeight: '800', marginTop: 12, marginBottom: 8 },
  pageSubtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  statsHero: { backgroundColor: COLORS.purple, borderRadius: 24, paddingVertical: 32, alignItems: 'center', marginBottom: 14 },
  statsNumber: { color: '#FFF', fontSize: 48, fontWeight: '800' },
  statsLabel: { color: '#E5E3FF', fontSize: 13, marginTop: 4 },
  statGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statBox: { flex: 1, backgroundColor: COLORS.card, borderRadius: 18, paddingVertical: 19, alignItems: 'center', borderWidth: 1, borderColor: COLORS.line },
  statValue: { color: COLORS.ink, fontSize: 25, fontWeight: '800', marginBottom: 4 },
  statCaption: { color: COLORS.muted, fontSize: 12 },
  tipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lavender, borderRadius: 18, padding: 16, gap: 12 },
  tipText: { flex: 1, color: '#5954A7', fontSize: 13, lineHeight: 20 },
  settingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 18, padding: 15, borderWidth: 1, borderColor: COLORS.line, marginBottom: 14 },
  settingIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lavender },
  settingCopy: { flex: 1, marginHorizontal: 12 },
  settingTitle: { color: COLORS.ink, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  settingDescription: { color: COLORS.muted, fontSize: 12 },
  resetButton: { backgroundColor: COLORS.lavender, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9 },
  resetText: { color: COLORS.purple, fontWeight: '700', fontSize: 12 },
  aboutCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: COLORS.line },
  aboutTitle: { color: COLORS.ink, fontSize: 17, fontWeight: '800', marginBottom: 7 },
  aboutText: { color: COLORS.muted, fontSize: 13, marginBottom: 18 },
  version: { color: '#B0B2BF', fontSize: 11 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 82, paddingBottom: 14, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: COLORS.line, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center', gap: 4 },
  tabText: { color: '#A6A8B6', fontSize: 11, fontWeight: '600' },
  tabActive: { color: COLORS.purple },
});
