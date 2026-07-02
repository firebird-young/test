/**
 * @name 我的（元宇宙商场）
 */

import React, { useState } from 'react';
import {
    BadgeCheck,
    BarChart3,
    ChevronRight,
    Compass,
    Copy,
    Gem,
    Headphones,
    Heart,
    Home,
    ScrollText,
    Settings,
    ShieldCheck,
    User,
    Wallet,
} from 'lucide-react';
import './style.css';

const WALLET_FULL = '0x7a3e8f2b1c9d5e6a4f3d2c1b0a9e8f7d';
const WALLET_SHORT = '0x7a3e...b9c1d';

interface MenuItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    tone: string;
}

const GROUP_ONE: MenuItem[] = [
    { key: 'wallet', label: '我的钱包', icon: <Wallet size={20} strokeWidth={2} />, tone: 'tone-amber' },
    { key: 'order', label: '订单管理', icon: <ScrollText size={20} strokeWidth={2} />, tone: 'tone-green' },
    { key: 'favorite', label: '我的收藏', icon: <Heart size={20} strokeWidth={2} />, tone: 'tone-pink' },
    { key: 'auth', label: '实名认证', icon: <ShieldCheck size={20} strokeWidth={2} />, tone: 'tone-blue' },
];

const GROUP_TWO: MenuItem[] = [
    { key: 'contact', label: '联系我们', icon: <Headphones size={20} strokeWidth={2} />, tone: 'tone-rose' },
    { key: 'settings', label: '设置', icon: <Settings size={20} strokeWidth={2} />, tone: 'tone-slate' },
];

const NAV = [
    { key: 'home', label: '首页', icon: <Home size={20} strokeWidth={2} /> },
    { key: 'discover', label: '发现', icon: <Compass size={20} strokeWidth={2} /> },
    { key: 'asset', label: '资产', icon: <Gem size={20} strokeWidth={2} /> },
    { key: 'market', label: '市场', icon: <BarChart3 size={20} strokeWidth={2} /> },
    { key: 'mine', label: '我的', icon: <User size={20} strokeWidth={2} /> },
];

export default function MallProfile() {
    const [toast, setToast] = useState(false);

    const copyWallet = () => {
        const done = () => {
            setToast(true);
            window.setTimeout(() => setToast(false), 1600);
        };
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(WALLET_FULL).then(done).catch(done);
        } else {
            done();
        }
    };

    const renderMenu = (items: MenuItem[]) => (
        <div className="service-card">
            {items.map((item) => (
                <button type="button" key={item.key} className="menu-item">
                    <span className="menu-left">
                        <span className={`mi-icon ${item.tone}`}>{item.icon}</span>
                        <span className="mi-text">{item.label}</span>
                    </span>
                    <ChevronRight size={16} className="mi-arrow" />
                </button>
            ))}
        </div>
    );

    return (
        <div className="mp-root chinese-font">
            <div className="mp-bg" aria-hidden />
            <div className="page">
                <header className="page-head">
                    <h1 className="page-title">我的</h1>
                    <p className="page-sub">METAVERSE&nbsp;MALL</p>
                </header>

                {/* 用户卡片 */}
                <section className="user-card">
                    <div className="avatar">
                        <User size={26} strokeWidth={2} />
                    </div>
                    <div className="user-info">
                        <div className="nickname">元宇宙探索者</div>
                        <button type="button" className="wallet-addr" onClick={copyWallet}>
                            <span>{WALLET_SHORT}</span>
                            <Copy size={12} />
                        </button>
                    </div>
                    <span className="vip-tag">
                        <BadgeCheck size={13} />
                        白银用户
                    </span>
                </section>

                {/* 资产卡片 */}
                <section className="asset-card">
                    <div className="asset-left">
                        <div className="asset-label">持有资产</div>
                        <div className="asset-num">8</div>
                        <div className="asset-link">
                            详情 <ChevronRight size={12} />
                        </div>
                    </div>
                    <div className="asset-visual" aria-hidden>
                        <Gem size={52} strokeWidth={1.4} />
                    </div>
                </section>

                {renderMenu(GROUP_ONE)}
                {renderMenu(GROUP_TWO)}
            </div>

            {/* 悬浮底部导航 */}
            <nav className="bnav">
                {NAV.map((item) => (
                    <button
                        type="button"
                        key={item.key}
                        className={`ni ${item.key === 'mine' ? 'on' : ''}`}
                    >
                        <span className="ico">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className={`toast ${toast ? 'show' : ''}`}>钱包地址已复制</div>
        </div>
    );
}
