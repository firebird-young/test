import React, { useState } from 'react';
import {
    Bell,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Home,
    MapPin,
    MessageSquare,
    QrCode,
    Star,
    User,
    Users,
    X,
} from 'lucide-react';
import PhoneFrame from '../components/PhoneFrame';

type TabKey = 'grouped' | 'completed';

interface GroupedCourse {
    id: string;
    title: string;
    tags: string;
    dateRange: string;
    duration: string;
    location: string;
    people: number;
    capacity: number;
    countdown: string;
}

interface CompletedCourse {
    id: string;
    title: string;
    tags: string;
    dateRange: string;
    people: number;
    rating: number;
}

const GROUPED: GroupedCourse[] = [
    {
        id: 'g1',
        title: '敦煌丝路文化研学营',
        tags: '历史人文 · 户外',
        dateRange: '07/15 - 07/20',
        duration: '6天5晚',
        location: '甘肃 · 敦煌',
        people: 32,
        capacity: 32,
        countdown: '13天后出行',
    },
    {
        id: 'g2',
        title: '西安·周秦汉唐探索营',
        tags: '历史 · 博物馆',
        dateRange: '07/22 - 07/25',
        duration: '4天3晚',
        location: '陕西 · 西安',
        people: 28,
        capacity: 30,
        countdown: '20天后出行',
    },
    {
        id: 'g3',
        title: '云南民族生态研学营',
        tags: '自然 · 民族',
        dateRange: '08/02 - 08/08',
        duration: '7天6晚',
        location: '云南 · 大理',
        people: 24,
        capacity: 24,
        countdown: '31天后出行',
    },
];

const COMPLETED: CompletedCourse[] = [
    {
        id: 'c1',
        title: '北京·故宫国博研学营',
        tags: '历史 · 博物馆',
        dateRange: '2026/06/05 - 06/10',
        people: 30,
        rating: 4.9,
    },
    {
        id: 'c2',
        title: '泰山地质科考营',
        tags: '自然 · 地理',
        dateRange: '2026/05/18 - 05/22',
        people: 26,
        rating: 4.8,
    },
    {
        id: 'c3',
        title: '上海科技创新研学营',
        tags: '科技 · 创新',
        dateRange: '2026/05/01 - 05/05',
        people: 35,
        rating: 4.7,
    },
];

export default function HomePage() {
    const [tab, setTab] = useState<TabKey>('grouped');
    const [scanOpen, setScanOpen] = useState(false);

    const openScan = () => setScanOpen(true);
    const closeScan = () => setScanOpen(false);

    return (
        <PhoneFrame>
            {/* App 内容 */}
            <div className="app">
                <header className="app-head">
                    <div className="head-text">
                        <p className="greeting">下午好，李老师</p>
                        <p className="org">
                            星辰研学 · 课程管理
                            <ChevronRight size={14} />
                        </p>
                    </div>
                    <button type="button" className="bell" aria-label="通知">
                        <Bell size={20} />
                        <span className="bell-dot" />
                    </button>
                </header>

                {/* 概览 */}
                <section className="overview">
                    <div className="ov-item">
                        <span className="ov-num">2</span>
                        <span className="ov-label">待出行团</span>
                    </div>
                    <span className="ov-divider" />
                    <div className="ov-item">
                        <span className="ov-num">46</span>
                        <span className="ov-label">待核销出行人</span>
                    </div>
                    <span className="ov-divider" />
                    <div className="ov-item">
                        <span className="ov-num">84</span>
                        <span className="ov-label">在营学员</span>
                    </div>
                </section>

                {/* 分段切换 */}
                <div className="segmented">
                    <button
                        type="button"
                        className={tab === 'grouped' ? 'seg on' : 'seg'}
                        onClick={() => setTab('grouped')}
                    >
                        已成团课程<span className="seg-count">{GROUPED.length}</span>
                    </button>
                    <button
                        type="button"
                        className={tab === 'completed' ? 'seg on' : 'seg'}
                        onClick={() => setTab('completed')}
                    >
                        已完成课程<span className="seg-count">{COMPLETED.length}</span>
                    </button>
                </div>

                {/* 课程列表 */}
                <div className="course-list">
                    {tab === 'grouped'
                        ? GROUPED.map((c) => (
                              <article key={c.id} className="course-card">
                                  <div className="cc-top">
                                      <div className="cc-title-wrap">
                                          <h3 className="cc-title">{c.title}</h3>
                                          <p className="cc-tags">{c.tags}</p>
                                      </div>
                                      <span className="badge badge-grouped">已成团</span>
                                  </div>

                                  <div className="cc-meta">
                                      <span className="meta">
                                          <Calendar size={14} />
                                          {c.dateRange}
                                      </span>
                                      <span className="meta">
                                          <Clock size={14} />
                                          {c.duration}
                                      </span>
                                      <span className="meta">
                                          <MapPin size={14} />
                                          {c.location}
                                      </span>
                                  </div>

                                  <div className="cc-foot">
                                      <span className="cc-people">
                                          <Users size={15} />
                                          出行人 {c.people}/{c.capacity}
                                          <span className="cc-countdown">· {c.countdown}</span>
                                      </span>
                                      <button type="button" className="cc-action" onClick={openScan}>
                                          <QrCode size={15} />
                                          核销出行人
                                      </button>
                                  </div>
                              </article>
                          ))
                        : COMPLETED.map((c) => (
                              <article key={c.id} className="course-card is-done">
                                  <div className="cc-top">
                                      <div className="cc-title-wrap">
                                          <h3 className="cc-title">{c.title}</h3>
                                          <p className="cc-tags">{c.tags}</p>
                                      </div>
                                      <span className="badge badge-done">
                                          <CheckCircle2 size={13} />
                                          已完成
                                      </span>
                                  </div>

                                  <div className="cc-meta">
                                      <span className="meta">
                                          <Calendar size={14} />
                                          {c.dateRange}
                                      </span>
                                      <span className="meta">
                                          <Users size={14} />
                                          参营 {c.people} 人
                                      </span>
                                  </div>

                                  <div className="cc-foot">
                                      <span className="cc-rating">
                                          <Star size={15} className="star" />
                                          家长满意度 {c.rating}
                                      </span>
                                      <button type="button" className="cc-link">
                                          查看结营报告
                                          <ChevronRight size={14} />
                                      </button>
                                  </div>
                              </article>
                          ))}
                </div>
            </div>

            {/* 底部导航 */}
            <nav className="tabbar">
                <button type="button" className="tab on">
                    <Home size={22} />
                    <span>首页</span>
                </button>
                <button type="button" className="tab">
                    <BookOpen size={22} />
                    <span>课程</span>
                </button>

                <div className="scan-slot">
                    <button type="button" className="scan-btn" onClick={openScan}>
                        <QrCode size={26} />
                    </button>
                    <span className="scan-label">扫一扫</span>
                </div>

                <button type="button" className="tab">
                    <MessageSquare size={22} />
                    <span>消息</span>
                </button>
                <button type="button" className="tab">
                    <User size={22} />
                    <span>我的</span>
                </button>
            </nav>

            {/* 扫码遮罩 */}
            {scanOpen && (
                <div className="scan-overlay">
                    <div className="scan-head">
                        <button type="button" className="scan-close" onClick={closeScan}>
                            <X size={22} />
                        </button>
                        <span>扫描出行人二维码</span>
                    </div>

                    <div className="scan-body">
                        <div className="viewfinder">
                            <span className="corner tl" />
                            <span className="corner tr" />
                            <span className="corner bl" />
                            <span className="corner br" />
                            <span className="scan-line" />
                        </div>
                        <p className="scan-hint">将出行人的电子行程码放入框内，即可自动核销</p>
                        <button type="button" className="scan-manual" onClick={closeScan}>
                            手动输入行程编号
                        </button>
                    </div>
                </div>
            )}
        </PhoneFrame>
    );
}
